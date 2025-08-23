import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import Client from "@models/Client";
import User from "@models/User";

export default async (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.header("Authorization");
  if (!authorization) {
    return response.status(401).json({
      code: 401,
      message: "Access token is missing"
    });
  }

  const splitAuth = authorization.split(" ");
  if (splitAuth.length != 2) {
    return response.status(400).json({
      code: 400,
      message: "Invalid Authorization Header"
    });
  }

  const token = splitAuth[1];
  try {
    const payload = jwt.verify(token, config.jwtToken);
    if (!payload || typeof payload == "string") {
      return response.status(401).json({
        code: 401,
        message: "Invalid Access Token"
      });
    }

    const user = await User.findByPk(payload.id, {
        include: [{model: Client, as: "client"}]
    });
    if (!user) {
      return response.status(401).json({
        code: 401,
        message: "Invalid Access Token"
      });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      code: 401,
      message: "Invalid Access Token"
    });
  }
}
