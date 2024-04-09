import { Document } from "mongodb";

export interface ResultReference {
    _id: number,
    colors:  string[],
    sizes: string[],
    prices: Document[]
}