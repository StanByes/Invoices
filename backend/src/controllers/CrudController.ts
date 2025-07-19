import {Request, Response} from "express";
import BaseController from "./BaseController";

export default abstract class CrudController extends BaseController {
    abstract index(request: Request, response: Response): any;
    abstract show(request: Request, response: Response): any;
    abstract create(request: Request, response: Response): any;
    abstract update(request: Request, response: Response): any;
    abstract delete(request: Request, response: Response): any;
}
