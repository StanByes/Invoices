import {Sequelize} from "sequelize";
import config from "../config";
import User from "./User";
import TaskModel from "./TaskModel";
import Client from "./Client";
import Invoice from "./Invoice";

const mysqlCredentials = config.mysql;

const sequelize = new Sequelize(
  mysqlCredentials.database,
  mysqlCredentials.user,
  mysqlCredentials.password,
  {
    host: mysqlCredentials.host,
    port: mysqlCredentials.port,
    dialect: "mariadb",
    logging: false,
    define: {
        engine: "InnoDB",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
    }
  }
);

Client.associate(sequelize);
Invoice.associate(sequelize);
TaskModel.associate(sequelize);
User.associate(sequelize);

User.makeAssociations();
Client.makeAssociations();
Invoice.makeAssociations();

(async () => {
  try {
    await sequelize.authenticate();

    if (config.environment !== "production") {
      await sequelize.sync({alter: true});
    }

    console.info("Database connected");
  } catch (e) {
    console.error("Database Connection Error : " + e);
    await sequelize.close();
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: Closing Sequelize connection pool...');
    await sequelize.close();
    console.log('Sequelize connection pool closed. Exiting process.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: Closing Sequelize connection pool...');
    await sequelize.close();
    console.log('Sequelize connection pool closed. Exiting process.');
    process.exit(0);
});
