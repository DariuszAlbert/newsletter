
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");


const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;


  client.setConfig({
    apiKey: process.env.API_KEY,
    server: "us21",
  });


  const run = async () => {
  const response = await client.lists.batchListMembers(process.env.LIST_ID, {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
             FNAME: firstName,
             LNAME: lastName
           }
      }],
  });
  console.log(response.errors[0]);
  if (response.errors[0] === undefined){
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }
  };

  run();
});

app.post("/failure", function(req, res){
  res.redirect("/")
});


app.listen(process.env.PORT || 3000, () =>{
  console.log(`Server running on port 3000...`);
});
