const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
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
domain = url.split('/')[0];
url = "https://" + url;
find1 = /(href)="./gi;

fetch(url).then(function (res) {
        return res.text();
    }).then(function (text) {
code = text;
var str = url.split("."); 
var type = str[str.length - 1];
if(domain == url2) {
res.setHeader("content-type", "text/html");
} else {
res.setHeader("content-type", "text/" + type);
}
code = code.replace(/href=".\//gi, 'href="http://localhost/proxy?url=' + domain + '/');
code = code.//replace(/href="/gi, 'href="http://localhost/proxy?url=' + url2 + '/');
code = code.replace(/href="\//gi, 'href="http://localhost/proxy?url=' + url2 + '/');
code = code.replace(/src="\//gi, 'src="http://localhost/proxy?url=' + url2 + '/');
code = code.replace(/src=".\//gi, 'src="http://localhost/proxy?url=' + domain + '/');
code = code.replace(/url\("\//gi, 'url("http://localhost/proxy?url=' + url2 + '/');
code = code.replace(/url\(".\//gi, 'url("http://localhost/proxy?url=' + domain + '/');
            res.send(code);
return;
    });
});

app.get('/', function(req, res){
res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.use(express.static('public'))
app.use('/', router);
app.listen(process.env.port || 80);

console.log('Running at Port 80');
