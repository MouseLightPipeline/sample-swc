const amqp = require("amqplib");

const serverConfig = require("../../config/server.config");

const TRANSFORM_REQUEST_QUEUE = "transform_request_queue";

let channel;

amqp.connect(`amqp://${serverConfig.messageQueue.host}`).then((conn) => {
    // console.log("connect to message queue");
    conn.createChannel().then((ch) => {
        channel = ch;
        // console.log("channel created");
    });

});

function send(str) {
    console.log("send");
    channel.assertQueue(TRANSFORM_REQUEST_QUEUE, {durable: false}).then((ok) => {
        // console.log("queue");
        // console.log("ok");
        channel.sendToQueue(TRANSFORM_REQUEST_QUEUE, new Buffer("Hello World!"));
        // console.log(" [x] Sent Hello World!");
    });
}

module.exports = {
    send: send
};
