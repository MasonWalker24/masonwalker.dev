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
app.use(express.static('public'))
app.use('/', router);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Our app is running on port ${ PORT }`);
});
