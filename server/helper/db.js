const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb://database/store",
    { useNewUrlParser: true ,useUnifiedTopology: true}
  );

  mongoose.connection.on("open", () => {
    console.log("Db Connected");
  });

  mongoose.connection.on("error", err => {
    console.log(err);
  });

  mongoose.Promise = global.Promise;
};
