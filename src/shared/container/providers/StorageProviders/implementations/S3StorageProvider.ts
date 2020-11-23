import fs from 'fs';

import path from 'path';

import mime from 'mime';

import aws, { S3 } from 'aws-sdk';

import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
    private client: S3;
    constructor() {
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
        })
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new Error('File not found');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client.putObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file,
            ACL: 'public-read',
            ContentType,
            ContentDisposition: `inline; filename=${file}`,
            Body: fileContent,
        }).promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file,
        }).promise();
    }
}

export default S3StorageProvider;