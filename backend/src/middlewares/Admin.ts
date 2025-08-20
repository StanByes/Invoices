import {Request, Response, NextFunction} from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !request.user.admin) {
        return response.status(403).json({
            code: 403,
            message: "Forbidden"
        });
    }

    return next();
}
