const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Response");

    next();
  },
  (req, res, next) => {
    console.log("2nd Response");
    // res.send("2nd response");
    next();
  },
  (req, res,next) => {
    console.log("3rd Response");
    // res.send("3rd response");
    next();
  },
  (req, res, next) => {
    console.log("4th Response");
    // res.send("4th response");
    next();
  }
);

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});

o/p->error as there is no response in the chain


////////////////////////////////////////
We can wrap routes inside the array:
---->app.use("/route",r1,r2,[r3,r4,r5],r6)
const express = require("express");

const app = express();

app.use(
  "/user",[
  (req, res, next) => {
    console.log("Response");

    next();
  },
  (req, res, next) => {
    console.log("2nd Response");
    // res.send("2nd response");
    next();
  }],
  (req, res, next) => {
    console.log("3rd Response");
    // res.send("3rd response");
    next();
  },
  (req, res, next) => {
    console.log("4th Response");
    res.send("4th response");
    next();
  }
);

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});