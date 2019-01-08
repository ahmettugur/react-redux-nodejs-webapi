const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ProductSchema = new Schema({
  productID: { type: Number },
  productName: { type: String },
  supplierID: { type: Number },
  categoryID: Schema.Types.ObjectId,
  quantityPerUnit: {
    type: String
  },
  unitPrice: { type: Number },
  unitsInStock: {
    type: Number
  },
  unitsOnOrder: {
    type: Number
  },
  reorderLevel: {
    type: Number
  },
  discontinued: { type: Number }
});

module.exports = mongoose.model("products",ProductSchema);


// const ProductSchema = new Schema({
//   productID: { type: Number, required: [true, "`{PATH}` is required."] },
//   productName: { type: String, required: [true, "`{PATH}` is required."] },
//   supplierID: { type: Number, required: [true, "`{PATH}` is required."] },
//   categoryID: Schema.Types.ObjectId,
//   quantityPerUnit: {
//     type: String,
//     required: [true, "`{PATH}` is required."]
//   },
//   unitPrice: { type: Number, required: [true, "`{PATH}` is required."] },
//   unitsInStock: {
//     type: Number,
//     required: [true, "`{PATH}` is required."]
//   },
//   unitsOnOrder: {
//     type: Number,
//     required: [true, "`{PATH}` is required."]
//   },
//   reorderLevel: {
//     type: Number,
//     required: [true, "`{PATH}` is required."]
//   },
//   discontinued: { type: Number, required: [true, "`{PATH}` is required."] }
// });