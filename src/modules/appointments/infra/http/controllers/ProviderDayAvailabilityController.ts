import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailability';

export default class ProviderDayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        const { provider_id } = request.params;
        const {
            day,
            month,
            year,
        } = request.body;

        const listPoviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

        const availiability = await listPoviderDayAvailability.execute({
            day,
            month,
            year,
            provider_id,
        });

        return response.json(availiability);
    }
}
