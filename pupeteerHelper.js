const puppeteer = require("puppeteer");
const { readData, saveData } = require("./interactWithFile");

const selectGoldPriceDOM = () => {
  const buyPriceSelector =
    "#page > div.bx1 > table > tbody > tr:nth-child(5) > td:nth-child(2)";
  const sellPriceSelector =
    "#page > div.bx1 > table > tbody > tr:nth-child(5) > td:nth-child(3)";
  const buyPriceElement = document.querySelector(buyPriceSelector);
  const sellPriceElement = document.querySelector(sellPriceSelector);
  return {
    buyPrice: buyPriceElement.textContent,
    sellPrice: sellPriceElement.textContent,
  };
};

const getGoldPrice = async (retryTimes) => {
  if (retryTimes > 3) {
    return { sellPrice: 0 }
  }
  if (!retryTimes) retryTimes = 0;
  console.log(`retryTimes:`, retryTimes)
  try {
    console.log(`-Getting gold price...`);
    // const savedData = await readData('./data.json');
    const data = await crawl(
      "https://sjc.com.vn/giavang/textContent.php",
      selectGoldPriceDOM,
      ".bx1"
    );
    // savedData.gold.buy = data.buyPrice;
    // savedData.gold.sell = data.sellPrice;
    // await saveData("./data.json", JSON.stringify(savedData));
    return data;
  } catch (error) {
    console.log(`-Failed to get gold price`, error);
    /**Retry */
    retryTimes++;
    await getGoldPrice(retryTimes);
  }
};

const crawl = async (url, evaluateCallBack, requiredSelector) => {
  let options = process.env.environment === 'UBUNTU_SERVER' ? { 
    executablePath: '/usr/bin/chromium-browser' 
  } : {};
  console.log(options, process.env.environment)
  const browser = await puppeteer.launch(options);
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