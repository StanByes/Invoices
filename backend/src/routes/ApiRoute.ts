import {Router} from "express";
import Authentication from "../middlewares/Authentication";
import TaskRoute from "./api/TaskRoute";
import ClientRoute from "./api/ClientRoute";
import InvoiceRoute from "./api/InvoiceRoute";

const router = Router();
router.use(Authentication);

router.use("/clients", ClientRoute);
router.use("/invoices", InvoiceRoute);
router.use("/tasks", TaskRoute);
export default router;
