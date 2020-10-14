require("dotenv").config();
require("./../config/mongo");
const users = require("./../json/users-fake-db.json").users;
const UserModel = require("./../models/User");

(async function () {
  try {
    try {
      await UserModel.collection.drop();
      const res = await UserModel.create(users);
      console.log(res.length + " users created in database");
    } catch (err) {
      if (err.code === 26) {
        console.log(
          "namespace %s not found, creating collection ",
          UserModel.collection.name
        );
        const res = await UserModel.create(users);
        console.log(res.length + " users created in database");
      } else {
        throw e;
      }
    }
  } catch (e) {
    console.error(e);
  }
})();
