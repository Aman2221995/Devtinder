const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res, next) => {
  res.send("User Data send");
});

//We don't require to pass userAuth because logged in user does not required
app.post("/user/login",(req,res)=>{
  res.send("User logged in successfully");
})

app.get("/admin/getAllData", (req, res, next) => {
  res.send("All Data send");
});

app.get("/admin/deleteUser", (req, res, next) => {
  res.send("Deleted a user");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
