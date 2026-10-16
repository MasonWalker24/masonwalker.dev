const express = require('express');
const app = express();
const router = express.Router();

app.get('/', function(req, res){
res.sendFile('index.html', { root: __dirname + "/public" } );
});
//CarbonProxy Stuff

const querystring = require('querystring');
const path = require('path');
const fetch = require('node-fetch');
const http = require('http');
const https = require('https');
const fs = require('fs');
let url;
let code;
let domain
let pageType;
let resHeaders;
app.get('/carbonproxy', function(req, res) {
  res.sendFile('carbonproxy.html', { root: __dirname + "/CarbonProxy" } );
});
app.use(express.static('CarbonProxy'));
app.get('/proxy', function(req, res) {
  url = req.query.url;
  domain = url.split("/")[0];

  pageType = url.split(".");
  let length = pageType.length;
  pageType = pageType[length-1];

  url = "https://" + url;

  //const myHeaders = new fetch.Headers();

  fetch(url).then(function(res) {
    resHeaders = res.headers.get('content-type');
    return res.text();

  }).then(function(text) {
    code = text;

      //console.log(resHeaders.toString());
    
    //set headers
    res.setHeader('content-type', resHeaders);
    //replacements
    //href
        code = code.replace(/(?<!\/)href="\//g, 'href="/proxy?url=' + domain + "/"); 
    code = code.replace(/href=".\//g, 'href="/proxy?url=');
    code = code.replace(/href="(?=\w)(?!http)/g, 'href="/proxy?url=' + domain + "/");
    code = code.replace(/href="https:\/\//g, 'href="/proxy?url=');
    //src
    code = code.replace(/(?<!\/)src="\//g, 'src="/proxy?url=' + domain + "/"); 
    code = code.replace(/src=".\//g, 'src="/proxy?url=');
    code = code.replace(/src="(?=\w)(?!http)/g, 'src="/proxy?url=' + domain + "/");
    code = code.replace(/src="https:\/\//g, 'src="/proxy?url=');
    //action
    code = code.replace(/(?<!\/)action="\//g, 'action="/proxy?url=' + domain + "/"); 
    code = code.replace(/action=".\//g, 'action="/proxy?url=');
    code = code.replace(/action="(?=\w)(?!http)/g, 'action="/proxy?url=' + domain + "/");
    code = code.replace(/action="https:\/\//g, 'action="/proxy?url=');
    
    //console.log(code);
    res.send(code);
    return;
  });
});

//End CarbonProxy Stuff

//begin lightplay leaderboard handling
app.get("/lightplay/retrieveall", function(req,res){
  const scores = fs.readFileSync("lightplay/scores.txt", 'utf8');
  console.log("retrieved");
  res.send(scores);
});

app.get("/lightplay/scoretobeat", function(req,res){
  const scores = fs.readFileSync("lightplay/scores.txt", "utf8");
  var scoreList = scores.split(",");
  if(scoreList.length < 4){
    res.send(0);
  } else{
    res.send(scoreList[4].split(":")[1]);
  }
});

app.get("/lightplay/addscore", function(req, res){
  if(req.headers["x-unity-client"] == "lightplay") {
    let name = req.query.name;
    let score = parseInt(req.query.score, 10);
    let scores = fs.readFileSync("lightplay/scores.txt", 'utf8').split(",");
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
    fs.writeFileSync("scores.txt", newScores.join());
    res.send("added");
  } else{
    res.send("invalid source");
  }
});

app.use(express.static('public'))
app.use('/', router);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Our app is running on port ${ PORT }`);
});
