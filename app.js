const querystring = require('querystring');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch');
const http = require('http');
const https = require('https');

let url;
let code;
let domain;
let find1;
let num;
let test;
let url2;

app.get('/proxy', function(req, res){
    url = req.query.url;
    url2 = req.query.url;
num = url.indexOf("/");
domain = url.split('/')[num];
url = "https://" + url;
find1 = /(href)="./gi;
fetch(url).then(function (res) {
        return res.text();
    
    }).then(function (text) {
code = text;
url = url.split("?", 1);
    url = url.toString();
var str = url.split("."); 
var type = str[str.length - 1];

    if(type == "png")
    {
        res.setHeader("content-type", "image/png");
    } else{
    if(type == "svg")
    {
        res.setHeader("content-type", "image/svg+xml");
    } else
    {
        if (type == "css")
        {
         res.setHeader("content-type", "text/css");   
        }
        else {
res.setHeader("content-type", "text/html");
    } 
    }
    }
code = code.replace(/href=".\//gi, 'href="http://carbon-proxy.herokuapp.com/proxy?url=' + domain + '/');
code = code.replace(/href="(?!https:\/\/|\/)/gi, 'href="http://carbon-proxy.herokuapp.com/proxy?url=' + url2 + '/');
code = code.replace(/href="\//gi, 'href="http://carbon-proxy.herokuapp.com/proxy?url=' + domain + '/');
code = code.replace(/content="\//gi, 'content="http://carbon-proxy.herokuapp.com/proxy?url=' + url2 + '/');
code = code.replace(/action="\//gi, 'content="http://carbon-proxy.herokuapp.com/proxy?url=' + domain + '/');
code = code.replace(/a href="https\:\/\/www./gi, 'a href="http://carbon-proxy.herokuapp.com/proxy?url=');
code = code.replace(/src="\//gi, 'src="http://carbon-proxy.herokuapp.com/proxy?url=' + url2 + '/');
//code = code.replace(/src=".\//gi, 'src="http://carbon-proxy.herokuapp.com/proxy?url=' + domain + '/');
code = code.replace(/url\("\//gi, 'url("http://carbon-proxy.herokuapp.com/proxy?url=' + url2 + '/');
//code = code.replace(/url\(".\//gi, 'url("http://carbon-proxy.herokuapp.com/proxy?url=' + domain + '/');      
    res.send(domain);
return;
    });
});

app.get('/', function(req, res){
res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.use(express.static('public'))
app.use('/', router);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Our app is running on port ${ PORT }`);
});
