const express = require("express");

const router = express.Router();

//Model
const Category = require("../models/Category");

router.get("/categories", (req, res) => {
  const promise = Category.find({}).sort({ _id: -1 });
  promise
    .then(categogies => {
      res.json(categogies);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  const promise = Category.findById(id);

  promise
    .then(category => {
      res.json(category);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/categories", (req, res, next) => {
  const { categoryName, description } = req.body;

  var category = {
    categoryName,
    description
  };

  const promise = Category.create(category);

  promise
    .then(data => {
      res.status(201);
      res.json(data);
    })
    .catch(err => {
      res.status(400);
      next({ message: err, status: 400 });
    });
});

router.put("/categories", (req, res, next) => {
  const { categoryName, description, _id } = req.body;

  var caetgory = {
    categoryName,
    description
  };

  const promise = Category.findOneAndUpdate(_id, caetgory, { new: true });

  promise
    .then(data => {
      console.log(data);
      if (!data) {
        res.status(400);
        next({ message: "Category was not found", status: 400 });
      } else {
        res.status(204);
        res.json(data);
      }
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete("/categories/:id", (req, res) => {
  const { id } = req.params;

  const promise = Category.findOneAndDelete({_id:id});
  promise
    .then(category => {
      if (!category) {
        next({ message: "The category was not found", status: 400 });
      } else {
        res.status(204);
        res.json({ message: "Category was deleted successfully",status: 204 });
      }
    })
    .catch(err => {
        res.status(400)
      res.json(err);
    });
});

module.exports = router;
