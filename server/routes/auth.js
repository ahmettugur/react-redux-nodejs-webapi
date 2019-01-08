const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const router = express.Router();


//Model
const User = require("../models/User");

router.post('/signup', (req, res, next) => {

    const { fullName, email, password } = req.body;
  
    bcrypt.hash(password, 10).then((hash) => {
      const user = new User({
        fullName,
        email,
        password: hash
      })
  
      const promise = user.save();
      promise.then((data) => {
        res.json(data)
      }).catch((err) => {
        res.json(err)
      })
  
    });
  });

router.post("/auth/token",(req,res) => {
    const { email , password  } = req.body;

    User.findOne({email:email},(err,user) => {
        if (!user) {
            res.json({status:false,message:"Authentication failed, user not found"});
        }else {
            bcrypt.compare(password,user.password).then((result) => {
                if (!result) {
                    res.json({
                        status: false,
                        message: "Authentication failed, wrong password"
                      })
                } else {
                    const payload = {
                        email: email
                      };
                      const token = jwt.sign(payload, req.app.get("api_secret_key"), {
                        expiresIn: '10h'
                      });
            
                      res.json({
                        status: true,
                        token: token
                      })
                }
            }); 
        }
    });
});

module.exports = router;