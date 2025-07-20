import {Router} from "express";

import Authentication from "@middlewares/Authentication";
import ClientRoute from "./api/ClientRoute";
import InvoiceRoute from "./api/InvoiceRoute";
import TaskRoute from "./api/tasks/TaskRoute";

const router = Router();
router.use(Authentication);

router.use("/clients", ClientRoute);
router.use("/invoices", InvoiceRoute);
router.use("/tasks/models", TaskRoute);
export default router;
