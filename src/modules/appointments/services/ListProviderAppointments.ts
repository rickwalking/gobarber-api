import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointments {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {
        //
    }

    public async execute({ provider_id, year, month, day }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day,
        });

        return appointments;
    }
}

export default ListProviderAppointments;
