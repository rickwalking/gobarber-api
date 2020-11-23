interface IMailConfig {
    drive: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string;
            name: string;
        }
    }
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'pedro@teste.com',
            name: 'Pedro da GoBarber'
        }
    }
} as unknown as IMailConfig;
