import EanCounter from '../schemas/eanCounter';

export class EANGenerator {
    private prefix: string;
    private suffix: string;
    private counterLength: number;
  
    constructor(prefix: string, suffix: string, counterLength: number) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.counterLength = counterLength;
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
  
    async generateEAN(): Promise<string> {
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
  
        return `${eanWithoutChecksum}${checksum}`;
    }
}