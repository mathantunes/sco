import type { Product } from "./product.js";

export type Menu = {
  id: string;
  name: string;
  categories: MenuCategory[];
};

export type MenuCategory = {
    id: string;
    name: string;
    items: MenuItem[];
};

export type MenuItem = {
  id: string;
  product: Product;
};