import type {
  StatCard,
  RecentOrder,
  StockAlert,
} from "../types/admin.types.js";

export const mockStats: StatCard[] = [
  {
    label: "Chiffre d'affaires",
    value: "24 500 €",
    variation: 12,
    icon: "revenue",
  },
  { label: "Commandes", value: "342", variation: 5, icon: "orders" },
  { label: "Panier moyen", value: "71,60 €", variation: -2, icon: "basket" },
  { label: "Nouveaux clients", value: "48", variation: 18, icon: "customers" },
];

export const mockRecentOrders: RecentOrder[] = [
  {
    id: "#NH-8924",
    client: "Marie Laurent",
    initials: "ML",
    date: "24 Oct, 14:30",
    status: "Expédié",
    total: 245.0,
  },
  {
    id: "#NH-8923",
    client: "Thomas Perrin",
    initials: "TP",
    date: "24 Oct, 11:15",
    status: "En cours",
    total: 89.5,
  },
  {
    id: "#NH-8922",
    client: "Sophie Dubois",
    initials: "SD",
    date: "23 Oct, 16:45",
    status: "Annulé",
    total: 1250.0,
  },
  {
    id: "#NH-8921",
    client: "Jean Blanc",
    initials: "JB",
    date: "23 Oct, 09:20",
    status: "Livré",
    total: 45.9,
  },
];

export const mockStockAlerts: StockAlert[] = [
  {
    category: "Héritage",
    subtitle: "Selles & Cuirs",
    level: 25,
    status: "Stock Faible",
  },
  {
    category: "Cavalier",
    subtitle: "Équipement & Vêtements",
    level: 85,
    status: "Optimal",
  },
  {
    category: "Cheval",
    subtitle: "Soins & Nutrition",
    level: 55,
    status: "Normal",
  },
];
