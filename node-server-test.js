/*
Node server for young creators app 
*/


// webserver
var express = require('express');
var app = express();
app.use( 
  "/", //the URL throught which you want to access to you static content
  express.static(__dirname+"/app") //where your static content is located in your filesystem
);
app.listen(8000);