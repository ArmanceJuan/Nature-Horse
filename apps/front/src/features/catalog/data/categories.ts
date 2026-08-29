export interface ShopCategory {
  label: string;
  slug: string | null;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  { label: "Voir tout", slug: null },
  { label: "Cavalier", slug: "cavalier" },
  { label: "Cheval", slug: "cheval" },
  { label: "Écurie", slug: "ecurie" },
  { label: "Soin", slug: "soin" },
  { label: "Chiens Chats", slug: "chiens-chats" },
  { label: "Promotions", slug: "promotions" },
  { label: "Nouveauté", slug: "nouveaute" },
];
