const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: { type: String, required: [true, "`{PATH}` alanı zorunludur."] },
  password: { type: String, required: [true, "`{PATH}` alanı zorunludur."] },
  email: { type: String, required: [true, "`{PATH}` alanı zorunludur."] }
});

module.exports = mongoose.model("users", UserSchema);
