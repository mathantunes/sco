import type { Price } from "./price.js";

export type Product = {
    id: string;
    name: string;
    price: Price;
    imageUrl: string;
}