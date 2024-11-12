import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import path from 'path';

const BATCH_SIZE = 5000;
const BUFFER_SIZE = 64 * 1024;

class FastCSVTransform extends Transform {
    private buffer: string[] = [];
    private readonly fields: string[];
    private isFirstChunk = true;
    private readonly delimiter: string;

    constructor(fields: string[]) {
        super({ objectMode: true });
        this.fields = fields;
        this.delimiter = ';';
    }

    _transform(chunk: Record<string, any>, encoding: string, callback: Function) {
        if (this.isFirstChunk) {
            this.buffer.push(this.fields.join(this.delimiter));
            this.isFirstChunk = false;
        }

        const line = this.fields.map(field => {
            const value = chunk[field];
            return this.formatValue(value);
        }).join(this.delimiter);

        this.buffer.push(line);

        if (this.buffer.length >= BATCH_SIZE) {
            this.flushBuffer();
        }

        callback();
    }

    _flush(callback: Function) {
        this.flushBuffer();
        callback();
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
            this.push(this.buffer.join('\n') + '\n');
            this.buffer = [];
        }
    }
}

export async function exportToCSV(
    data: Record<string, any>[],
    fileName: string = "export",
    fields: string[] = []
): Promise<string> {
    try {
        const exportsDir = "/var/sftp/y2tst/out";
        const filePath = path.join(exportsDir, fileName);

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

        setImmediate(async () => {
            for (let i = 0; i < data.length; i++) {
                if (!readStream.push(data[i])) {
                    await new Promise(resolve => readStream.once('drain', resolve));
                }
            }
            readStream.push(null);
        });

        await pipeline(
            readStream,
            transformStream,
            writeStream
        ).catch((error: Error) => {
            throw new Error(`Pipeline failed: ${error.message}`);
        });

        return filePath;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("CSV Export error:", errorMessage);
        throw new Error(`CSV Export failed: ${errorMessage}`);
    }
}

// Types d'export
export interface CSVExportOptions {
    fileName: string;
    fields: string[];
    batchSize?: number;
    bufferSize?: number;
}