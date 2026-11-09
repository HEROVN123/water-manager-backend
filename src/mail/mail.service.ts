import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT') || 465),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendResetCode(to: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject: 'Mã xác nhận đặt lại mật khẩu - WATER MANAGER',
        text: `Mã xác nhận đặt lại mật khẩu của bạn là: ${code}. Mã có hiệu lực trong 5 phút.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #087ea4;">WATER MANAGER</h2>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
            <p>Mã xác nhận của bạn là:</p>
            <h1 style="letter-spacing: 8px; color: #087ea4;">${code}</h1>
            <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email. Vui lòng thử lại sau.',
      );
    }
  }
}