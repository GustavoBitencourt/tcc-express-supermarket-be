import { PrismaClient, Product } from "@prisma/client";
import { RegisterProductData } from "../interfaces/RegisterProductData";

export default class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async registerProduct(productData: RegisterProductData): Promise<Product> {
    const { product, name, description, image, imageMap, price, stockLevel } = productData;

    // Cria um novo produto no banco de dados
    const newProduct = await this.prisma.product.create({
      data: {     
        product,
        name,
        description,
        image,
        imageMap,
        price,
        stockLevel,       
      },
    });

    return newProduct;
  }

  async deleteProduct(productId: number): Promise<void> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });
  }
  
  async updateProduct(productId: number, productData: RegisterProductData): Promise<Product> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: productData,
    });

    return updatedProduct;
  }
}