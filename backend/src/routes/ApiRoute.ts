import {Router} from "express";
import Authentication from "../middlewares/Authentication";
import TaskRoute from "./api/TaskRoute";
import ClientRoute from "./api/ClientRoute";

const router = Router();
router.use(Authentication);

router.use("/clients", ClientRoute);
router.use("/tasks", TaskRoute);
export default router;
