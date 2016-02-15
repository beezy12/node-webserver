/******************************************* EXPRESS *********************************************/

'use strict';


// EXPRESS GIVES YOU AN HTTP AUTOMATICALLY
const express = require('express');
const app = express();
const path = require('path');
const imgur = require('imgur');
const request = require('request');
const multer = require('multer');
const _ = require('lodash');
const fs = require('fs');
const cheerio = require('cheerio');
// var MongoClient = require('mongodb').MongoClient

const PORT = process.env.PORT || 3000;
//const MONGODB_URL = 'mongodb://ds059145.mongolab.com:59145/node-webserver';
//const MONGODB_URL = process.env.MONGODB_URL || localhost;
// let MONGODB_URL;

// if (prqocess.env.NODE_ENV === 'production')



let db;

const mongoose = require('mongoose');
const MongoClient = require('mongoose');

const News = require('./models/allcaps');
const Contact = require('./models/contact')
const AllCaps = require('./models/allcaps');

const routes = require('./routes/routes');

// this will help you parse the form data into an object
const bodyParser = require('body-parser');

// this parses the form data into an object
app.use(bodyParser.urlencoded({extended: false}));
// will parse into a json
app.use(bodyParser.json());

app.use(routes);





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
    res.header('access-control-allow-origin', '*');
    res.send({
        hello: 'pal'
    })
});


app.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());

  db.collection('allcaps').insertOne(obj, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.send(result.ops[0]);
  });
});


app.get('/api/weather', (req, res) => {
    const url = 'https://api.forecast.io/forecast/409982af42c889e99a89fb0f56fa8d13/36.162664,-86.781602';
    request.get(url, (err, response, body) => {
        if(err) throw err;

        res.header('access-control-allow-origin', '*');
        res.send(JSON.parse(body));
    });
});



// make a webscraper here
// anderson's code
// change all reddit links to rick rolls
// app.get('/api/reddit', (req, res) => {
//   const url = 'https://www.reddit.com';
//   request.get(url, (err, response, html) => {
//     if (err) throw err;
//     const $ = cheerio.load(html);
//     const $a = $('.title.may-blank');
//     _.range(0, $a.length).forEach(i => {
//       $a.eq(i).attr('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
//     });
//   res.send($.html());
//   });
// });


app.get('api/reddit', (req, res) => {
    const url = 'http://www.reddit.com';

    if(err) throw err;

    res.header('')

})



// app.get('/api/news', (req, res) => {
//     const url = 'http://cnn.com';

//     request.get(url, (err, response, html) => {
//         if(err) throw err;

//     const news = [];
//     const $ = cheerio.load(html);


//     const $bannerText = $('.banner-text');

//     // this is called caching the selector. very important. set the $bannerText variable above
//     news.push({
//         title: $bannerText.text(),
//         url: $bannerText.closest('a').attr('href')
//     });

//     // news.push({
//     //     title: $('.banner-text').text(),
//     //     url: $('.banner-text').closest('a').attr('href')
//     // });


//     // eq makes it into a jquery object, so we can use .text and .find
//     _.range(1, 12).forEach(i => {
//         news.push({
//             title: $('.cd__headline').eq(i).text() ,
//             url: $('.cd__headline').eq(i).find('a').attr('href')
//         })
//     });

//     res.send(news);

//     });
// });



app.get('/api/news', (req, res) => {
  db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
    console.log(doc._id.getTimestamp())

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });

      db.collection('news').insertOne({ top: news }, (err, result) => {
        if (err) throw err;

        res.send(news);
      });
    });
  });
});






    // if empty fetch ---> insert db


    // if < 15 old, send latest


    // if > 15 old fetch ----> insert db


//     request.get(url, (err, response, html) => {
//         if(err) throw err;

//     const news = [];
//     const $ = cheerio.load(html);


//     const $bannerText = $('.banner-text');

//     // this is called caching the selector. very important. set the $bannerText variable above
//     news.push({
//         title: $bannerText.text(),
//         url: $bannerText.closest('a').attr('href')
//     });

//     // news.push({
//     //     title: $('.banner-text').text(),
//     //     url: $('.banner-text').closest('a').attr('href')
//     // });


//     // eq makes it into a jquery object, so we can use .text and .find
//     _.range(1, 12).forEach(i => {
//         news.push({
//             title: $('.cd__headline').eq(i).text() ,
//             url: $('.cd__headline').eq(i).find('a').attr('href')
//         })
//     });

//     res.send(news);

//     });
// });







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
    console.log(req.body)
    res.render('contact');
        // title: title
});

//scotts code

// app.get('/', (req, res) => {
    // exec, executes the query params???
//   News.findOne().sort('-_id').exec((err, doc) => {
//     if (err) throw err;

//     res.render('index', {
//       date: new Date(),
//       topStory: doc.top[0]
//     });
//   });
// });






// app.post('/contact', (req, res) => {

//     //save: name, email, message
//     console.log(req.body)

//     // name here comes from our index.jade input fields, specifically name comes from name="name"
//     const name = req.body.name;
//     res.send(`<h1>preeeeeeeeesh ${name}</h1>`);
// });


// this is scott's code
app.post('/contact', (req, res) => {
    // 'contact' is the collection name. mongoose adds an 's' to anything that is not plural, will
    // also lowercase
    // name, email, and message are what the database keys will look like, and they want string
  const Contact = mongoose.model('contact', mongoose.Schema({
    name: String,
    email: String,
    message: String
  }));

  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw err;

    console.log(newObj);
    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });

  // db.collection('contact').insertOne(obj, (err, result) => {
  //   if (err) throw err;

  //   res.send(`<h1>Thanks for contacting us ${obj.name}</h1>`);
  // });
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



app.get('/ben', (req, res) => {
    console.log('binnnnn')
    db.collection('news').find();
})







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





// mongoose.connect(MONGODB_URL);

// mongoose.connection.on('open', () => {
//   // if (err) throw err;

//   // db = database;

//   app.listen(PORT, () => {
//     console.log(`Node.js server started. Listening on port ${PORT}`);
//   });
// });




//scotts code

mongoose.connect(MONGODB_URL);

// // const Contact = mongoose.model('contacts', mongoose.Schema({
// //   name: String,
// //   email: String,
// //   message: String
// // }));

// const News = mongoose.model('news', mongoose.Schema({
//   top: [{title: String, url: String}]
// }));

mongoose.connection.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});



module.exports = app;




// this is where we connect mongo to node
// set up mongo daemon
// MongoClient.connect(MONGODB_URL, (err, database) => {
//   if(err) throw err;

//   // console.log every time just to get an idea of what it looks like
//   //console.log(database);

//   db = database;



//   app.listen(PORT, () => {
//       console.log(`node.js server started you buttmunch. listening on port ${PORT}`);
//   });
// });







/********************************************************************************************/

// this is the allllll of scott's code

// 'use strict';

// const app = require('express')();
// const bodyParser = require('body-parser');
// const upload = require('multer')({ dest: 'tmp/uploads' });
// const request = require('request');
// const _ = require('lodash');
// const cheerio = require('cheerio');
// const mongoose = require('mongoose');

// const PORT = process.env.PORT || 3000;
// const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

// let db;

// app.set('view engine', 'jade');

// app.locals.title = 'THE Super Cool App';

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   News.findOne().sort('-_id').exec((err, doc) => {
//     if (err) throw err;

//     res.render('index', {
//       date: new Date(),
//       topStory: doc.top[0]
//     });
//   });
// });

// app.get('/api', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.send({hello: 'world'});
// });

// app.post('/api', (req, res) => {
//   const obj = _.mapValues(req.body, val => val.toUpperCase());

//   const caps = new AllCaps(obj);

//   caps.save((err, _caps) => {
//     if (err) throw err;

//     res.send(_caps);
//   });
// });

// app.get('/api/weather', (req, res) => {
//   const API_KEY = '00c2032f84f5e9393b7a1eda02d49228';
//   const url = `https://api.forecast.io/forecast/${API_KEY}/37.8267,-122.423`;

//   request.get(url, (err, response, body) => {
//     if (err) throw err;

//     res.header('Access-Control-Allow-Origin', '*');
//     res.send(JSON.parse(body));
//   });
// });

// app.get('/api/news', (req, res) => {
//   News.findOne().sort('-_id').exec((err, doc) => {
//     if (err) throw err;

//     if (doc) {
//       const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
//       const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
//       const lessThan15MinutesAgo = diff < 0;

//       if (lessThan15MinutesAgo) {
//         res.send(doc);
//         return;
//       }
//     }

//     const url = 'http://cnn.com';

//     request.get(url, (err, response, html) => {
//       if (err) throw err;

//       const news = [];
//       const $ = cheerio.load(html);

//       const $bannerText = $('.banner-text');

//       news.push({
//         title: $bannerText.text(),
//         url: url + $bannerText.closest('a').attr('href')
//       });

//       const $cdHeadline = $('.cd__headline');

//       _.range(1, 12).forEach(i => {
//         const $headline = $cdHeadline.eq(i);

//         news.push({
//           title: $headline.text(),
//           url: url + $headline.find('a').attr('href')
//         });
//       });

//       const obj = new News({ top: news });

//       obj.save((err, _news) => {
//         if (err) throw err;

//         res.send(_news);
//       });
//     });
//   });
// });

// app.get('/contact', (req, res) => {
//   res.render('contact');
// });

// app.post('/contact', (req, res) => {
//   const obj = new Contact({
//     name: req.body.name,
//     email: req.body.email,
//     message: req.body.message
//   });

//   obj.save((err, newObj) => {
//     if (err) throw err;

//     res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
//   });
// });

// app.get('/sendphoto', (req, res) => {
//   res.render('sendphoto');
// });

// app.post('/sendphoto', upload.single('image'), (req, res) => {
//   res.send('<h1>Thanks for sending us your photo</h1>');
// });

// app.get('/hello', (req, res) => {
//   const name = req.query.name || 'World';
//   const msg = `<h1>Hello ${name}!</h1>
// <h2>Goodbye ${name}!</h2>`;

//   res.writeHead(200, {
//     'Content-Type': 'text/html'
//   });

//   // chunk response by character
//   msg.split('').forEach((char, i) => {
//     setTimeout(() => {
//       res.write(char);
//     }, 1000 * i);
//   });

//   // wait for all characters to be sent
//   setTimeout(() => {
//     res.end();
//   }, msg.length * 1000 + 2000);
// });

// app.get('/random', (req, res) => {
//   res.send(Math.random().toString());
// });

// app.get('/random/:min/:max', (req, res) => {
//   const min = req.params.min;
//   const max = req.params.max;

//   res.send(getRandomInt(+min, +max).toString());
// });

// app.get('/secret', (req, res) => {
//   res
//     .status(403)
//     .send('Access Denied!');
// });

// mongoose.connect(MONGODB_URL);

// const AllCaps = mongoose.model('allcaps',
//   mongoose.Schema({}, {strict: false}));

// const Contact = mongoose.model('contacts', mongoose.Schema({
//   name: String,
//   email: String,
//   message: String
// }));

// const News = mongoose.model('news', mongoose.Schema({
//   top: [{title: String, url: String}]
// }));

// mongoose.connection.on('open', () => {
//   app.listen(PORT, () => {
//     console.log(`Node.js server started. Listening on port ${PORT}`);
//   });
// });

// // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// // Returns a ranom integer between min (included) and max (excluded)
// function getRandomInt (min, max) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }



/*************************************************************************************************/


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









































