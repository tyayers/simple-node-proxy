const { GoogleAuth } = require("google-auth-library");

// importing the dependencies

const monitoring = require("@google-cloud/monitoring");

const express = require("express");
//const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios").default;
const https = require("https");
var port = process.env.PORT;
if (!port) port = "8080";

const dotenv = require("dotenv");
dotenv.config();

// defining the Express app
const app = express();
app.use(express.json());

// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json());

// enabling CORS for all requests
// app.use(cors());

const agent = new https.Agent({
  rejectUnauthorized: false,
});

// app.get('/', (req, res) => {
//   res.send("Service is healthy.");
// });

app.get("/health", (req, res) => {
  res.send("Service is healthy.");
});

app.get("/healthz", (req, res) => {
  res.send("Service is healthy.");
});

app.all("/*", async (req, res) => {
  console.log(req.originalUrl);
  console.log(req.method);
  console.log(process.env.TARGET + req.originalUrl);

  var options = {
    method: req.method,
    url: process.env.TARGET + req.originalUrl,
    headers: req.headers,
    httpsAgent: agent,
    responseType: "stream",
  };

  if (options.url.endsWith("/")) options.url = options.url.slice(0, -1);

  if (req.method != "GET" && req.body) {
    options["data"] = req.body;
  }

  var host = process.env.TARGET;
  if (host.startsWith("https://")) host = host.replace("https://", "");
  else if (host.startsWith("http://")) host = host.replace("http://", "");

  options.headers["host"] = host;

  if (req.data) options.data = req.data;

  // GOOGLE CLOUD RUN CODE
  // const targetAudience = process.env.TARGET;
  // const url = process.env.TARGET;
  // const auth = new GoogleAuth();
  // auth.getIdTokenClient(targetAudience).then((client) => {
  //   client
  //     .request(options)
  //     .then((response) => {
  //       res.status(response.status).set(response.headers);

  //       if (response.data) response.data.pipe(res);
  //       else res.end();
  //     })
  //     .catch(function (error) {
  //       console.error(error.message);
  //       res.status(error.response.status).end();
  //       // if (error.response)
  //       //   res.status(error.response.status).set(error.response.headers).send(error.response.data);
  //       // else
  //       //   res.status(404).send("Not found");
  //     });
  // });

  let response = await fetch(options.url, options);
  let responseText = await response.text();

  res.set("Access-Control-Allow-Methods", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");

  res.status(response.status).send(responseText);
});

// starting the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
