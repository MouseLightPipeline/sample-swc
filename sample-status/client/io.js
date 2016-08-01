var socket = io();

socket.on('connect', function (msg) {
    $('#server_status').text('up');
});
socket.on('connected', function (msg) {
    $('#server_status').text(msg ? 'up' : 'down');
});
socket.on('reconnect', function (msg) {
    $('#server_status').text('up');
});
socket.on('disconnect', function (msg) {
    $('#server_status').text('down');
});
socket.on('error', function (msg) {
    $('#server_status').text('throwing errors');
});

socket.on('servicePort', function (msg) {
    if (msg.length == 0) {
        return;
    }

    var serviceURL = 'http://' + location.hostname + ':' +  msg;
    console.log(serviceURL);

    var serviceSocket = io(serviceURL);

    serviceSocket.on('connect', function (msg) {
        $('#service_status').text('up');
    });
    serviceSocket.on('connected', function (msg) {
        $('#service_status').text(msg ? 'up' : 'down');
    });
    serviceSocket.on('reconnect', function (msg) {
        $('#service_status').text('up');
    });
    serviceSocket.on('disconnect', function (msg) {
        $('#service_status').text('down');
    });
    serviceSocket.on('error', function (msg) {
        $('#service_status').text('throwing errors');
    });

    serviceSocket.on('db_status', function (msg) {
        $('#db_status').text(msg ? 'available' : 'unavailable');
    });

    serviceSocket.on('sampleCount', function (msg) {
        $('#sample_count').text(msg);
    });
    serviceSocket.on('registrationTransformCount', function (msg) {
        $('#registration_transform_count').text(msg);
    });
    serviceSocket.on('mouseStrainCount', function (msg) {
        $('#mouse_strain_count').text(msg);
    });

    serviceSocket.on('injectionCount', function (msg) {
        $('#injection_count').text(msg);
    });
    serviceSocket.on('injectionVirusCount', function (msg) {
        $('#injection_virus_count').text(msg);
    });
    serviceSocket.on('fluorophoreCount', function (msg) {
        $('#fluorophore_count').text(msg);
    });

    serviceSocket.on('neuronCount', function (msg) {
        $('#neuron_count').text(msg);
    });

    serviceSocket.on('brainAreaCount', function (msg) {
        $('#brain_area_count').text(msg);
    });
});
