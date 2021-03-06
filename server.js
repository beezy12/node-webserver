/******************************************* EXPRESS *********************************************/

'use strict';


// EXPRESS GIVES YOU AN HTTP AUTOMATICALLY
const express = require('express');
const app = express();
// this will help you parse the form data into an object
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const path = require('path');
const imgur = require('imgur');
const request = require('request');
const multer = require('multer');
const _ = require('lodash');
const fs = require('fs');
const cheerio = require('cheerio');


// this parses the form data into an object
// this is the standard setup
app.use(bodyParser.urlencoded({extended: false}));
// will parse into a json
app.use(bodyParser.json());


// this uploads a picture to tmp
const storage = multer.diskStorage({
    destination: 'tmp/uploads',

    filename: function (req, file, cb) {
        console.log('--------->', file)
        cb(null, Date.now() + file.originalname)
        // cb(null, Date.now() + path.extname(file.originalname))
        console.log('=====>', path.extname)

  }
})

const upload = multer({ storage: storage })



// json
app.get('/api', (req, res) => {
    // the * means for every route
    res.header('access-control-allow-origin', '*');
    res.send({
        hello: 'pal'
    })
});


app.post('/api', (req, res) => {

    const obj = _.mapValues(req.body, val => val.toUpperCase());
    res.send(obj);

    // console.log(req.body)
    // res.send({yo: 'buddy', hey: 'guy'});

})


app.get('/api/weather', (req, res) => {
    const url = 'https://api.forecast.io/forecast/409982af42c889e99a89fb0f56fa8d13/36.162664,-86.781602';
    request.get(url, (err, response, body) => {
        if(err) throw err;

        res.header('access-control-allow-origin', '*');
        res.send(JSON.parse(body));
    });
});


app.get('api/reddit', (req, res) => {
    const url = 'http://reddit.com';



})


// web scraping here
app.get('/api/news', (req, res) => {
    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
        if(err) throw err;

        const news = [];
        const $ = cheerio.load(html);


        const $bannerText = $('.banner-text');

        // this is called caching the selector. very important. set the $bannerText variable above
        news.push({
            title: $bannerText.text(),
            url: $bannerText.closest('a').attr('href')
        });

        // news.push({
        //     title: $('.banner-text').text(),
        //     url: $('.banner-text').closest('a').attr('href')
        // });


        // eq makes it into a jquery object, so we can use .text and .find
        _.range(1, 12).forEach(i => {
            news.push({
                title: $('.cd__headline').eq(i).text(),
                url: $('.cd__headline').eq(i).find('a').attr('href')
            })
        });

        res.send(news);

    });
});



// set creates an express global variable
app.set('view engine', 'jade');

// app.locals.title is a local variable that will be passed to every res.render
// so we no longer need to do title: 'whatever'
app.locals.title = 'Super Neato Land'






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

// renders the sendphoto jade view when directed to this address
app.get('/sendphoto', (req, res) => {
    res.render('sendphoto')
});

// upload.single('image')....'image' comes from the jade template name=""
// so single(fieldname)
// single could be .array or .fields or .any
// .post comes from method="post" in the jade file

// this allows you to upload a file to imgur, and deletes it from tmp at the same time
app.post('/sendphoto', upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
    console.log('path heeeeeeeer', req.file.path);

    // got this function from the npm imgur docs
    //A single image
    imgur.uploadFile(req.file.path)
        .then(function (json) {
            console.log(json);
            console.log('yo heres your imgur picture link', json.data.link);
        })
        .catch(function (err) {
            console.error(err.message);
        });



    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log('successfully deleted' + req.file.path);
    });

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

  var calOutput = calMaker.displayHeader(month, year) + output;
  res.send(`<pre>${calOutput}</pre>`);

});


app.all('*', (req, res) => {
  // res.writeHead(403);
  // res.end('access denied');
  // or you could do for express
  res.status(403).send('access denied');
});

app.listen(PORT, () => {
    console.log(`node.js server started and listening on port ${PORT}`);
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
// // 	//res.end('<!DOCTYPE><html><head></head><body><h1>yo hey</h1></body></html>');
// // 	// this could be a json, or html

// // }).listen(3000, () => {
// // 	console.log('node.js server started you and listening on port 3000');
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
//     console.log(`node.js server started and listening on port ${PORT}`);
// });




// 'use strict';

// const http = require('http');
// const PORT = process.env.PORT || 3000;

// http.createServer((req, res) => {
//     console.log(req.method, req.url);

//     if(req.url === '/hello') {
//     	const msg = "<h1>you say goodbye....</h3>";

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
//     console.log(`node.js server started and listening on port ${PORT}`);
// });









































