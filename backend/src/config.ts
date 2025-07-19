import * as dotenv from "dotenv";
dotenv.config();

const keys = [
  "JWT_TOKEN",
  "MYSQL_HOST",
  "MYSQL_PORT",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "NODE_ENV",
  "APP_PORT"
]

for (const key of keys) {
  if (!process.env[key]) {
    console.warn(key + " key is undefined in .env");
    process.exit(1);
  }
}

const toNumber = (key: string) => {
  return parseInt(process.env[key] as string);
}

if (isNaN(toNumber("MYSQL_PORT"))) {
  console.warn("MySQL Port is not a number");
  process.exit(1);
}

if (isNaN(toNumber("APP_PORT"))) {
  console.warn("Application Port is not a number");
  process.exit(1);
}

export default {
  jwtToken: process.env["JWT_TOKEN"] as string,
  mysql: {
    host: process.env["MYSQL_HOST"] as string,
    port: toNumber("MYSQL_PORT") || 3306,
    user: process.env["MYSQL_USER"] as string,
    password: process.env["MYSQL_PASSWORD"] as string,
    database: process.env["MYSQL_DATABASE"] as string
  },
  environment: process.env["NODE_ENV"] as string,
  app: {
    port: toNumber("APP_PORT") || 3000
  }
};
