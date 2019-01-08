const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryName: { type: String, required: [true, "`{PATH}` alanı zorunludur."] },
  description: { type: String, required: [true, "`{PATH}` alanı zorunludur."] },
});


module.exports = mongoose.model("categories",CategorySchema);