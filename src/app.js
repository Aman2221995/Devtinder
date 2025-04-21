 const express = require('express');

 const app = express();

  

// This will only match the GET method API call
app.get("/user/:userId/:name/:password",(req,res)=>{
   console.log(req.query);
   console.log(req.params)
   res.send({firstName:"Aman",lastName:"Shukla"})
})



 

 app.listen(7777,()=>{
    console.log("Server is running on port 3000")
 });
