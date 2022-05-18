// boiler plate code

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const aws = require('aws-sdk');


const app = express();



app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



let s3 = new aws.S3({
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  URL: process.env.URL,
  TOKEN_TYPE: process.env.TOKEN_TYPE
});


let date;
function getYear() { //For the copyright year
  date = new Date().getFullYear();
}

getYear();

// Getting access token with OAuth Credentials

  const url = process.env.URL;
  let AT = "";
  let userId = "";
  let followers;

  const options = {
    method: "POST",
    json: true,
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials"
    }
  }

  const reqs = https.request(url, options, function(response){
    response.on("data", function(data){

      let myObj = data;
      AT = JSON.parse(myObj).access_token;
      // process.stdout.write(data);
    });
  });

  reqs.on('error', (e) => {
    console.error("error 1: "+ e);
    console.log("passed through here");
  });

  reqs.end();

// GET requests for channel follower count
app.get("/", function(req, res){

  const optionals = {
    method: "GET",
    dataType: 'json',
    headers: {
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + AT,
      Accept: "application/vnd.twitchtv.v5+json"
    }
  }



      https.get("https://api.twitch.tv/helix/users?login=veeetag", optionals, function(response){
        // console.log('2. statusCode:', response.statusCode);
        // console.log("2. headers:", response.headers);

        response.on("data", (d) => {
          let channel = JSON.parse(d);
          userId = channel.data[0].id;
          // process.stdout.write(d);
        });
      }).on("error", (e) => {
        console.error("error 2: " + e);
      });

setTimeout(() => {
  https.get('https://api.twitch.tv/helix/users/follows?to_id=' + userId + '&first=1', optionals, function(resp){
    // console.log('3. statusCode:', resp.statusCode);
    // console.log("3. headers:", resp.headers);
    resp.on('data', (da) => {
      followers = JSON.parse(da).total;
      // process.stdout.write(da);
    });
  }).on("error", (e) => {
    console.error("error 3: " + e);
  }).end();

setTimeout( function() {
  // console.log(followers);
  res.render("index", {year: date, total: followers});
}, 1050)

}, 1000);
});

app.get("/about", function(req, res){
  res.render("about", {year: date});
});

app.get("/videos", function(req, res){
  res.render("videos", {year: date});
});


app.post("/", function(req, res){

});

// server

app.listen(process.env.PORT || 3000, function(){
  console.log("listening on port 3000");
});
