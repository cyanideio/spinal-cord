'use strict';

var fs = require('fs');
var urllib = require('urllib');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var static_path = path.normalize(__dirname + '/');
app.use('/', express.static(static_path));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000);
