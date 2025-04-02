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

  async sendDisciplineEmail(
    to: string,
    hoTenPhuHuynh: string,
    noiDung: string,
    hinhThuc: string,
    ngayLap: Date,
  ) {
    const mailOptions = {
      from: mailConfig.auth.user,
      to,
      subject: 'Thông báo kỷ luật sinh viên',
      html: `
        <p>Xin chào <strong>${hoTenPhuHuynh}</strong>,</p>
        <p>Chúng tôi xin thông báo rằng sinh viên dưới sự giám hộ của bạn đã bị lập biên bản kỷ luật với nội dung như sau:</p>
        <ul>
          <li><strong>Nội dung:</strong> ${noiDung}</li>
          <li><strong>Hình thức xử lý:</strong> ${hinhThuc}</li>
          <li><strong>Ngày lập:</strong> ${new Date(ngayLap).toLocaleDateString('vi-VN')}</li>
        </ul>
        <p>Trân trọng,</p>
        <p>Phòng Công tác Sinh viên</p>
      `,
    };

    try {
      this.logger.log(`Gửi email thông báo kỷ luật đến: ${to}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email gửi thành công đến: ${to}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Lỗi khi gửi email đến ${to}: ${error.message}`);
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Không thể gửi email thông báo kỷ luật: ${error.message}`,
      );
    }
  }
}
