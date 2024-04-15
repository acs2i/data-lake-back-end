import { Document } from "mongodb";
import { Schema } from "mongoose"



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

interface ImageData {
    src: string         // location of image
}

interface PriceData {
    frn: string, // this connects to the k in the supplier collection,
    priceId:  Schema.Types.ObjectId | string, // this connects to the Object Id in the price collection, ObjectId is for schema, string is for result
    date: Date,
    // price: number        // Kept in the price table
}

interface UVCProperty {
    code: string,
    price: number
}

export interface UVC {
    k: string,
    color: string[],
    code: string,
    // color: string,
    // size: string,
    size: string[],

    eans: string[],
    images: ImageData[],
    uvcs: UVCProperty[],
    prices: number[],
    // prices: PriceData | Document[] // PriceData for schema, Document[] is for request
    _id: number    // for end user use 
}
