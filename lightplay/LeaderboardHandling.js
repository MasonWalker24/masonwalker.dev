const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router;
const fs = require('fs');
const querystring = require('querystring');


app.get("/", function(req,res){
  res.send("hello world");
});

app.get("/test", function(req,res){
  console.log("tested");
  res.send(req.headers["x-unity-client"]);
});

app.get("/retrieveall", function(req,res){
  const scores = fs.readFileSync("./lightplay/scores.txt", 'utf8');
  console.log("retrieved");
  res.send(scores);
});

app.get("/scoretobeat", function(req,res){
  const scores = fs.readFileSync("./lightplay/scores.txt", "utf8");
  var scoreList = scores.split(",");
  if(scoreList.length < 4){
    res.send(0);
  } else{
    res.send(scoreList[4].split(":")[1]);
  }
});

app.get("/addscore", function(req, res){
  if(req.headers["x-unity-client"] == "lightplay") {
    let name = req.query.name;
    let score = parseInt(req.query.score, 10);
    let scores = fs.readFileSync("./lightplay/scores.txt", 'utf8').split(",");
    let numbers = new Array(5);
    i = 0;
    while(5 > i){
      numbers[i] = parseInt(scores[i].split(":")[1])
      i++;
    }
    i = 0;
    let found = false;
    while(5 > i && !found){
      if(numbers[i] < score){
        found = true;
      }else{
        i++;
      }
    }
    let newEntry = name + ":" + score;
    let newScores = new Array(5);
    j = 0;
    let bonus = 0;
    while(j < scores.length){
      if(j == i){
        newScores[j] = newEntry;
        bonus = 1;
      } else{
        newScores[j] = scores[j-bonus];
      }
      j++;
    }
    fs.writeFileSync("./lightplay/scores.txt", newScores.join());
    res.send("added");
  } else{
    res.send("invalid source");
  }
});

app.use(express.static('public'))
app.use('/', router);
module.exports = app;