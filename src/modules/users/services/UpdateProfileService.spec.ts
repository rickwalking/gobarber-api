import FakerHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakerHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile' , () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakerHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('Should be able to update the profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfile.execute({
            'user_id': user.id,
            name: 'John Tre',
            email: 'johntre@example.com'
        });

        expect(updatedUser.name).toBe('John Tre');
        expect(updatedUser.email).toBe('johntre@example.com');
    });

    it('Should not be able to update the profile from a non-existing user', async () => {
        await expect(updateProfile.execute({
            user_id: 'non-existing-id',
            name: 'test',
            email: 'test@example.com'
        })).rejects.toBeInstanceOf(AppError)
    });

    it('Should not be able to change to another user email', async () => {
        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user = await fakeUserRepository.create({
            name: 'test',
            email: 'test@example.com',
            password: '123456',
        });

        expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should be able to update the password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfile.execute({
            'user_id': user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('Should not be able to update the password with wrong old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfile.execute({
            'user_id': user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: 'wrong-old-password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to update the password without the old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfile.execute({
            'user_id': user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });
});
