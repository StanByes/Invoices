import {Request, Response, Router} from "express";
import Admin from "../../middlewares/Admin";
import InvoiceController from "../../controllers/api/InvoiceController";

const controller = new InvoiceController();
const router = Router();

router.get("/", (request: Request, response: Response)=> controller.index(request, response));
router.get("/:id", (request: Request, response: Response) => controller.show(request, response));
router.post("/", Admin, (request: Request, response: Response) => controller.create(request, response));
router.patch("/:id", Admin, (request: Request, response: Response) => controller.update(request, response));
router.delete("/:id", Admin, (request: Request, response: Response) => controller.delete(request, response));

export default router;
