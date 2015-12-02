'use strict';

var fs = require('fs');
var urllib = require('urllib');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var static_path = path.normalize(__dirname + '/');
app.use('/', express.static(static_path));

/*
CREATE TABLE `todo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `created` datetime NOT NULL,
  `completed` datetime,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1
*/

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'exotest'
});
db.connect();

function get_request(url, callback) {
    urllib.request(url, function(error, data, response) {
        if (error) {
            console.error("Failed to make request! " + error);
            callback('');
        }
        callback(data.toString());
    });
}

app.post('/api/todo', function(req, res) {
    var d = new Date();
    var data = {
        name: req.body.name,
        description: req.body.description,
        created: d.toISOString(),
        completed: null
    };
    db.query('INSERT INTO todo SET ?', data, function(error, results) {
        db.query('SELECT * FROM todo WHERE id = ?', [results.insertId], function(error, results) {
            res.json(results[0]);
        });
    });
});

app.get('/api/todo', function(req, res) {
    db.query('SELECT * FROM todo', function(error, results) {
        res.json(results);
    });
});

app.get('/api/todo/:todo_id', function(req, res) {
    var todo_id = req.params.todo_id;
    db.query('SELECT * FROM todo WHERE id = ?', [todo_id], function(error, results) {
        res.json(results[0]);
    });
});

app.put('/api/todo/:todo_id', function(req, res) {
    db.query('UPDATE todo SET name = ?, description = ?, completed = ? WHERE id = ?', [
        req.body.name, req.body.description, req.body.completed, req.params.todo_id
    ], function(error, results, fields) {
        console.log(error);
        db.query('SELECT * FROM todo WHERE id = ?', [req.params.todo_id], function(error, results) {
            res.json(results[0]);
        })
    });
});

app.delete('/api/todo/:todo_id', function(req, res) {
    var todo_id = req.params.todo_id;
    db.query('DELETE FROM todo WHERE id = ?', [todo_id], function(error, results) {
        res.json({status: 'ok'});
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000);
