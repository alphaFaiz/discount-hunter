const puppeteer = require("puppeteer");
const { readData, saveData } = require("./interactWithFile");
const https = require("https");

const getGoldPrice = async (retryTimes) => {
  const trackingProducts = await readData("./data.json");
  const { name, url, selectors, waitForSelector } = trackingProducts[0];
  console.log(`-Getting ${name}...`);
  const data = await crawl(url, selectors, waitForSelector);
  return data;
};

const crawl = async (url, selectors, requiredSelector) => {
  let options =
    process.env.environment === "UBUNTU_SERVER"
      ? {
          executablePath: "/usr/bin/chromium-browser",
        }
      : {};
  console.log(options, process.env.environment);
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.goto(url);
  if (requiredSelector) {
    await page.waitForSelector(requiredSelector);
  }
  let data = await page.evaluate((dataSelectors) => {
    const selectedDOMs = dataSelectors.reduce((acc, curr) => {
      acc[curr.name] = document.querySelector(curr.selector).textContent.trim();
      return acc;
    }, {});
    return selectedDOMs;
  }, selectors);
  console.log(`-Get data success from ${url}`);

  await browser.close();
  console.log(data);
  return data;
};

const crawlProducts = async () => {
  const trackingProducts = await readData("./data.json");
  if (trackingProducts.length) {
    for (product of trackingProducts) {
      const { name, url, selectors, waitForSelector } = product;
      console.log(`-Getting ${name}...`);
      const data = await crawl(url, selectors, waitForSelector);
      const msg = `${name}: ${JSON.stringify(data)}`;
      await sendTelegramMsg(msg);
      console.log(name, data);
    }
  }
};

const sendTelegramMsg = async (msg) => {
  https
    .get(
      `https://api.telegram.org/bot1455186902:AAFBTAedxMZicAHgxI02JcYf0CuxN5g4tXY/sendMessage?chat_id=1185304660&text=${msg}`,
      (resp) => {
        const statusCode = resp.statusCode;
      }
    )
    .on("error", (err) => {
      console.log(`Send error:`, new Date().toLocaleString());
      console.log("Error: " + err.message);
    });
}
(async () => {
  await crawlProducts();
})();

module.exports = {
  getGoldPrice,
  crawlProducts
};
