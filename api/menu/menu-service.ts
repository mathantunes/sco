
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
            id: "main-menu",
            name: "Snack Bar Menu",
            categories: [
                {
                    id: "snacks",
                    name: "Savory Snacks",
                    items: [
                        {
                            id: "chips-sea-salt",
                            product: {
                                id: "chips-sea-salt",
                                name: "Sea Salt Potato Chips",
                                price: { amount: "2.49", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop"
                            },
                        },
                        {
                            id: "popcorn-sea-salt",
                            product: {
                                id: "popcorn-sea-salt",
                                name: "Sea Salt Popcorn",
                                price: { amount: "2.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1578849278619-1cfb8e9c2a3d?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "pretzels",
                            product: {
                                id: "pretzels",
                                name: "Honey Wheat Pretzels",
                                price: { amount: "2.79", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                },
                {
                    id: "drinks",
                    name: "Cold Drinks",
                    items: [
                        {
                            id: "drink1",
                            product: {
                                id: "drink1",
                                name: "Cola",
                                price: { amount: "1.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "sparkling-water",
                            product: {
                                id: "sparkling-water",
                                name: "Lime Sparkling Water",
                                price: { amount: "1.79", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "iced-tea",
                            product: {
                                id: "iced-tea",
                                name: "Peach Iced Tea",
                                price: { amount: "2.29", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                },
                {
                    id: "sweets",
                    name: "Sweet Treats",
                    items: [
                        {
                            id: "chocolate-bar",
                            product: {
                                id: "chocolate-bar",
                                name: "Milk Chocolate Bar",
                                price: { amount: "2.49", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "gummy-candy",
                            product: {
                                id: "gummy-candy",
                                name: "Gummy Candy Pouch",
                                price: { amount: "2.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "oat-cookie",
                            product: {
                                id: "oat-cookie",
                                name: "Oatmeal Raisin Cookie",
                                price: { amount: "1.89", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                },
                {
                    id: "quick-bites",
                    name: "Quick Bites",
                    items: [
                        {
                            id: "trail-mix",
                            product: {
                                id: "trail-mix",
                                name: "Chocolate Trail Mix",
                                price: { amount: "3.49", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "granola-bar",
                            product: {
                                id: "granola-bar",
                                name: "Honey Oat Granola Bar",
                                price: { amount: "1.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                }
            ]
        }
    ],
    "store2": [
        {
            id: "store2-menu",
            name: "Riverside Snack Bar",
            categories: [
                {
                    id: "store2-savory",
                    name: "Savory Snacks",
                    items: [
                        {
                            id: "cheese-crackers",
                            product: {
                                id: "cheese-crackers",
                                name: "Cheddar Crackers",
                                price: { amount: "2.69", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2aa8adf3?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "roasted-peanuts",
                            product: {
                                id: "roasted-peanuts",
                                name: "Roasted Peanuts",
                                price: { amount: "2.39", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                },
                {
                    id: "store2-drinks",
                    name: "Cold Drinks",
                    items: [
                        {
                            id: "orange-soda",
                            product: {
                                id: "orange-soda",
                                name: "Orange Soda",
                                price: { amount: "1.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "still-water",
                            product: {
                                id: "still-water",
                                name: "Bottled Water",
                                price: { amount: "1.49", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                },
                {
                    id: "store2-sweets",
                    name: "Sweet Treats",
                    items: [
                        {
                            id: "peanut-butter-cups",
                            product: {
                                id: "peanut-butter-cups",
                                name: "Peanut Butter Cups",
                                price: { amount: "2.79", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop"
                            }
                        },
                        {
                            id: "fruit-snacks",
                            product: {
                                id: "fruit-snacks",
                                name: "Fruit Snack Pack",
                                price: { amount: "1.99", currency: "USD" },
                                imageUrl: "https://images.unsplash.com/photo-1614707267537-2b1b7a6f0a4a?w=400&h=400&fit=crop"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};