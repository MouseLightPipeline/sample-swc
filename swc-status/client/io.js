  var socket = io();
  
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
  socket.on('traceCount', function(msg) {
    $('#traceCount').text(msg);
  });
  socket.on('traceNodeCount', function(msg) {
    $('#traceNodeCount').text(msg);
  });
  socket.on('structureIdentifierCount', function(msg) {
    $('#structureIdentifierCount').text(msg);
  });
  socket.on('markerLocationCount', function(msg) {
    $('#markerLocationCount').text(msg);
  });
  socket.on('connected', function(msg) {
    $('#service_status').text(msg ? 'up' : 'down');
  });
