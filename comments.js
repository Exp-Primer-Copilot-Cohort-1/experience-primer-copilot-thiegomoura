// Create web server
// Run: node comments.js
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var comments = [];

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/') {
        fs.readFile('./comments.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (pathname == '/comment') {
        var data = '';
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            var obj = qs.parse(data);
            comments.push(obj.comment);
            var str = JSON.stringify(comments);
            fs.writeFile('./comment.json', str, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('write file success');
            });
            res.end();
        });
    } else if (pathname == '/getcomment') {
        fs.readFile('./comment.json', 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(data);
            res.end();
        });
    } else {
        var realPath = path.join('./', pathname);
        fs.exists(realPath, function (exists) {
            if (!exists) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('This request URL ' + pathname + ' was not found on this server.');
                res.end();
            } else {
                fs.readFile(realPath, 'binary', function (err, file) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        res.write(file, 'binary');
                        res.end();
                    }
                });
            }
        });
    }
}).listen(3000, '