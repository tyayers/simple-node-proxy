// importing the dependencies
const tracer = require('@google-cloud/trace-agent').start({
  projectId: 'bruno-1407a',
  keyFilename: 'bruno-owner-key.json',
});

const monitoring = require('@google-cloud/monitoring');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
const https = require('https');

const dotenv = require('dotenv');
dotenv.config();

// defining the Express app
const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

const agent = new https.Agent({  
  rejectUnauthorized: false
});

// app.get('/', (req, res) => {
//   res.send("Service is healthy.");
// });

app.get('/health', (req, res) => {
  res.send("Service is healthy.");
});

app.get('/healthz', (req, res) => {
  res.send("Service is healthy.");
});

app.get('/*', (req, res) => {

  console.log(req.originalUrl);
  console.log(req.method);
  console.log(process.env.target + req.originalUrl);

  var options = {
    method: req.method,
    url: process.env.target + req.originalUrl,
    headers: req.headers,
    httpsAgent: agent,
    responseType: 'stream'
  };

  var host = process.env.target;
  if (host.startsWith("https://")) host = host.replace("https://", "");
  else if (host.startsWith("http://")) host = host.replace("http://", "");

  options.headers["host"] = host;

  if (req.data) options.data = req.data;

  axios(options).then((response) => {
    res.status(response.status).set(response.headers);

    if (response.data)
      response.data.pipe(res);
    else
      res.end();
  }).catch(function (error) {
    console.error(error.message);
    res.status(error.response.status).end();
    // if (error.response)
    //   res.status(error.response.status).set(error.response.headers).send(error.response.data);
    // else
    //   res.status(404).send("Not found");
  });
});

// starting the server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});