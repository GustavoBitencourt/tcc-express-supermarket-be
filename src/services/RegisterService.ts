import { PrismaClient, Customer } from "@prisma/client";
import bcrypt from "bcrypt";
import { CustomerData } from "../interfaces/CustomerData";

export default class RegisterService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async registerUser(userData: CustomerData): Promise<Customer> {
    const {
      email,
      password,
      fullName,
      mobile,
      document,
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    } = userData;

    // Verifique se o email já está em uso
    const existingUser = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash da senha antes de armazená-la no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crie um novo usuário no banco de dados
    const newUser = await this.prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        mobile,
        document,
        zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      },
    });

    return newUser;
  }
}
