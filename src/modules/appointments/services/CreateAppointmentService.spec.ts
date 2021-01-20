import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmentService', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('Should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123123',
            provider_id: '1234567'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234567');
    });

    it('Should not be able to create a two appointments in the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123',
            user_id: '123123',
        });

        await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123',
            user_id: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            provider_id: '123',
            user_id: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            provider_id: 'user-id',
            user_id: 'user-id',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment outside the available before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 7),
            provider_id: 'user-id',
            user_id: 'user-id',
        })).rejects.toBeInstanceOf(AppError);

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 18),
            provider_id: 'user-id',
            user_id: 'user-id',
        })).rejects.toBeInstanceOf(AppError);
    });
});
