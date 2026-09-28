import type { PrismaClient } from "../generated/prisma/client.js";

const CATEGORIES = [
  { slug: "cavalier", name: "Cavalier", position: 1 },
  { slug: "cheval", name: "Cheval", position: 2 },
  { slug: "ecurie", name: "Écurie", position: 3 },
  { slug: "soin", name: "Soin", position: 4 },
  { slug: "chiens-chats", name: "Chiens Chats", position: 5 },
];

const CATEGORY_BY_PRODUCT_SLUG: Record<string, string> = {
  "veste-performance-1": "cavalier",
  "polo-technique-1": "cavalier",
  "bombers-cuir-1": "cavalier",
  "pantalon-equitation-1": "cavalier",
  "bombe-equitation-1": "cavalier",
  "chemise-concours-1": "cavalier",
  "gilet-sans-manches-1": "cavalier",
  "cravache-carbone-1": "cavalier",
  "bottes-cuir-1": "cavalier",
  "gants-equitation-1": "cavalier",
  "chaps-cuir-1": "cavalier",
  "veste-concours-1": "cavalier",
  "chaussettes-equitation-1": "cavalier",
  "ceinture-cuir-1": "cavalier",
  "sac-cavaliere-1": "cavalier",
  "casquette-marque-1": "cavalier",
  "selle-monolith-1": "cheval",
  "etrivieres-cuir-1": "cheval",
  "bridon-cuir-1": "cheval",
  "tapis-dressage-1": "cheval",
  "guetres-protection-1": "cheval",
  "couvre-reins-1": "cheval",
  "selle-dressage-1": "cheval",
  "sursangle-1": "cheval",
  "protection-boulet-1": "cheval",
  "longe-cheval-1": "ecurie",
  "brosse-etrille-1": "soin",
  "spray-soin-1": "soin",
  "cool-pack-1": "soin",
  "collier-chien-1": "chiens-chats",
  "manteau-chien-1": "chiens-chats",
  "panier-chat-1": "chiens-chats",
};

export const seedCategories = async (prisma: PrismaClient) => {
  const categoryIds = new Map<string, string>();

  for (const category of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, position: category.position },
      create: category,
    });
    categoryIds.set(category.slug, saved.id);
  }

  let assignedCount = 0;

  for (const [productSlug, categorySlug] of Object.entries(
    CATEGORY_BY_PRODUCT_SLUG,
  )) {
    const categoryId = categoryIds.get(categorySlug);
    if (!categoryId) continue;

    const result = await prisma.product.updateMany({
      where: { slug: productSlug, categoryId: null },
      data: { categoryId },
    });

    assignedCount += result.count;
  }

  console.log(
    `Categories seeded: ${CATEGORIES.length} categories, ${assignedCount} products assigned`,
  );
};
