'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

    res.render('index', {
      date: new Date(),
      topStory: doc.top[0]
    });
  });
});

router.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());

  const caps = new AllCaps(obj);

  caps.save((err, _caps) => {
    if (err) throw err;

    res.send(_caps);
  });
});

router.get('/api/weather', (req, res) => {
  const API_KEY = '00c2032f84f5e9393b7a1eda02d49228';
  const url = `https://api.forecast.io/forecast/${API_KEY}/37.8267,-122.423`;

  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

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

      const obj = new News({ top: news });

      obj.save((err, _news) => {
        if (err) throw err;

        res.send(_news);
      });
    });
  });
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.post('/contact', (req, res) => {
  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw err;

    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });
});

router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

router.post('/sendphoto', upload.single('image'), (req, res) => {
  res.send('<h1>Thanks for sending us your photo</h1>');
});

router.get('/hello', (req, res) => {
  const name = req.query.name || 'World';
  const msg = `<h1>Hello ${name}!</h1>
<h2>Goodbye ${name}!</h2>`;

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  // chunk response by character
  msg.split('').forEach((char, i) => {
    setTimeout(() => {
      res.write(char);
    }, 1000 * i);
  });

  // wait for all characters to be sent
  setTimeout(() => {
    res.end();
  }, msg.length * 1000 + 2000);
});

router.get('/random', (req, res) => {
  res.send(Math.random().toString());
});

router.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;

  res.send(getRandomInt(+min, +max).toString());
});

router.get('/secret', (req, res) => {
  res
    .status(403)
    .send('Access Denied!');
});

module.exports = router;
