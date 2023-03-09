const fs = require("fs");

const readData = async (path) => {
  const data = await fs.readFileSync(path);
  try {
    return JSON.parse(JSON.parse(data));    
  } catch (error) {
    return JSON.parse(data);
  }
};

const saveData = async (path, data) => {
    try {
        await fs.writeFileSync(path, JSON.stringify(data));
        console.log(`:D Data updated!`)
    } catch (error) {
        console.log(`:( Failed to save data`)
    }
};

module.exports = {
  readData,
  saveData,
};
