import FakerHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakerHashProvider;

describe('ResetPasswordService' , () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakerHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('Should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('Should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPasswordService.execute({
                token,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to reset password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await expect(resetPasswordService.execute({
            password: '123123',
            token,
        })).rejects.toBeInstanceOf(AppError);
    });
});
