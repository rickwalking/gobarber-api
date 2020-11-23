import FakerHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import CreateUserService from '@modules/users/services/CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakerHashProvider;
let createUser: CreateUserService;

describe('CreateUserService' , () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakerHashProvider();

        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider
        );
    });

    it('Should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('Should not be able to create a two users with the same email', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});
