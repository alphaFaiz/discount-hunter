const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { CronJob } = require('cron');

const app = express();
app.use(cors());
const port = 4001;
const { getGoldPrice, crawlProducts } = require("./pupeteerHelper");

const job = new CronJob(
	'0 9,17 * * * *',
	async function() {
    console.log(`Crawling products at ${new Date()}`)
    await crawlProducts();
	},
	null,
	true,
  'Asia/Ho_Chi_Minh'
);

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/gold-price", async (req, res) => {
  const goldPrice = await getGoldPrice();
  res.send(goldPrice);
});

app.listen(port, () => {
  console.log(`The app is listening on http://localhost:${port}`);
});
