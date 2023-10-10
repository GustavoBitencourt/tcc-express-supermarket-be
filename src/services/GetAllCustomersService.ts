import { PrismaClient, Customer } from "@prisma/client";

export default class GetAllCustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getCustomerById(
    customerId: number | undefined
  ): Promise<Customer | null> {
    if (customerId) {
      // Se um ID de cliente for fornecido, busque apenas esse cliente
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      return customer || null;
    } else {
      return null;
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    // Busca todos os clientes
    const customers = await this.prisma.customer.findMany();
    return customers;
  }
}
