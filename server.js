'use strict';

const http = require('http');

http.createServer((req, res) => {
	console.log(req.method, req.url);
}).listen(3000, () => {
	console.log('node.js server started you buttmunch. listening on port 3000');
});
