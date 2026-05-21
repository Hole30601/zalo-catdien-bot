const fs = require("fs");

const FILE = "subscribers.json";

function getSubscribers() {
  try {
    return JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );
  } catch {
    return [];
  }
}

function saveSubscribers(data) {
  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );
}

function addSubscriber(id) {

  const users =
    getSubscribers();

  if (!users.includes(id)) {

    users.push(id);

    saveSubscribers(users);

  }
}

function removeSubscriber(id) {

  const users =
    getSubscribers().filter(
      x => x !== id
    );

  saveSubscribers(users);
}

module.exports = {
  getSubscribers,
  addSubscriber,
  removeSubscriber
};
