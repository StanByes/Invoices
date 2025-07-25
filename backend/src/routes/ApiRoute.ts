import {Router} from "express";

import Authentication from "@middlewares/Authentication";
import ClientRoute from "@routes/api/ClientRoute";
import InvoiceRoute from "@routes/api/InvoiceRoute";
import TaskModelRoute from "@routes/api/tasks/TaskModelRoute";

const router = Router();
router.use(Authentication);

router.use("/clients", ClientRoute);
router.use("/invoices", InvoiceRoute);
router.use("/task_models", TaskModelRoute);
export default router;
