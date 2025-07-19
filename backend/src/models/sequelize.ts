import {Sequelize} from "sequelize";
import config from "../config";
import User from "./User";
import Task from "./Task";

const mysqlCredentials = config.mysql;

const sequelize = new Sequelize(
  mysqlCredentials.database,
  mysqlCredentials.user,
  mysqlCredentials.password,
  {
    host: mysqlCredentials.host,
    port: mysqlCredentials.port,
    dialect: "mariadb",
    logging: false
  }
);

User.associate(sequelize);
Task.associate(sequelize);

(async () => {
  try {
    await sequelize.authenticate();

    if (config.environment !== "production") {
      await sequelize.sync({alter: true});
    }

    console.info("Database connected");
  } catch (e) {
    console.error("Database Connection Error : " + e);
    process.exit(1);
  }
})();
