// https://api.telegram.org/bot1455186902:AAFBTAedxMZicAHgxI02JcYf0CuxN5g4tXY/sendMessage?chat_id=1185304660&text=ok
const express = require("express");
const https = require("https");
const app = express();
const port = 3005;
const { getGoldPrice } = require('./pupeteerHelper');

app.get("/", (req, res) => {
  // https
  //   .get(
  //     `https://api.telegram.org/bot1455186902:AAFBTAedxMZicAHgxI02JcYf0CuxN5g4tXY/sendMessage?chat_id=1185304660&text=ok${123}`,
  //     (resp) => {
  //       const statusCode = resp.statusCode;
  //     }
  //   )
  //   .on("error", (err) => {
  //     console.log(`Send error:`, new Date().toLocaleString());
  //     console.log("Error: " + err.message);
  //   });
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/gold-price", async (req, res) => {
  const goldPrice = await getGoldPrice()
  res.send(goldPrice);
});

app.listen(port, () => {
  console.log(`The app is listening on http://localhost:${port}`);
});
