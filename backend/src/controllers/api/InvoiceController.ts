import { Request, Response } from "express";
import {FindOptions} from "sequelize";

import CrudController from "@controllers/CrudController";
import Client from "@models/Client";
import Invoice, {InvoiceAttribute, InvoiceCreationAttribute} from "@models/Invoice";
import {BadRequest, Forbidden, NotFound, Success} from "@utils/HTTPResponse";

export default class InvoiceController extends CrudController {
    async index(request: Request, response: Response) {
        const user = request.user!;

        let options: FindOptions<InvoiceAttribute> = {};
        if (!request.user!.admin)
            options.where = {clientId: user.id};

        return response.status(200).json(await Invoice.findAll(options));
    }

    async show(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, true);
        if (!invoice)
            return;

        return response.status(200).json(invoice);
    }

    async create(request: Request, response: Response) {
        const body = this.parseBody(request, response, false);
        if (!body)
            return;

        if ((await Client.findByPk(body.clientId)) == null) {
            return response.status(400).json(BadRequest);
        }

        const invoice = await Invoice.create(body);
        return response.status(200).json(invoice);
    }

    async update(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, false);
        if (!invoice)
            return;

        const body = this.parseBody(request, response, true);
        if (!body)
            return;

        await invoice.update(body);
        return response.status(200).json(invoice);
    }

    async delete(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, false);
        if (!invoice)
            return;

        await invoice.destroy();
        return response.status(200).json(Success);
    }

    private async getInvoice(request: Request, response: Response, allowNonAdmin: boolean): Promise<Invoice | undefined> {
        const id = request.params.id;
        if (!id) {
            response.status(400).json(BadRequest);
            return;
        }

        const invoice = await Invoice.findByPk(id, {
            include: [{model: Client, as: "client"}],
            attributes: {
                exclude: ["client_id"]
            }
        });
        if (!invoice) {
            response.status(404).json(NotFound);
            return;
        }

        const user = request.user!;
        if (allowNonAdmin && !user.admin && user.client!.id != invoice.clientId) {
            response.status(403).json(Forbidden);
            return;
        }

        return invoice;
    }

    private parseBody(request: Request, response: Response, update: boolean): InvoiceCreationAttribute | undefined {
        const { total, payed } = request.body;
        const clientId = !update ? request.body["clientId"] : undefined;

        if ((!update && !this.checkField(clientId)) || !this.checkField(total) || !this.checkField(payed)) {
            response.status(400).json(BadRequest);
            return;
        }

        return { clientId, total, payed };
    }
}
