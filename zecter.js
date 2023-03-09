const { readData, saveData } = require("./interactWithFile");

const getInstances = async () => {
  const instances = await readData("./cookies.json");
  return Object.keys(instances);
};

const getInstanceCookies = async (instanceId) => {
  const cookiesData = await readData("./cookies.json");
  return cookiesData[instanceId];
};

const saveCookies = async (instaceId, cookies) => {
  const dateFilePath = "./date.json";
  const cookiesFilePath = "./cookies.json";
  const currentDate = new Date().getDate();
  const savedDates = await readData(dateFilePath);
  if (savedDates.savedCookiesDate != currentDate) {
    const savedCookies = await readData(cookiesFilePath);
    savedCookies[instaceId] = cookies;
    /**save data */
    await saveData(cookiesFilePath, savedCookies);
    savedDates.savedCookiesDate = currentDate;
    await saveData(dateFilePath, savedDates);
    return "Updated";
  }
  return "Nothing to update";
};

module.exports = {
  saveCookies,
  getInstances,
  getInstanceCookies,
};
