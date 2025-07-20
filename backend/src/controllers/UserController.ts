import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {Op} from "sequelize";

import config from "../config";
import BaseController from "./BaseController";
import User from "@models/User";
import {NotFound} from "@utils/HTTPResponse";

export default class UserController extends BaseController {
    async sign(request: Request, response: Response) {
        if (request.user) {
            return response.status(401).json({
                code: 401, message: "Already connected"
            });
        }

        const {username, email, password} = request.body;
        if (!this.checkField(username) || !this.checkField(email) || !this.checkField(password)) {
            return response.status(400).json({
                code: 400, message: "Bad request"
            });
        }

        const possibleUser = await User.findOne({where: {[Op.or]: [{username}, {email}]}});
        if (possibleUser != null) {
            return response.status(409).json({
                code: 409, message: "Conflict"
            });
        }

        const user = await User.create({username, email, password, admin: false});
        const token = this.createToken(user);

        return response
            .status(201)
            .cookie("refreshToken", token.refreshToken, {httpOnly: true, sameSite: "strict"})
            .json({
                code: 201, token: token.accessToken
            });
    }

    async login(request: Request, response: Response) {
        if (request.user) {
            return response.status(401).json({
                code: 401, message: "Already connected"
            });
        }

        const {username, password} = request.body;
        if (!this.checkField(username) || !this.checkField(password)) {
            return response.status(400).json({
                code: 400, message: "Bad request"
            });
        }

        const user = await User.findOne({where: {username}});
        if (!user) {
            return response.status(404).json(NotFound)
        }

        if (!user.comparePassword(password)) {
            return response.status(401).json({
                code: 401, message: "Bad password"
            })
        }

        const token = this.createToken(user);
        return response
            .status(200)
            .cookie("refreshToken", token.refreshToken, {httpOnly: true, sameSite: "strict"})
            .json({
                code: 200, token: token.accessToken
            });
    }

    logout(request: Request, response: Response) {
        return response.status(200).clearCookie("refreshToken").json({
            code: 200,
            message: "Success"
        });
    }

    async refreshToken(request: Request, response: Response) {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return response.status(401).json({
                code: 401, message: "Refresh token not found"
            });
        }

        try {
            const payload = jwt.verify(refreshToken, config.jwtToken);
            if (!payload || typeof payload === "string") return null;

            const user = await User.findByPk(payload.id);
            if (!user) {
                return response.status(401).json({
                    code: 401, message: "Unauthorized"
                });
            }
            const token = this.createToken(user);

            return response
                .status(200)
                .cookie("refreshToken", token.refreshToken, {httpOnly: true, sameSite: "strict"})
                .json({
                    code: 200, token: token.accessToken
                });
        } catch (error) {
            return response.status(401).json({
                code: 401, message: "Invalid refresh token"
            })
        }
    }

    private createToken(user: User): { accessToken: string, refreshToken: string } {
        const payload = {
            id: user.id, admin: user.admin
        };

        return {
            accessToken: jwt.sign(payload, config.jwtToken, {expiresIn: "30m"}),
            refreshToken: jwt.sign(payload, config.jwtToken, {expiresIn: "1d"})
        };
    }
}
