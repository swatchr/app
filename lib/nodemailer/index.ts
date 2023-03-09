import { createTransport } from 'nodemailer';

import type { Transporter } from 'nodemailer';

import { env } from '@/env.mjs';

type EmailParams = {
  email: string;
  subject: string;
  html: string;
};

export default class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      secure: true,
    });
  }

  async sendTransactionalEmail(params: EmailParams) {
    await this.transporter.sendMail({
      from: 'Swatchr App <support@swatchr.app>',
      to: params.email,
      subject: params.subject,
      html: params.html,
    });
  }

  async sendAdminEmail(params: Omit<EmailParams, 'email'>) {
    await this.transporter.sendMail({
      from: 'Swatchr App <support@swatchr.app>',
      to: env.ADMIN_EMAIL,
      subject: params.subject,
      html: params.html,
    });
  }
}
