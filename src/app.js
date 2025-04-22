const express = require("express");

const app = express();

// app.use("/",(err,req,res,next)=>{
//   res.send("Hello")
// })

app.get("/getUserData", (req, res, next) => {
  try {
    throw new Error("vdvdv");
    res.send("User Data send");
  } catch (error) {
    res.status(500).send("Some error please contact support")
  }
  
  
});

app.use("/", (err, req, res, next) => {
  console.log(err)
  if (err) {
    res.status(500).send("something went wrong");
  }
  res.send("Hi");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
