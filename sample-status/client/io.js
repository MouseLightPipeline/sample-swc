  var socket = io();
  
  console.log('Running client socket.io script');
  
  socket.on('db_status', function(msg) {
      $('#db_status').text(msg ? 'available' : 'unavailable');
  });
  socket.on('connect', function(msg) {
      $('#server_status').text('up');
  });
  socket.on('reconnect', function(msg) {
    $('#server_status').text('up');
  });
  socket.on('disconnect', function(msg) {
    $('#server_status').text('down');
  });
  socket.on('error', function(msg) {
    $('#server_status').text('throwing errors');
  });
  socket.on('sample_count', function(msg) {
      $('#sample_count').text(msg);
  });
  socket.on('neuron_count', function(msg) {
    $('#neuron_count').text(msg);
  });
  socket.on('injection_count', function(msg) {
      $('#injection_count').text(msg);
  });
  socket.on('registration_count', function(msg) {
      $('#registration_count').text(msg);
  });
  socket.on('structure_count', function(msg) {
      $('#structure_count').text(msg);
  });
  socket.on('virus_count', function(msg) {
      $('#virus_count').text(msg);
  });
  socket.on('strain_count', function(msg) {
      $('#strain_count').text(msg);
  });
  socket.on('connected', function(msg) {
      $('#service_status').text(msg ? 'up' : 'down');
  });
