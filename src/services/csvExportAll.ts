import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

const BATCH_SIZE = 10000; // Augmenté pour de meilleures performances
const BUFFER_SIZE = 256 * 1024; // Buffer plus grand pour de meilleures performances d'écriture

class FastCSVTransform extends Transform {
    private buffer: string[] = [];
    private readonly fields: string[];
    private isFirstChunk = true;
    private readonly delimiter: string;
    private processedRows = 0;

    constructor(fields: string[]) {
        super({ objectMode: true });
        this.fields = fields;
        this.delimiter = ';';
    }

    _transform(chunk: Record<string, any>, encoding: string, callback: Function) {
        try {
            if (this.isFirstChunk) {
                this.buffer.push(this.fields.join(this.delimiter));
                this.isFirstChunk = false;
            }

            const line = this.fields.map(field => {
                const value = chunk[field];
                return this.formatValue(value);
            }).join(this.delimiter);

            this.buffer.push(line);
            this.processedRows++;

            if (this.buffer.length >= BATCH_SIZE) {
                this.flushBuffer();
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }

    _flush(callback: Function) {
        try {
            this.flushBuffer();
            callback();
        } catch (error) {
            callback(error);
        }
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = String(value)
            .replace(/\r?\n|\r/g, ' ')
            .replace(/\t/g, ' ')
            .trim();

        return stringValue.includes(';') 
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
    }

    private flushBuffer(): void {
        if (this.buffer.length > 0) {
            const data = this.buffer.join('\n') + '\n';
            this.push(data);
            this.buffer = [];
        }
    }

    public getProcessedRows(): number {
        return this.processedRows;
    }
}

// Worker thread pour le traitement des données
if (!isMainThread) {
    const { data, fields, filePath } = workerData;
    
    const writeStream = fs.createWriteStream(filePath, {
        flags: 'w',
        encoding: 'utf8' as BufferEncoding,
        highWaterMark: BUFFER_SIZE,
    });

    const transformStream = new FastCSVTransform(fields);
    const readStream = new Transform({
        objectMode: true,
        highWaterMark: BATCH_SIZE,
        transform(chunk, encoding, callback) {
            callback(null, chunk);
        }
    });

    (async () => {
        try {
            // Remplir le stream de lecture de manière optimisée
            for (let i = 0; i < data.length; i++) {
                if (!readStream.push(data[i])) {
                    await new Promise(resolve => readStream.once('drain', resolve));
                }
            }
            readStream.push(null);

            // Exécuter le pipeline
            await pipeline(readStream, transformStream, writeStream);
            
            parentPort?.postMessage({ success: true, rowsProcessed: transformStream.getProcessedRows() });
        } catch (error) {
            parentPort?.postMessage({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    })();
}

// Fonction principale d'export
export async function exportToCSV(
    data: Record<string, any>[],
    fileName: string = "export",
    fields: string[] = []
): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const exportsDir = "/var/sftp/y2tst/out";
            const filePath = path.join(exportsDir, fileName);

            // Créer un worker pour le traitement asynchrone
            const worker = new Worker(__filename, {
                workerData: { data, fields, filePath }
            });

            worker.on('message', (result) => {
                if (result.success) {
                    console.log(`CSV Export completed: ${result.rowsProcessed} rows processed`);
                    resolve(filePath);
                } else {
                    reject(new Error(result.error));
                }
            });

            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error("CSV Export error:", errorMessage);
            reject(new Error(`CSV Export failed: ${errorMessage}`));
        }
    });
}