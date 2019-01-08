const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["access-token"] || req.body.token || req.query.token;

  if (token) {
    jwt.verify(token, req.app.get("api_secret_key"), (err, decodedToken) => {
      if (err) {
        next({
          status: 401,
          message: "Failed to authenticate token."
        });
      } else {
        req.decode = decodedToken;
        next();
      }
    });
  } else {
    next({
      status: 401,
      message: "No token provided."
    });
  }
};
