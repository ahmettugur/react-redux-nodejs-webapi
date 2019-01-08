const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb://localhost:27017/store",
    { useNewUrlParser: true }
  );

  mongoose.connection.on("open", () => {
    console.log("Db Connected");
  });

  mongoose.connection.on("error", err => {
    console.log(err);
  });

  mongoose.Promise = global.Promise;
};
