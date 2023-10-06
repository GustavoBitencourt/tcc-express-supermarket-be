import { PrismaClient, Customer } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserByEmail(email: string): Promise<Customer | null> {
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    return user;
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  }

  generateAuthToken(userId: number): string {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "", {
      expiresIn: "1h", // Defina o tempo de expiração do token
    });
    return token;
  }
}
