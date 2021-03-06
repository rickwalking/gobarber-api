import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
    private messages: ISendMailDTO[] = [];

    public async sendEmail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }
}
