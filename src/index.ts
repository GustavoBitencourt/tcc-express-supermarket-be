import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import { CustomerData } from "./interfaces/CustomerData";
import { PaymentData } from "./interfaces/PaymentData";
import { ProductData } from "./interfaces/ProductData";
import ProductService from "./services/ProductService";

import CheckoutService from "./services/CheckoutService";
import GetCustomerService from "./services/GetCustomerService";
import GetAllCustomerService from "./services/GetAllCustomersService";
import ForgotPasswordService from "./services/ForgotPasswordService";
import authRouter from "./routes/AuthRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();
const productService = new ProductService();

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);

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

app.get("/allproducts", async (req: Request, res: Response) => {
  try {
    const allProducts = await prisma.product.findMany();
    res.send(allProducts);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).send({ error: "Failed to fetch all products" });
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const newProduct = await productService.registerProduct(productData);
    res.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

class ProductError extends Error {}

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const productData = req.body;
    const updatedProduct = await productService.updateProduct(
      productId,
      productData
    );

    res.json(updatedProduct);
  } catch (error: unknown) {
    if (
      error instanceof ProductError &&
      error.message === "Product not found"
    ) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Rota para buscar um produto pelo ID
app.get("/product/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Rota para excluir um produto pelo ID
app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    await productService.deleteProduct(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/orders/:id?", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id) {
    const order = await prisma.order.findUnique({
      where: {
        id: +id,
      },
      include: { customer: true, orderItems: { include: { product: true } } },
    });

    if (!order) return res.status(404).send({ error: "Order not found" });

    res.send(order);
  } else {
    const orders = await prisma.order.findMany({
      include: { customer: true, orderItems: { include: { product: true } } },
    });

    res.send(orders);
  }
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

app.get("/customers", async (req: Request, res: Response) => {
  try {
    const getCustomerService = new GetAllCustomerService();
    const customers = await getCustomerService.getAllCustomers();

    res.send(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).send({ error: "Failed to fetch customers" });
  }
});

app.get("/customers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      res.status(400).send({ error: "Invalid customer ID" });
      return;
    }

    const getCustomerService = new GetCustomerService();
    const customer = await getCustomerService.getCustomerById(customerId);

    if (!customer) {
      res.status(404).send({ error: "Customer not found" });
      return;
    }

    res.send(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).send({ error: "Failed to fetch customer" });
  }
});

app.put("/customer/:id", async (req: Request, res: Response) => {
  const { id } = req.params; // ID do usuário a ser editado
  const updatedCustomerData = req.body; // Novos dados do perfil a serem atualizados

  try {
    // Lógica para atualizar o perfil do usuário com os novos dados
    const updatedCustomer = await prisma.customer.update({
      where: { id: +id },
      data: updatedCustomerData,
    });

    res.send(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).send({ error: "Failed to update customer" });
  }
});

const forgotPasswordService = new ForgotPasswordService();

app.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const resetCode = await forgotPasswordService.sendResetCode(email);

    if (resetCode === null) {
      // Usuário não encontrado, retorna 404 (Not Found)
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Reset code sent successfully" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ error: "Failed to send reset code" });
  }
});

app.post("/reset-password", async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  try {
    // lógica para verificar o código e redefinir a senha
    await forgotPasswordService.resetPassword(email, code, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
