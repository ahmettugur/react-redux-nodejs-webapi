const express = require("express");
const _ = require("lodash");
const amqp = require("amqplib/callback_api");

const router = express.Router();

//Models
const Product = require("../models/Product");

router.get("/products/:categoryId/:page", (req, res) => {
  const { categoryId, page } = req.params;
  const pageSize = 12;
  //   const promise = Product.aggregate([
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "categoryID",
  //           foreignField: "_id",
  //           as: "category"
  //         }
  //       },
  //       {
  //         $unwind: "$category"
  //       }
  //     ]);

  //     promise.then((products) => {
  //       res.json(products);
  //     }).catch((err) => {
  //       res.json(err);
  //     })

  // Product.find({}, (error, data) => {
  //     if (error) {
  //         res.send("Beklenmeyen bir hatayla karşılaşıldı...");
  //     }
  //     else {
  //         res.json(data);
  //     }
  // });

  // const promise = Product.find({ categoryID: categoryId })
  //   .skip((page - 1) * pageSize)
  //   .limit(pageSize);
  const promise =
    categoryId == "0"
      ? Product.find({})
      : Product.find({ categoryID: categoryId });
  promise
    .then(products => {
      var skip = (page - 1) * pageSize;

      const productResponse = {
        products: _.slice(products, skip, skip + pageSize),
        pageCount: parseInt(Math.ceil(products.length / pageSize)),
        pageSize: pageSize,
        currentCategory: categoryId,
        currentPage: page
      };
      res.json(productResponse);
    })
    .catch(err => {
      res.json(err);
    });

  // res.send(arr);
});

router.get("/products/:productId", (req, res) => {
  const id = req.params.productId;
  const promise = Product.findById(id);

  promise
    .then(product => {
      res.json(product);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/admin/products/:page?", (req, res) => {
  const pageSize = 12;
  let { page } = req.params;
  if (!page) {
    page = 1;
  }

  const promise = Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  promise
    .then(products => {
      var skip = (page - 1) * pageSize;

      const productResponse = {
        products: _.slice(products, skip, skip + pageSize),
        pageCount: parseInt(Math.ceil(products.length / pageSize)),
        pageSize: pageSize,
        currentCategory: 0,
        currentPage: page
      };
      res.json(productResponse);
    })
    .catch(err => {
      res.status(400);
      res.json(err);
    });
});

router.post("/admin/products", (req, res) => {
  const product = req.body;
  const promise = Product.create(product);

  promise
    .then(data => {
      if (!data) {
        res.status(400);
        next({ message: "Product cannot be added", status: 400 });
      } else {
        res.status(201);
        res.json(data);
      }
    })
    .catch(err => {
      res.status(400);
      res.json(err);
    });
});

router.put("/admin/products", (req, res) => {
  const product = req.body;
  const promise = Product.findOneAndUpdate({ _id: product._id }, product);

  promise
    .then(data => {
      console.log(data);
      if (!data) {
        res.status(400);
        next({ message: "Product was not found", status: 400 });
      } else {

        amqp.connect(
          "amqp://localhost",
          function(err, conn) {
            conn.createChannel(function(err, ch) {
              var queue = "products";
              ch.assertQueue(queue, { durable: false });
              ch.sendToQueue(queue, Buffer.from( JSON.stringify(data)));
              //console.log(" [x] Sent %s", JSON.stringify(data));
            });
            setTimeout(function() {
              conn.close();
              //process.exit(0);
            }, 500);
          }
        );


        res.status(204);
        res.json(data);
      }
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete("/admin/products/:id", (req, res) => {
  const { id } = req.params;

  const promise = Product.findOneAndDelete({ _id: id });

  promise
    .then(product => {
      if (!product) {
        next({ message: "The product was not found", status: 400 });
      } else {
        res.status(204);
        res.json({ message: "Product was deleted successfully", status: 204 });
      }
    })
    .catch(err => {
      res.status(400);
      res.json(err);
    });
});

module.exports = router;
