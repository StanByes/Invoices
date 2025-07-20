import {Request, Response, Router} from "express";

import ClientController from "@controllers/api/ClientController";
import Admin from "@middlewares/Admin";

const controller = new ClientController();
const router = Router();

router.get("/", Admin, (request: Request, response: Response)=> controller.index(request, response));
router.get("/:id", (request: Request, response: Response) => controller.show(request, response));
router.get("/:id/invoices", (request: Request, response: Response) => controller.invoices(request, response));
router.post("/", Admin, (request: Request, response: Response) => controller.create(request, response));
router.patch("/:id", Admin, (request: Request, response: Response) => controller.update(request, response));
router.delete("/:id", Admin, (request: Request, response: Response) => controller.delete(request, response));

export default router;
