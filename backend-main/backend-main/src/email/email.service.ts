import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

import { SendMailOptions } from './interfaces';
import { Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from 'src/auth/dtos';
import { envs } from 'src/config';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor() { }

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options;
        try {
            await this.transporter.sendMail({
                from: envs.MAILER_EMAIL,
                to,
                subject,
                html: htmlBody,
                attachments,
            });

            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async sendRegistrationEmail(createUserDto: CreateUserDto): Promise<boolean> {
        await this.sendEmail({
            from: `${process.env.MAILER_EMAIL}`,
            to: createUserDto.email,
            subject: 'CSM - Welcome  - Account Information',
            htmlBody: `<h1><strong>CSM</strong></h1><p>Your account has been successfully created.</p>
                    <p>Your temporary password is:  <strong>${createUserDto.password}
                     Please change it after your first login.</strong></p>
                    `,
        });
        return true;
    }

    async sendChangePasswordEmail(email: string): Promise<boolean> {

        const templatePath = path.join(__dirname, '..', 'templates', 'password-changed.template.html');
        const bannerPath = path.join(__dirname, '..', 'templates', 'banner.png');
        const template = fs.readFileSync(templatePath, 'utf8');
        let htmlContent = template.replace('{{email}}', email); 

        await this.sendEmail({
            from: `${process.env.MAILER_EMAIL}`,
            to: email,
            subject: 'CSM - Password Change Notification',
            htmlBody: htmlContent,
            attachments: [
                {
                    filename: 'banner.png',
                    path: bannerPath,
                    cid: 'banner',
                },
            ],
        });
        return true;
    }

    async sendPasswordRecoveryEmail(email: string, token: string): Promise<boolean> {

        const recoveryLink = `${envs.FRONTEND_URL}/auth/recover-password?token=${token}`;
        const templatePath = path.join(__dirname, '..', 'templates', 'password-recovery.template.html');
        const bannerPath = path.join(__dirname, '..', 'templates', 'banner.png');
        const template = fs.readFileSync(templatePath, 'utf8');

        let htmlContent = template.replace('{{email}}', email);
        htmlContent = htmlContent.replace('{{recoveryLink}}', recoveryLink);
        htmlContent = htmlContent.replace('{{recoveryLink}}', recoveryLink);

        return this.sendEmail({
            from: `${process.env.MAILER_EMAIL}`,
            to: email,
            subject: 'CSM - Password Recovery',
            htmlBody: htmlContent,
            attachments: [
                {
                    filename: 'banner.png',
                    path: bannerPath,
                    cid: 'banner',
                },
            ],
        });
    }
}
