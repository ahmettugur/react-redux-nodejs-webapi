const http = require("http");
const socketio = require("socket.io");
var amqp = require("amqplib/callback_api");

const server = http.createServer((req, res) => {
  res.end("hello");
});

server.listen(3000);

const io = socketio.listen(server);

io.on("connection", socket => {
  socket.on("roomName", data => {
    console.log("Room Name: " + data.roomName);

    socket.join(data.roomName, () => {
      amqp.connect("amqp://rabbitmq", (err, conn) => {
        conn.createChannel((err, ch) => {
          var queue = "products";
          ch.assertQueue(queue, { durable: false });
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            queue
          );
          ch.consume(
            queue,
            msg => {
              var product = JSON.parse(msg.content.toString());
              io.to(product._id).emit("pushNotify", { product });
              console.log(" [x] Received %s", product.productName);
            },
            { noAck: true }
          );
        });
      });
    });
  });
});
