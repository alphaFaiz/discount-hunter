const fs = require("fs");

const readData = async (path) => {
  const data = await fs.readFileSync(path);
  return JSON.parse(JSON.parse(data));
};

const saveData = async (path, data) => {
    try {
        await fs.writeFileSync(path, JSON.stringify(data));
        console.log(`:D Data updated!`)
    } catch (error) {
        console.log(`:( Failed to save data.json`)
    }
};

module.exports = {
  readData,
  saveData,
};
