import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const products = [
  {
    product: "limpeza",
    name: "Detergente Ultra Clean",
    description: "Detergente poderoso para limpeza de louças e utensílios.",
    price: 3.5,
    image: "URL_DA_IMAGEM_DETERGENTE",
    imageMap: "#",
  },
  {
    product: "limpeza",
    name: "Desinfetante Fresh Scent",
    description: "Desinfetante perfumado para limpeza de superfícies.",
    price: 6,
    image: "URL_DA_IMAGEM_DESINFETANTE",
    imageMap: "#",
  },
  {
    product: "limpeza",
    name: "Multiuso CleanMax",
    description: "Produto multiuso para limpeza geral da casa.",
    price: 8.5,
    image: "URL_DA_IMAGEM_MULTIUSO",
    imageMap: "#",
  },
  {
    product: "limpeza",
    name: "Limpador Multi Super",
    description: "Limpador multiuso para uma limpeza profunda e eficaz.",
    price: 7.5,
    image: "URL_DA_IMAGEM_MULTI_SUPER",
    imageMap: "#",
  },
  {
    product: "limpeza",
    name: "Esponja de Limpeza",
    description: "Esponja de alta qualidade para limpeza de superfícies.",
    price: 2,
    image: "URL_DA_IMAGEM_ESPONJA",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Picanha Premium",
    description: "Corte de carne picanha de qualidade premium para churrasco.",
    price: 32.5,
    image: "URL_DA_IMAGEM_PICANHA",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Filé de Frango",
    description: "Filé de frango fresco para preparo de refeições saudáveis.",
    price: 15,
    image: "URL_DA_IMAGEM_FRANGO",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Bife Ancho",
    description: "Corte de carne bife ancho, suculento e saboroso.",
    price: 28.5,
    image: "URL_DA_IMAGEM_BIFE_ANCHO",
    imageMap: "#",
  },
  {
    product: "carne",
    name: "Linguiça Artesanal",
    description: "Linguiça artesanal para um churrasco especial.",
    price: 13,
    image: "URL_DA_IMAGEM_LINGUICA",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Banana",
    description: "Banana fresca e nutritiva para um lanche saudável.",
    price: 1.5,
    image: "https://i.imgur.com/CQP9nRC.png",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Limão Galego",
    description: "Limão galego suculento e rico em vitamina C.",
    price: 0.5,
    image: "URL_DA_IMAGEM_LIMAO_GALEGO",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Bergamota",
    description: "Bergamota fresca e saborosa para um lanche leve.",
    price: 1,
    image: "URL_DA_IMAGEM_BERGAMOTA",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Alface Unidade",
    description: "Alface fresca e crocante, perfeita para saladas.",
    price: 2,
    image: "URL_DA_IMAGEM_ALFACE",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Couve Verde",
    description: "Couve verde fresca para preparar receitas saudáveis.",
    price: 1.5,
    image: "URL_DA_IMAGEM_COUVE",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Molho de Salada",
    description: "Molho de salada fresco e saboroso para acompanhar vegetais.",
    price: 4,
    image: "URL_DA_IMAGEM_MOLHO_SALADA",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Melancia Fresca",
    description: "Melancia fresca e suculenta para se refrescar.",
    price: 6,
    image: "URL_DA_IMAGEM_MELANCIA",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Abacate Maduro",
    description: "Abacate maduro pronto para consumo.",
    price: 4.5,
    image: "URL_DA_IMAGEM_ABACATE",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Maçãs Frescas",
    description: "Maçãs frescas e suculentas para um lanche saudável.",
    price: 2.5,
    image: "URL_DA_IMAGEM_MACAS",
    imageMap: "#",
  },
  {
    product: "hortifruti",
    name: "Cenouras Orgânicas",
    description: "Cenouras cultivadas organicamente, perfeitas para receitas.",
    price: 3,
    image: "URL_DA_IMAGEM_CENOURAS",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Pão Integral",
    description: "Pão integral fresco e saudável para o café da manhã.",
    price: 5,
    image: "URL_DA_IMAGEM_PAO_INTEGRAL",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Croissant de Chocolate",
    description: "Croissant recheado com chocolate para um lanche delicioso.",
    price: 4.5,
    image: "URL_DA_IMAGEM_CROISSANT",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Pão Francês",
    description: "O tradicional pão francês fresco e crocante.",
    price: 2,
    image: "URL_DA_IMAGEM_PAO_FRANCES",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Bolo de Chocolate",
    description: "Bolo de chocolate macio e delicioso.",
    price: 18,
    image: "URL_DA_IMAGEM_BOLO_CHOCOLATE",
    imageMap: "#",
  },
  {
    product: "padaria",
    name: "Croissant Tradicional",
    description: "Croissant tradicional para um café da manhã clássico.",
    price: 3.5,
    image: "URL_DA_IMAGEM_CROISSANT_TRADICIONAL",
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
