export type AccountType = "particulier" | "professionnel";
export type ProductType = "standard" | "configurable" | "quote_only";
export type PriceMode = "fixed" | "calculated" | "quote";
export type ShippingZone =
  | "metropole"
  | "reunion"
  | "guadeloupe"
  | "martinique"
  | "guyane"
  | "mayotte";
export type OrderStatus =
  | "commande_confirmee"
  | "en_preparation"
  | "en_attente_expedition"
  | "expediee"
  | "livree";
export type QuoteStatus =
  | "en_attente_devis"
  | "devis_envoye"
  | "devis_accepte"
  | "devis_rejete";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  productType: ProductType;
  price?: number;
  priceLabel: string;
  stock: "en_stock" | "stock_faible" | "rupture" | null;
  status: "publie" | "brouillon" | "archive";
  image: string;
}

export interface Order {
  id: string;
  client: string;
  clientInitials: string;
  b2b?: boolean;
  items: string;
  total: string;
  status: OrderStatus;
  statusLabel: string;
  image: string;
  createdAt: string;
  territory: ShippingZone;
}

export interface Quote {
  id: string;
  product: string;
  productImage: string;
  client: string;
  b2b?: boolean;
  dimensions?: string;
  status: QuoteStatus;
  statusLabel: string;
  quotedPrice?: string;
  createdAt: string;
  attachments?: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: AccountType;
  company?: string;
  siret?: string;
  territory: ShippingZone;
  orders: number;
  totalSpent: string;
  lastActivity: string;
  createdAt: string;
  avatarInitials: string;
}

export interface Conversation {
  id: string;
  vendorName: string;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  b2b?: boolean;
  pinnedEntity?: {
    kind: "order" | "quote";
    ref: string;
    label: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "admin" | "client";
  content: string;
  attachments?: string[];
  createdAt: string;
}
