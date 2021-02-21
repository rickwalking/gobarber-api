import { Request, Response } from 'express';

import ListProviderAppointments from '@modules/appointments/services/ListProviderAppointments';

import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id;
        const { day, month, year } = request.query;

        const listProviderAppointments = container.resolve(
            ListProviderAppointments,
        );

        const appointments = await listProviderAppointments.execute({
            day: Number(day),
            month: Number(month),
            year: Number(year),
            provider_id,
        });

        return response.json(appointments);
    }
}
