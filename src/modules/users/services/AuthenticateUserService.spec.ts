import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser' , () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider
        );

        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('Should be able to authenticate', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('Should not be able to authenticate with non existing user', async () => {
        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to authenticate with wrong password', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '12345'
        })).rejects.toBeInstanceOf(AppError);
    });
});
