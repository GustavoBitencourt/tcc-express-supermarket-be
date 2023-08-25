import { Customer, Order, PrismaClient } from "@prisma/client"

import { CustomerData } from "../interfaces/CustomerData"
import { PaymentData } from "../interfaces/PaymentData"
import { ProductData } from "../interfaces/ProductData"
import PaymentService from "./PaymentService"

export default class CheckoutService {
  private prisma: PrismaClient

  // new CheckoutService()
  constructor() {
    this.prisma = new PrismaClient()
  }

  async process(
    cart: ProductData[],
    customer: CustomerData,
    payment: PaymentData
  ): Promise<{ id: number; transactionId: string; status: string }> {
    // TODO: "puxar" os dados de products do BD
    // in: [1,2,3,4]
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: cart.map((product) => product.id),
        },
      },
    })
    // console.log(`products`, products)

    const productsInCart = products.map<ProductData>((product) => ({
      ...product,
      price: Number(product.price),
      quantity: cart.find((item) => item.id === product.id)?.quantity!,
      subTotal:
        cart.find((item) => item.id === product.id)?.quantity! *
        Number(product.price),
    }))
    // console.log(`productsInCart`, productsInCart)

    // TODO: registrar os dados do cliente no BD
    const customerCreated = await this.createCustomer(customer)
    // console.log(`customerCreated`, customerCreated)

    // TODO: criar uma order orderitem
    let orderCreated = await this.createOrder(productsInCart, customerCreated)
    // console.log(`orderCreated`, orderCreated)

    // TODO: processar o pagamento
    const { transactionId, status } = await new PaymentService().process(
      orderCreated,
      customerCreated,
      payment
    )

    orderCreated = await this.prisma.order.update({
      where: { id: orderCreated.id },
      data: {
        transactionId,
        status,
      },
    })

    return {
      id: orderCreated.id,
      transactionId: orderCreated.transactionId!,
      status: orderCreated.status,
    }
  }

  private async createCustomer(customer: CustomerData): Promise<Customer> {
    const customerCreated = await this.prisma.customer.upsert({
      where: { email: customer.email },
      update: customer,
      create: customer,
    })

    return customerCreated
  }

  private async createOrder(
    productsInCart: ProductData[],
    customer: Customer
  ): Promise<Order> {
    const total = productsInCart.reduce((acc, product) => acc + product.subTotal, 0)
    const orderCreated = await this.prisma.order.create({
      data: {
        total,
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
    })

    return orderCreated
  }
}
