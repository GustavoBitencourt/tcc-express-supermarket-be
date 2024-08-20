import { Customer, Order, PrismaClient } from "@prisma/client";

import { CustomerData } from "../interfaces/CustomerData";
import { PaymentData } from "../interfaces/PaymentData";
import { ProductData } from "../interfaces/ProductData";
import PaymentService from "./PaymentService";

export default class CheckoutService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async process(
    cart: ProductData[],
    customer: CustomerData,
    payment: PaymentData,
    paymentMethod: string,
    shippingMethod: string
  ): Promise<{ id: number; transactionId: string; status: string }> {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: cart.map((product) => product.id),
        },
      },
    });

    const productsInCart = products.map<ProductData>((product) => ({
      ...product,
      description: product.description ?? "",
      price: Number(product.price),
      quantity: cart.find((item) => item.id === product.id)?.quantity!,
      subTotal:
        cart.find((item) => item.id === product.id)?.quantity! *
        Number(product.price),
    }));

    const customerCreated = await this.createCustomer(customer);

    if (customerCreated === null) {
      return {
        id: 0,
        transactionId: "",
        status: "Usuário não existe",
      };
    }

    let orderCreated = await this.createOrder(
      productsInCart,
      customerCreated,
      paymentMethod,
      shippingMethod
    );

    const { transactionId, status } = await new PaymentService().process(
      orderCreated,
      customerCreated,
      payment
    );

    orderCreated = await this.prisma.order.update({
      where: { id: orderCreated.id },
      data: {
        transactionId,
        status,
      },
    });

    return {
      id: orderCreated.id,
      transactionId: orderCreated.transactionId!,
      status: orderCreated.status,
    };
  }

  private async createCustomer(
    customer: CustomerData
  ): Promise<Customer | null> {
    const customerCreated = await this.prisma.customer.findUnique({
      where: { email: customer.email },
    });

    if (customerCreated) {
      const updatedCustomer = await this.prisma.customer.update({
        where: { email: customer.email },
        data: customer,
      });

      return updatedCustomer;
    } else {
      return null;
    }
  }

  private async createOrder(
    productsInCart: ProductData[],
    customer: Customer,
    paymentMethod: string,
    shippingMethod: string
  ): Promise<Order> {
    const total = productsInCart.reduce(
      (acc, product) => acc + product.subTotal,
      0
    );
    const orderCreated = await this.prisma.order.create({
      data: {
        total,
        paymentMethod,
        shippingMethod,
        customer: {
          connect: { id: customer.id },
        },
        orderItems: {
          createMany: {
            data: productsInCart.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
              subTotal: product.subTotal,
            })),
          },
        },
      },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });

    return orderCreated;
  }
}
