  var socket = io();
  
  console.log('running script');
  
  socket.on('db_status', function(msg) {
    console.log('f')
    $('#db_status').text(msg ? 'available' : 'unavailable');
  });
  socket.on('connect', function(msg) {
    console.log('a')
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
  socket.on('file_count', function(msg) {
    console.log('b')
    $('#file_count').text(msg);
  });
  socket.on('sample_count', function(msg) {
    $('#sample_count').text(msg);
  });
  socket.on('connected', function(msg) {
    console.log('c')
    $('#service_status').text(msg ? 'up' : 'down');
  });
