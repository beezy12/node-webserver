// 'use strict';

// const http = require('http');

// http.createServer((req, res) => {
// 	console.log(req.method, req.url);

// 	// status code 200 means ok
// 	res.writeHead(200, {
// 		'Content-type': 'text/html'
// 	});

// 	res.end('<h1>the end is nigh</h1>');
// 	//res.end('<!DOCTYPE><html><head></head><body><h1>butt</h1></body></html>');
// 	// this could be a json, or html

// }).listen(3000, () => {
// 	console.log('node.js server started you buttmunch. listening on port 3000');
// });






// use this to be able to take environment variables at the command line  aka take command line port arguments
/*
AT CONSOLE:   PORT=1337 node --harmony_destructuring server.js

IN browser: localhost:1337        (or whatever port you set as the process.env at the command line)
*/
const { PORT } = process.env


'use strict';

const http = require('http');

http.createServer((req, res) => {
    console.log(req.method, req.url);

     res.writeHead
    res.end("oh we done");

}).listen(PORT, () => {
    console.log(`node.js server started you buttmunch. listening on port ${PORT}`);
});
