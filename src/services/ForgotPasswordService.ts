import { PrismaClient, Customer } from "@prisma/client";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export default class ForgotPasswordService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async sendResetCode(email: string): Promise<void> {
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resetCode = uuidv4().slice(0, 6);

    await this.prisma.customer.update({
      where: { id: user.id },
      data: { resetCode },
    });

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      text: `Seu código de recuperação de senha é: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.resetCode !== code) {
      throw new Error("Invalid reset code");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.customer.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetCode: null },
    });
  }
}
