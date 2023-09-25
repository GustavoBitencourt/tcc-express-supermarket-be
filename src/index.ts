import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import { CustomerData } from "./interfaces/CustomerData";
import { PaymentData } from "./interfaces/PaymentData";
import { ProductData } from "./interfaces/ProductData";

import CheckoutService from "./services/CheckoutService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) return res.status(400).send({ error: "Message is required" });

  res.send({ message });
});

app.get("/products", async (req: Request, res: Response) => {
  const { product } = req.query;

  // Verifica se o parâmetro "product" está presente na consulta
  if (product) {
    const products = await prisma.product.findMany({
      where: {
        product: {
          equals: product as string,
        },
      },
    });
    return res.send(products);
  }

  // Se o parâmetro "product" não estiver presente, retorna todos os produtos
  const allProducts = await prisma.product.findMany();
  res.send(allProducts);
});

app.get("/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: {
      id: +id,
    },
    include: { customer: true, orderItems: { include: { product: true } } },
  });

  if (!order) return res.status(404).send({ error: "Order not found" });

  res.send(order);
});

interface CheckoutRequest extends Request {
  body: {
    cart: ProductData[];
    customer: CustomerData;
    payment: PaymentData;
  };
}

app.post("/checkout", async (req: CheckoutRequest, res: Response) => {
  const { cart, customer, payment } = req.body;

  const orderCreated = await new CheckoutService().process(
    cart,
    customer,
    payment
  );

  res.send(orderCreated);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
