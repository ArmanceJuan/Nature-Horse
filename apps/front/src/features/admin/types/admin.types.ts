export interface StatCard {
  label: string;
  value: string;
  variation: number;
  icon: "revenue" | "orders" | "basket" | "customers";
}

export interface RecentOrder {
  id: string;
  client: string;
  initials: string;
  date: string;
  status: "Expédié" | "En cours" | "Annulé" | "Livré";
  total: number;
}

export interface StockAlert {
  category: string;
  subtitle: string;
  level: number;
  status: "Stock Faible" | "Optimal" | "Normal";
}
