const puppeteer = require("puppeteer");

const selectGoldPriceDOM = () => {
  const buyPriceSelector =
    "#automation_TV0 > div.width_common.info-topic.box-giavang-new > div > table > tbody > tr:nth-child(7) > td:nth-child(2)";
  const sellPriceSelector =
    "#automation_TV0 > div.width_common.info-topic.box-giavang-new > div > table > tbody > tr:nth-child(7) > td:nth-child(3)";
  const buyPriceElement = document.querySelector(buyPriceSelector);
  const sellPriceElement = document.querySelector(sellPriceSelector);
  return {
    buyPrice: buyPriceElement.textContent.split(" ")[0],
    sellPrice: sellPriceElement.textContent.split(" ")[0],
  };
};

const getGoldPrice = async (retryTimes) => {
  if (retryTimes > 3) {
    return {}
  }
  if (!retryTimes) retryTimes = 0;
  try {
    console.log(`-Getting gold price...`);
    const data = await crawl(
      "https://vnexpress.net/chu-de/gia-vang-1403",
      selectGoldPriceDOM,
      // ".box-giavang-new"
    );
    return data;
  } catch (error) {
    console.log(`-Failed to get gold price`, error);
    /**Retry */
    retryTimes++;
    await getGoldPrice(retryTimes);
  }
};

const crawl = async (url, evaluateCallBack, requiredSelector) => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser' });
  const page = await browser.newPage();

  await page.goto(url);
  if (requiredSelector) {
    await page.waitForSelector(requiredSelector);
  }
  const data = await page.evaluate(evaluateCallBack);

  await browser.close();
  console.log(`-Get data success from ${url}`);
  console.log(data);
  return data;
};

// (async () => {
//   await getGoldPrice();
// })();

module.exports = {
  getGoldPrice,
}