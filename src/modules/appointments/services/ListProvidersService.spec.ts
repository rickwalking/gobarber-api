import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakerHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakerHashProvider;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService' , () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakerHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUserRepository,
            fakeCacheProvider,
        );
    });

    it('Should be able to list providers', async () => {
        const user1 = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user2 = await fakeUserRepository.create({
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123456'
        });

        const loggedUser = await fakeUserRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456'
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id
        });

        expect(providers).toStrictEqual([
            user1,
            user2,
        ]);
    });
});
