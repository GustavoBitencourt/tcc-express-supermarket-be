import { PrismaClient, Customer } from "@prisma/client";

export default class GetCustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getCustomers(customerId?: number): Promise<Customer[]> {
    if (customerId) {
      // Se um ID de cliente for fornecido, busque apenas esse cliente
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (customer) {
        return [customer];
      } else {
        return [];
      }
    } else {
      // Caso contrário, busca todos os clientes
      const customers = await this.prisma.customer.findMany();
      return customers;
    }
  }
}
