import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService' , () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();

        showProfile = new ShowProfileService(
            fakeUserRepository,
        );
    });

    it('Should be able to show the profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const profile = await showProfile.execute({
            'user_id': user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });

    it('Should not be able to show the profile from a non-existing user', async () => {
        await expect(showProfile.execute({
            user_id: 'non-existing-id',
        })).rejects.toBeInstanceOf(AppError)
    });
});
