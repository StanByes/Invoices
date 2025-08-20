import express, { Request, Response } from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import config from "./config";

import "./models/sequelize";
import UserRoute from "./routes/UserRoute";
import User from "./models/User";
import ApiRoute from "./routes/ApiRoute";

declare module "express-serve-static-core" {
  interface Request {
    user?: User
  }
}

const server = express();
server.use(morgan("dev"));
server.use(express.json());
server.use(cookieParser());

server.use("/api", ApiRoute);
server.use("/users", UserRoute);
server.get("/status", (request: Request, response: Response) => {
  return response.status(200).json({message: "Hello World !"});
})

server.listen(config.app.port, async () => {
  console.info("Web Server started on " + config.app.port + " port");
});
