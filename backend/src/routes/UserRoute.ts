import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import Authentication from "../middlewares/Authentication";

const controller = new UserController();
const router = Router();
router.post("/sign", (req: Request, res: Response) => controller.sign(req, res));
router.post("/login", (req: Request, res: Response) => controller.login(req, res));
router.get("/logout", Authentication, (req: Request, res: Response) => controller.logout(req, res));
router.get("/refresh_token", Authentication, (req: Request, res: Response) => controller.refreshToken(req, res));

export default router;
