const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./database')
const fetch = require("node-fetch");
const { google } = require("googleapis");

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors
const cors = require("cors");
app.use(cors());

app.use(express.json());

require('./models/user');
require('./models/outpass');
require('./models/admin');
require('./models/post');
db.model("User");
db.model("Outpass")
db.model("Admin")
db.model("Post")
app.use(require('./routes/auth'));
app.use(require('./routes/outpass'));
app.use(require('./routes/admin'));

const oauth2Client = new google.auth.OAuth2(
  '891305350714-becnblrdvdvu6og7qi46f919rckcuev8.apps.googleusercontent.com',
  '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',
  "http://localhost:5000/handleGoogleRedirect" // server redirect url handler
);

// app.post("/createAuthLink", cors(), (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.email",
//       "https://www.googleapis.com/auth/userinfo.profile",
//       //calendar api scopes]
//       // "https://www.googleapis.com/auth/calendar",
//     ],
//     prompt: "consent",
//   });
//   res.send({ url });
// });

app.post("/handleGoogleRedirect", (req, res) => {
  // get code from url
  // console.log(req.body.code)
  console.log(req.body)
  // const code = req.query.code;
  console.log("server 48 | code", req.body.code);
  // get access token
  oauth2Client.getToken(req.body.code, (err, tokens) => {
    console.log("server 53 | token", tokens);
    if (err) {
      console.log("server 52 | error", err);
      // throw new Error("Issue with Login", err.message);
    }
    setTimeout(() => {
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      // const iDToken = tokens.id_token;
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }, 1500);
  });
});

app.post("/getValidToken", async (req, res) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: '891305350714-becnblrdvdvu6og7qi46f919rckcuev8.apps.googleusercontent.com',
        client_secret: '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',
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log("server 80 | data", data);

    res.json({
      accessToken: data.access_token,
      idToken: data.id_token
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`The Server is running on port: ${PORT}`);
})
