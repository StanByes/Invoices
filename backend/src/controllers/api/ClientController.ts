import {Request, Response} from "express";

import CrudController from "@controllers/CrudController";
import Client, {ClientCreationAttribute} from "@models/Client";
import Invoice from "@models/Invoice";
import User from "@models/User";
import {BadRequest, Conflict, Forbidden, NotFound, Success} from "@utils/HTTPResponse";

export default class ClientController extends CrudController {
    async index(request: Request, response: Response) {
        return response.status(200).json(await Client.findAll());
    }

    async show(request: Request, response: Response) {
        const client = await this.getClient(request, response, true);
        if (!client)
            return;

        return response.status(200).json(client);
    }

    async create(request: Request, response: Response) {
        const body = this.parseBody(request, response, false);
        if (!body)
            return;

        if ((await User.findByPk(body.userId)) == null) {
            return response.status(400).json(BadRequest);
        }

        if ((await Client.findOne({where: {userId: body.userId}})) != null) {
            return response.status(409).json(Conflict);
        }

        const client = await Client.create(body, {include: [{model: User, as: "user"}]});
        return response.status(200).json(client);
    }

    async update(request: Request, response: Response) {
        const client = await this.getClient(request, response, false);
        if (!client)
            return;

        const body = this.parseBody(request, response, true);
        if (!body)
            return;

        await client.update(body);
        return response.status(200).json(client);
    }

    async delete(request: Request, response: Response) {
        const client = await this.getClient(request, response, false);
        if (!client)
            return;

        await client.destroy();
        return response.status(200).json(Success);
    }

    async invoices(request: Request, response: Response) {
        const client = await this.getClient(request, response, true);
        if (!client)
            return;

        return response.status(200).json(await Invoice.findAll({where: {clientId: client.id}}));
    }

    private async getClient(request: Request, response: Response, allowNonAdmin: boolean): Promise<Client | undefined> {
        const id = request.params.id;
        if (!id) {
            response.status(400).json(BadRequest);
            return;
        }

        const user = request.user!;
        if (!user.admin) {
            if (allowNonAdmin && user.client!.id != parseInt(id)) {
                response.status(403).json(Forbidden);
                return;
            }
        }

        const client = await Client.findByPk(id, {
            include: [{model: User, as: "user"}],
            attributes: {
                exclude: ["user_id"]
            }
        });
        if (!client) {
            response.status(404).json(NotFound);
            return;
        }

        return client;
    }

    private parseBody(request: Request, response: Response, update: boolean): ClientCreationAttribute | undefined {
        const { firstName, lastName, companyId, companyName, phone, address, city, zip } = request.body;
        const userId = !update ? request.body["userId"] : undefined;
        if ((!update && !this.checkField(userId))
            || !this.checkField(firstName)
            || !this.checkField(lastName)
            || !this.checkField(phone)
            || !this.checkField(address)
            || !this.checkField(city)
            || !this.checkField(zip)) {
            response.status(400).json(BadRequest);
            return;
        }

        return { userId, firstName, lastName, companyId, companyName, phone, address, city, zip };
    }
}
