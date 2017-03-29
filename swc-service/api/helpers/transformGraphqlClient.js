const ApolloClient = require("apollo-client").ApolloClient;
const createNetworkInterface = require("apollo-client").createNetworkInterface;
const gql = require("graphql-tag");

require("isomorphic-fetch");

const debug = require("debug")("mouselight:swc-service:transform-client");

const serverConfig = require("../../config/server.config");

class TransformApiClient {
    constructor() {
        const url = `http://${serverConfig.transformService.host}:${serverConfig.transformService.port}/graphql`;
        debug(`creating apollo client during query tasks with ${url}`);
        const networkInterface = createNetworkInterface({uri: url});

        this._client = new ApolloClient({
            networkInterface: networkInterface,
        });
    }

    queryTracing(id) {
        return this._client.query({
            query: gql`
                query($id: String!) {
                    tracing(id: $id) {
                        id
                        swcTracing {
                            id
                        }
                    }
                }`,
            variables: {
                id: id
            },
            forceFetch: true
        });

    }

    transformTracing(id) {
        return this._client.mutate({
            mutation: gql`
                mutation applyTransform($id: String!) {
                    applyTransform(swcId: $id) {
                        tracing {
                            id
                        }
                        errors
                    }
                }`,
            variables: {
                id: id
            }
        });
    }
}

module.exports = {
    Instance: new TransformApiClient()
};
