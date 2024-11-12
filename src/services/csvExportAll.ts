import { parse } from "json2csv";
import fs from "fs";
import path from "path";
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

const BATCH_SIZE = 1000;

// Transformer pour traiter les données par lots
class BatchTransformer extends Transform {
    private batch: Record<string, any>[] = [];
    private readonly fieldsToExport: string[];
    private isFirstBatch = true;

    constructor(fieldsToExport: string[]) {
        super({ objectMode: true });
        this.fieldsToExport = fieldsToExport;
    }

    _transform(chunk: Record<string, any>, encoding: string, callback: Function) {
        this.batch.push(chunk);

        if (this.batch.length >= BATCH_SIZE) {
            this.processBatch();
        }

        callback();
    }

    _flush(callback: Function) {
        if (this.batch.length > 0) {
            this.processBatch();
        }
        callback();
    }

    private processBatch() {
        const cleanedData = this.batch.map(item => {
            return this.fieldsToExport.reduce((acc, field) => {
                acc[field] = sanitizeValue(item[field]);
                return acc;
            }, {} as Record<string, any>);
        });

        const opts = {
            fields: this.fieldsToExport,
            delimiter: ";",
            quote: '"',
            escapedQuote: '""',
            header: this.isFirstBatch,
        };

        let csv = parse(cleanedData, opts);
        if (!this.isFirstBatch) {
            // Supprimer l'en-tête pour les lots suivants
            csv = csv.substring(csv.indexOf('\n') + 1);
        }

        // Supprimer les guillemets
        csv = csv.replace(/"/g, "");

        this.push(csv);
        this.batch = [];
        this.isFirstBatch = false;
    }
}

function sanitizeValue(value: any): string {
    if (value === null || value === undefined) {
        return "";
    }

    let cleanValue = value.toString()
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\t/g, ' ')
        .trim();

    if (cleanValue.includes(';')) {
        cleanValue = `"${cleanValue.replace(/"/g, '""')}"`;
    }

    return cleanValue;
}

// Export asynchrone avec streaming
export async function exportToCSV(
    data: Record<string, any>[],
    fileName: string = "export",
    fieldsToExport: string[] = []
): Promise<string> {
    try {
        const exportsDir = "/var/sftp/y2tst/out";
        const filePath = path.join(exportsDir, `${fileName}`);

        // Créer le flux de lecture à partir du tableau
        const readStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                callback(null, chunk);
            }
        });

        // Remplir le flux de lecture
        data.forEach(item => readStream.push(item));
        readStream.push(null); // Signaler la fin des données

        // Créer le flux d'écriture
        const writeStream = fs.createWriteStream(filePath);

        // Utiliser pipeline pour gérer le streaming de manière fiable
        await pipeline(
            readStream,
            new BatchTransformer(fieldsToExport),
            writeStream
        );

        return filePath;
    } catch (error) {
        console.error("Erreur lors de l'export CSV :", error);
        throw new Error("Échec de l'export CSV");
    }
}