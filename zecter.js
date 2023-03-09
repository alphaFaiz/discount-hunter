const { readData, saveData } = require("./interactWithFile");

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
    return 'Updated';
  }
  return 'Nothing to update';
};

module.exports = {
  saveCookies,
};
