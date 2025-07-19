import {Router} from "express";
import ClientController from "../../controllers/api/ClientController";
import {initCrudRouter} from "../RouteUtils";

const controller = new ClientController();
const router = Router();
initCrudRouter(router, controller);

export default router;
