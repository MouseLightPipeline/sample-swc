'use strict';

var Foxx = require('org/arangodb/foxx');
var argv = applicationContext.argv;

var out = require('console');
var log = require('console').log;
var error = require('console').error;

var request = require('org/arangodb/request');

var db = require("org/arangodb").db;
var Histories = require('../repositories/histories');
var History = require('../models/history');
var Neurons = require('../repositories/neurons');
var Neuron = require('../models/neuron');
var NodeSample = require('../models/node_sample');
var Graph = require("@arangodb/general-graph");

var histories = new Histories(
    applicationContext.collection('histories'),
    {model: History}
);

var url = "http://192.168.3.109:9651/api/v1/";

if (argv.length > 0) {
    url = argv[0].url;
}

var neurons = new Neurons(
    db._collection('neurons'),
    {model: Neuron}
);

var response = request.get(url + 'files');

var historyInfo = {
    success: false,
    whenCreated: Date.now()
}

if (response.status === 200) {
    var items = JSON.parse(response.body);
    historyInfo.success = true;
    items.forEach(function(d) {
        // TODO endpoint with sample count as quick check of whether the file has changed.
        // TODO assumes a well formed SWC (parent samples point to real, already parsed samples) - needs to be enforced on swc import
        var sampleResponse = request.get(url + 'samples/forFile/' + d.id);
        
        if (sampleResponse.status === 200) {
            var samples = JSON.parse(sampleResponse.body);
            var graphData = parse(samples);
            refreshGraph(d, true, graphData);
        }
    });

    // log(histories.save(historyInfo).forClient());
} else {
    //log(histories.save(historyInfo).forClient())
    error('Could not acquire transform');
    throw 'Could not acquire transform';
}

function refreshGraph(swcFileJSON, deleteOld, graphData) {
    var graphKey = 'swc_' + swcFileJSON.id;
    
    if (Graph._exists(graphKey)) {
        if (deleteOld) {
            Graph._drop(graphKey, true);
        } else {
            return Graph._graph(graphKey);
        }
    }
    
    var edgeDefinition = [];
    edgeDefinition.push(Graph._relation(graphKey + "_somaContours", [graphKey + "soma", graphKey + "contour"], [graphKey + "soma", graphKey + "contour"]));
    edgeDefinition.push(Graph._relation(graphKey + "links", graphKey + "node", graphKey + "node"));
    
    var graph = Graph._create(graphKey, edgeDefinition);
    
    var nodeCollection = graph[graphKey + "node"];
    var linkCollection = graph[graphKey + "links"];

    var somaCollection = graph[graphKey + "soma"];
    var contourCollection = graph[graphKey + "contour"];
    var somaCountoursCollection = graph[graphKey + "_somaContours"];
    
    var referenceSoma = null;

    graphData.forEach(function(data) {
        if (data) {
            if (data.node.nodeType === "start") {
                if (!referenceSoma) {
                    referenceSoma = data.node;
                }
                somaCollection.save(data.node);
            }
            
            if (data.node.nodeType === "contour") {
                contourCollection.save(data.node);
                var parentNode = graphData[data.node.parent].node;
                if (parentNode.nodeType === "start") {
                    var parentKey = graphKey + "soma" + '/' + parentNode._key;
                    var nodeKey = graphKey + "contour" + '/' + data.node._key;
                    somaCountoursCollection.save(parentKey, nodeKey, {});
                }
            } else {
                nodeCollection.save(data.node);
            }
            
            if (data.node.parent > 0 && data.node.nodeType !== "contour") {
                var parentNode = graphData[data.node.parent].node;
                var parentKey = graphKey + "node" + '/' + parentNode._key;
                var nodeKey = graphKey + "node" + '/' + data.node._key;
                var val = Math.pow(data.node.position.x - parentNode.position.x, 2) + Math.pow(data.node.position.y - parentNode.position.y, 2);
                var inPlaneDistance = Math.sqrt(val);
                var distance = Math.sqrt(val + Math.pow(data.node.position.z - parentNode.position.z, 2))
                var inPlaneSomaDistance = NaN;
                var somaDistance = NaN;
                if (referenceSoma) {
                    val = Math.pow(data.node.position.x - referenceSoma.position.x, 2) + Math.pow(data.node.position.y - referenceSoma.position.y, 2);
                    inPlaneSomaDistance = Math.sqrt(val);
                    somaDistance = Math.sqrt(val + Math.pow(data.node.position.z - referenceSoma.position.z, 2));
                }
                linkCollection.save(parentKey, nodeKey, {inPlaneDistance: inPlaneDistance, distance: distance, inPlaneSomaDistance: inPlaneSomaDistance, somaDistance: somaDistance});
            }
        }
    });
}

function parse(samplesJSON) {
    var graphInput = [];
    
    samplesJSON.forEach(function(sample){
        var nodeType = sample.structure == 1 ? "start" : "end";
        
        graphInput[sample.sampleNumber] = {node: {_key: sample.id, sample: sample.sampleNumber, structureType: sample.structure, nodeType: nodeType,
            position:{x: sample.x, y: sample.y, z: sample.z}, parent: sample.parentNumber, childCount: 0}};
        
        if (sample.parentNumber > 0) {
            graphInput[sample.parentNumber].node.childCount = graphInput[sample.parentNumber].node.childCount + 1;
            
            // Determine whether the parent is (as of the samples discovered so far) a node (single child) or branch.
            // However, never override a start (soma) as a regular node/branch
            if (graphInput[sample.parentNumber].node.nodeType !== "start") {
                if (graphInput[sample.parentNumber].node.childCount > 1) {
                    graphInput[sample.parentNumber].node.nodeType = "branch"
                } else if (graphInput[sample.parentNumber].node.childCount == 1)  {
                    graphInput[sample.parentNumber].node.nodeType = "node"
                }
            }
            
            // From neuromorpo - samples that are soma, but parented by another soma are soma contours.
            if (graphInput[sample.sampleNumber].node.nodeType === "start") {
                graphInput[sample.sampleNumber].node.nodeType = "contour";
            }
        }
    });

    graphInput.sort(function(a, b){return a.node.sample - b.node.sample});
    
    return graphInput;
}
