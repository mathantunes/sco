
import type { Menu } from "contracts/menu";
import { Product } from "contracts/product.js";

export class MenuService {
  async getMenu(storeId: string): Promise<Menu[]> {
    return menus[storeId as keyof typeof menus] ?? [];
  }

  async getProductById(storeId: string, productId: string): Promise<Product | null> {
    const menu = await this.getMenu(storeId);
    const products = menu
    .flatMap(category => category.categories.flatMap(cat => cat.items))
    .map(item => item.product);
    const product = products.find(item => item.id === productId);
    return product ?? null;
  }
}

// Mock data for demonstration purposes
const menus: Record<string, Menu[]> = {
    "store1": [
        {
            id: "item1",
            name: "Menu 1",
            categories: [
                {
                    id: "category1",
                    name: "Burgers",
                    items: [
                        {
                            id: "burger1",
                            product: {
                                id: "burger1",
                                name: "Cheeseburger",
                                price: { amount: "5.99", currency: "USD" },
                                imageUrl: "https://example.com/images/cheeseburger.jpg"
                            }
                        }
                    ]
                },
                {
                    id: "category2",
                    name: "Drinks",
                    items: [
                        {
                            id: "drink1",
                            product: {
                                id: "drink1",
                                name: "Coke",
                                price: { amount: "1.99", currency: "USD" },
                                imageUrl: "https://example.com/images/coke.jpg"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};