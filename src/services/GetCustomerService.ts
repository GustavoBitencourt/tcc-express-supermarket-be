import { PrismaClient, Customer } from "@prisma/client";

export default class GetCustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getCustomerById(customerId: number): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    return customer || null;
  }
}
