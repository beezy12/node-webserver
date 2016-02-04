/******************************************* EXPRESS **************************************************/

// using EXPRESS
'use strict';


// EXPRESS GIVES YOU AN HTTP AUTOMATICALLY
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// this will help you parse the form data into an object
const bodyParser = require('body-parser');

// this gets a files object, that tells where to put our pictures when we upload
// const upload = require('multer')(
//     {
//         dest: 'tmp/baby',

//     });

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/uploads')
    },
    filename: function (req, file, cb) {
        console.log('--------->', file)
        cb(null, Date.now() + file.originalname)
        // cb(null, Date.now() + path.extname(file.originalname))
        console.log('=====>', path.extname)

  }
})

const upload = multer({ storage: storage })







// set creates an express global variable
app.set('view engine', 'jade');

// app.locals.title is a local variable that will be passed to every res.render
// so we no longer need to do title: 'whatever'
app.locals.title = 'Super Neato Land'


// this parses the form data into an object
//app.use(bodyParser.urlencoded({extended: false}));



// this is a middleware function for sass
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

// this one gives a path to anything in public that doesn't already have a path
app.use(express.static(path.join(__dirname, 'public')));
// this one gives a path to anything in views that doesn't already have a path
app.set('views', path.join(__dirname, 'views'));





//const title: 'Super neato land'
// res.render will auto look for a views directory and an index
// passing object with varibles that you can use in index.jade
// res.render is a controller
app.get('/', (req, res) => {
    res.render('index', {
      // title: title,
      // these are varibles that could be used in index
      date: new Date(),
      name: 'briguy',
      age: 36
    });
});


app.get('/contact', (req, res) => {
    res.render('contact');
        // title: title
});



app.post('/contact', (req, res) => {
    //debugger
    console.log(req.body)

    // name here comes from our index.jade input fields, specifically name comes from name="name"
    const name = req.body.name;
    res.send(`<h1>preeeeeeeeesh ${name}</h1>`);
});


app.get('/sendphoto', (req, res) => {
    res.render('sendphoto')
});

// upload.single('image')....'image' comes from the jade template name=""
// so single(fieldname)
// single could be .array or .fields or .any
// .post comes from method="post" in the jade file
app.post('/sendphoto', upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
    res.send('<h1>we thank ye</h1>');
})


app.get('/hello', (req, res) => {
  // query parameters
  const name = req.query.name;
  const msg = `<h1>hello ${name} </h1>`;

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      // this writes one letter at a time
      msg.split('').forEach((char, i) => {
        setTimeout(() => {
          res.write(char);
            }, 1000 * i);
      });

      setTimeout(() => {
        res.end(`goodbye ${name}`);
      }, msg.length * 1000 + 2000);
});











function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// outputs to the dom a random number between min and max. Enter random/1/5 in the url to get a number between 1 and 5
app.get('/random/:min/:max', (req,res)=>{
  const min = req.params.min;
  const max = req.params.max;
  res.end(getRandomInt(+min, +max).toString());
});



app.get('/cal/:calMonth/:calYear', (req, res) => {

  const calMaker = require('node-calendar/lib/month');


  const month = req.params.calMonth;
  const year = req.params.calYear;

  let output = calMaker.outputCal(year, month, 1);

  var butt = calMaker.displayHeader(month, year) + output;
  res.send(`<pre>${butt}</pre>`);

});


app.all('*', (req, res) => {
  // res.writeHead(403);
  // res.end('access denied');
  // or you could do for express
  res.status(403).send('access denied');
});

app.listen(PORT, () => {
    console.log(`node.js server started you buttmunch. listening on port ${PORT}`);
});






// app.get('/random', (req, res) => {
//  res.send(Math.random().toString());
// });


// app.get('/random/:min/:max', (req, res) => {
//  const min = parseInt(req.params.min);
//  const max = parseInt(req.params.max);
//  console.log(max)
//  console.log(min)
//  res.end(Math.random() * (max - min) + min);
// });

// // app.get('/random/:one', (req, res) => {
// //   res.end();
// // });



// /cal/2/2015

// ?month=2&year=2015

// instead of using childprocess.execsync, directly interface with the module
// aka     app.get()

// import cal.js   npm install beezy12 --save    (maybe nss-cohort-11)
// make sure you pull from master, aka merge into master
// look in node_modules to see if cal.js is in there














/************************************************************************************************/


// below is  the first couple ways we set up a server....but above was the final product















// // 'use strict';

// // const http = require('http');

// // http.createServer((req, res) => {
// // 	console.log(req.method, req.url);

// // 	// status code 200 means ok
// // 	res.writeHead(200, {
// // 		'Content-type': 'text/html'
// // 	});

// // 	res.end('<h1>the end is nigh</h1>');
// // 	//res.end('<!DOCTYPE><html><head></head><body><h1>butt</h1></body></html>');
// // 	// this could be a json, or html

// // }).listen(3000, () => {
// // 	console.log('node.js server started you buttmunch. listening on port 3000');
// // });




// // use this to be able to take environment variables at the command line  aka take command line port arguments

// AT CONSOLE:   PORT=1337 node --harmony_destructuring server.js

// IN browser: localhost:1337        (or whatever port you set as the process.env at the command line)



// // go to /hello.....get 'hello world'
// // if /random  get random number
// 'use strict';

// const http = require('http');
// const PORT = process.env.PORT || 3000;

// http.createServer((req, res) => {
//     console.log(req.method, req.url);

//     if(req.url === '/hello') {
//     	res.write("<h1>you say goodbye....</h1>");
//     	setTimeout(() => {
//     		res.end("<h1>....and I say hello</h1>");
//     	}, 5000);

//     } else if (req.url === '/random') {
//     	res.end(Math.random().toString());
//     } else {
//     	res.writeHead(403);
//     	res.end('403: access denied');
//     }




// }).listen(PORT, () => {
//     console.log(`node.js server started you buttmunch. listening on port ${PORT}`);
// });




// 'use strict';

// const http = require('http');
// const PORT = process.env.PORT || 3000;

// http.createServer((req, res) => {
//     console.log(req.method, req.url);

//     if(req.url === '/hello') {
//     	const msg = "<h1>you say goodbye..butt butt butt</h3>";

//     	res.writeHead(200, {
//     		'Content-Type': 'text/html'
//     	});

//     	// this writes one letter at a time
//     	msg.split('').forEach((char, i) => {
//     		setTimeout(() => {
//     			res.write(char);
//    	        }, 1000 * i);
//    		});

//     	setTimeout(() => {
//     		res.end("and I say 'ello");
//     	}, 20000);


//     } else if (req.url === '/random') {
//     	res.end(Math.random().toString());
//     } else {
//     	res.writeHead(403);
//     	res.end('403: access denied');
//     }




// }).listen(PORT, () => {
//     console.log(`node.js server started you buttmunch. listening on port ${PORT}`);
// });









































