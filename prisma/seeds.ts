import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const products = [
  {
    product: "limpeza",
    name: "Detergente em pó brilhante 800g",
    description: "Produto multiuso para limpeza geral da casa.",
    price: 8.5,
    image: "https://i.imgur.com/tq40R4Y.png",
    imageMap: "#",
  },
  {
    product: "limpeza",
    name: "Esponja de Cozinha",
    description: "Esponja de alta qualidade para limpeza de superfícies.",
    price: 2,
    image: "https://i.imgur.com/8IcYTI3.png",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Picanha Premium KG",
    description: "Corte de carne picanha de qualidade premium para churrasco.",
    price: 32.5,
    image: "https://i.imgur.com/QOrilCb.png",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Filé de Frango KG",
    description: "Filé de frango fresco para preparo de refeições saudáveis.",
    price: 15,
    image: "https://i.imgur.com/dAOg7Xq.png",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Bife Ancho KG",
    description: "Corte de carne bife ancho, suculento e saboroso.",
    price: 28.5,
    image: "https://i.imgur.com/5ZFtJ0p.png",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Linguiça Artesanal KG",
    description: "Linguiça artesanal para um churrasco especial.",
    price: 13,
    image: "https://i.imgur.com/1NrNi7v.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Banana Prata KG",
    description: "Banana fresca e nutritiva para um lanche saudável.",
    price: 1.5,
    image: "https://i.imgur.com/hFBs0hM.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Limão Galego KG",
    description: "Limão galego suculento e rico em vitamina C.",
    price: 1.5,
    image: "https://i.imgur.com/dVqHHeq.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Bergamota KG",
    description: "Bergamota fresca e saborosa para um lanche leve.",
    price: 1,
    image: "https://i.imgur.com/XhJcXrn.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Alface UN",
    description: "Alface fresca e crocante, perfeita para saladas.",
    price: 2,
    image: "https://i.imgur.com/ltMOcaV.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Couve Verde Molho",
    description: "Couve verde fresca para preparar receitas saudáveis.",
    price: 1.5,
    image: "https://i.imgur.com/kvosXUy.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Maçã Nacional",
    description: "Maçãs frescas e suculentas para um lanche saudável.",
    price: 2.5,
    image: "https://i.imgur.com/Kf1QWW6.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Cenoura KG",
    description: "Cenouras cultivadas organicamente, perfeitas para receitas.",
    price: 3,
    image: "https://i.imgur.com/YtNs5I8.png",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Pão Integral 18 Grãos",
    description: "Pão integral fresco e saudável para o café da manhã.",
    price: 5,
    image: "https://i.imgur.com/vdHBuy1.png",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Pão Francês",
    description: "O tradicional pão francês fresco e crocante.",
    price: 2,
    image: "https://i.imgur.com/LVmmOvk.png",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Bolo de Chocolate",
    description: "Bolo de chocolate macio e delicioso.",
    price: 18,
    image: "https://i.imgur.com/il0aptZ.png",
    imageMap: "#",
  },
]

async function main() {
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
