import { Price } from "./price";

export type Product = {
    id: string;
    name: string;
    price: Price;
    imageUrl: string;
}