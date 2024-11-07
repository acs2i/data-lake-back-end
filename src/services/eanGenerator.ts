import EanCounter from '../schemas/eanCounter';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

export class EANGenerator {
    private prefix: string;
    private suffix: string;
    private counterLength: number;
    private barcodeDir: string;
  
    constructor(prefix: string, suffix: string, counterLength: number) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.counterLength = counterLength;
        // Définir le chemin du dossier pour les codes-barres
        this.barcodeDir = path.join(process.cwd(), 'public', 'barcodes');
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(this.barcodeDir)) {
            fs.mkdirSync(this.barcodeDir, { recursive: true });
        }
    }
  
    private calculateChecksum(ean: string): number {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(ean[i]);
            sum += digit * (i % 2 === 0 ? 1 : 3);
        }
        const checksum = (10 - (sum % 10)) % 10;
        return checksum;
    }

    public generateBarcode(ean: string): string {
        const canvas = createCanvas(200, 100);
        
        // Générer le code-barres
        JsBarcode(canvas, ean, {
            format: "EAN13",
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 20,
            margin: 10
        });

        // Créer le nom du fichier
        const fileName = `barcode-${ean}.png`;
        const filePath = path.join(this.barcodeDir, fileName);

        // Convertir le canvas en buffer et sauvegarder l'image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);

        // Retourner le chemin relatif pour accéder à l'image
        return `/barcodes/${fileName}`;
    }
  
    async generateEAN(): Promise<{ ean: string; barcodePath: string }> {
        if (this.prefix.length + this.suffix.length + this.counterLength !== 12) {
            throw new Error("La longueur totale des composants doit être de 12 caractères");
        }
  
        const counterDoc = await EanCounter.findOneAndUpdate(
            { _id: "ean_counter" },
            { $inc: { lastCounter: 1 } },
            { upsert: true, new: true }
        );
  
        if (!counterDoc) {
            throw new Error("Impossible de récupérer le compteur");
        }
  
        const counter = counterDoc.lastCounter.toString().padStart(this.counterLength, "0");
        const eanWithoutChecksum = `${this.prefix}${this.suffix}${counter}`;
        const checksum = this.calculateChecksum(eanWithoutChecksum);
        const ean = `${eanWithoutChecksum}${checksum}`;

        // Générer le code-barres et obtenir le chemin
        const barcodePath = this.generateBarcode(ean);
  
        return {
            ean,
            barcodePath
        };
    }
}