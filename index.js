const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const { CronJob } = require("cron");

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
const port = 4001;
const { getGoldPrice, crawlProducts } = require("./pupeteerHelper");
const { saveCookies } = require("./zecter");

const job =
  process.env.turn_on_cron == 1
    ? new CronJob(
        process.env.cron_pattern,
        async function () {
          await crawlProducts();
        },
        null,
        true,
        "Asia/Ho_Chi_Minh"
      )
    : () => {};

app.get("/", async (req, res) => {
  // res.sendFile("./index.html", { root: __dirname });
  const data = await saveCookies();
  res.send({ data });
});

app.get("/gold-price", async (req, res) => {
  const goldPrice = await getGoldPrice();
  res.send(goldPrice);
});

app.post("/save-cookies", async (req, res) => {
  const { instanceId, cookies } = req.body;
  const saveCookiesResult = await saveCookies(instanceId, cookies);
  console.log(`-Save cookies result:`, saveCookiesResult);
  res.send({ result: saveCookiesResult });
});

app.listen(port, () => {
  console.log(`The app is listening on http://localhost:${port}`);
});
