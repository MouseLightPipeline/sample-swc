  // var host = 'http://' + '#{serviceHost}' + ':9651';
  var socket = io();
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
  socket.on('file_count', function(msg) {
    $('#file_count').text(msg);
  });
  socket.on('sample_count', function(msg) {
    $('#sample_count').text(msg);
  });
   socket.on('connected', function(msg) {
    $('#service_status').text(msg ? 'up' : 'down');
  });
 //$('#host').text(host);
  //$('#apilink').attr("href", host + '/docs');
