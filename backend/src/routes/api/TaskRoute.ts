import {Router} from "express";
import TaskController from "../../controllers/api/TaskController";
import Admin from "../../middlewares/Admin";
import {initCrudRouter} from "../RouteUtils";

const controller = new TaskController();
const router = Router();
router.use(Admin);
initCrudRouter(router, controller);

export default router;
