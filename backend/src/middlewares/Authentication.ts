import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Client from "../models/Client";

export default async (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.header("Authorization");
  if (!authorization) {
    return response.status(401).json({
      code: 401,
      message: "Unauthorized"
    });
  }

  const splitAuth = authorization.split(" ");
  if (splitAuth.length != 2) {
    return response.status(401).json({
      code: 401,
      message: "Unauthorized"
    });
  }

  const token = splitAuth[1];
  try {
    const payload = jwt.verify(token, config.jwtToken);
    if (!payload || typeof payload == "string") {
      return response.status(401).json({
        code: 401,
        message: "Unauthorized"
      });
    }

    const user = await User.findByPk(payload.id, {
        include: [{model: Client, as: "client"}]
    });
    if (!user) {
      return response.status(401).json({
        code: 401,
        message: "Unauthorized"
      });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      code: 401,
      message: "Unauthorized"
    });
  }
}
