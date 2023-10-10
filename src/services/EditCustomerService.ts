import { PrismaClient, Customer } from "@prisma/client";
import bcrypt from "bcrypt";
import { CustomerData } from "../interfaces/CustomerData";

export default class EditCustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async editUserCustomer(
    userId: number,
    userData: CustomerData
  ): Promise<Customer> {
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

    // Verifica se o usuário existe com base no ID
    const existingUser = await this.prisma.customer.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Atualize os campos do usuário com os novos dados
    const updatedUser = await this.prisma.customer.update({
      where: { id: userId },
      data: {
        email,
        password: password
          ? await bcrypt.hash(password, 10)
          : existingUser.password,
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

    return updatedUser;
  }
}
