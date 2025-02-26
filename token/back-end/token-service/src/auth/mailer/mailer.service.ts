import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from './mail.config'; // Import cấu hình email

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  async sendResetPasswordEmail(to: string, resetToken: string): Promise<void> {
    const resetLink = `http://ủl/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: mailConfig.auth.user,
      to,
      subject: 'Yêu cầu đặt lại mật khẩu',
      text: `Xin chào, \n\nVui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn: \n${resetLink}`,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.transporter.sendMail(mailOptions);
  }
}
