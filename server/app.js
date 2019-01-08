const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
//DB
const db = require("./helper/db");
db();

//Router
const products = require("./routes/products");
const category = require("./routes/category");
const auth = require("./routes/auth")

//Middleware
const verifyToken = require("./middleware/verify-token");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config
const config = require("./config");
app.set("api_secret_key", config.api_secret_key);

app.use("/api/admin", verifyToken);
app.use("/api/", products);
app.use("/api/", category);
app.use("/api/", auth);

app.use((err, req, res, next) => {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({ error: { message: err.message, code: err.status } });
  });

app.listen(5000);
