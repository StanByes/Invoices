import {Router} from "express";
import Authentication from "../middlewares/Authentication";
import TaskRoute from "./api/TaskRoute";

const router = Router();
router.use(Authentication);

router.use("/tasks", TaskRoute);
export default router;
