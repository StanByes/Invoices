import {Request, Response, Router} from "express";
import TaskController from "../../../controllers/api/tasks/TaskController";
import Admin from "../../../middlewares/Admin";
import TaskModelRoute from "./TaskModelRoute";

const controller = new TaskController();
const router = Router();

router.use(Admin);
router.use("/models", TaskModelRoute);

router.get("/", (request: Request, response: Response)=> controller.index(request, response));
router.get("/:id", (request: Request, response: Response) => controller.show(request, response));
router.post("/", (request: Request, response: Response) => controller.create(request, response));
router.patch("/:id", (request: Request, response: Response) => controller.update(request, response));
router.delete("/:id", (request: Request, response: Response) => controller.delete(request, response));

export default router;
