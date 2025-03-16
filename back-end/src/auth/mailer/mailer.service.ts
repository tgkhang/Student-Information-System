import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from './mail.config';

@Injectable()
export class MailerService {
  private transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  /**
   * Gửi email yêu cầu đặt lại mật khẩu.
   * @param to
   * @param resetLink
   */
  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: mailConfig.auth.user,
      to,
      subject: 'Yêu cầu đặt lại mật khẩu',
      text: `Xin chào, \n\nVui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn: \n${resetLink}`,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email gửi thành công tới ${to}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Lỗi khi gửi email tới ${to}: ${error.message}`);
      throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
    }
  }
}
