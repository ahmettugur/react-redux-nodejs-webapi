var amqp = require("amqplib/callback_api");

amqp.connect(
  "amqp://localhost",
  (err, conn) => {
    conn.createChannel((err, ch) => {
      var queue = "products";

      ch.assertQueue(queue, { durable: false });
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      ch.consume(
        queue,
        msg => {
          var obj = JSON.parse(msg.content.toString());
          console.log(" [x] Received %s", obj.productName);
        },
        { noAck: true }
      );
    });
  }
);
