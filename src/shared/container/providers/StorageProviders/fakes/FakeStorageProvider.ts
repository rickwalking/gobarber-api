import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
    private storage: string[] = [];

    public async saveFile(file: string): Promise<string> {
        this.storage.push(file);
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        this.storage.filter((myFiles) => myFiles !== file);
    }
}

export default FakeStorageProvider;
