import { Document } from "mongodb";

interface ReferenceHistory {
    k: string,
    v: string,
    family: string,
    colors: string[],
    size: string[],
    prices:  Document[],
    updated: Date
}

export interface ResultReference {
    _id: number,
    colors:  string[],
    sizes: string[],
    prices: Document[],
    k: string,
    v: string,
    history: ReferenceHistory[]
}