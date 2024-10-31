import { MongoClient, Collection } from 'mongodb';

interface EANCounter {
  _id: string;
  lastCounter: number;
}

interface EANConfig {
  prefix: string;  // Préfixe EAN (habituellement un code pays)
  suffix: string;  // Talon (code entreprise)
  counterLength: number;  // Longueur du compteur
}

class EANGenerator {
  private collection: Collection<EANCounter>;
  private config: EANConfig;

  constructor(collection: Collection<EANCounter>, config: EANConfig) {
    this.collection = collection;
    this.config = config;
  }

  /**
   * Calcule la clé de contrôle EAN-13
   * @param ean Les 12 premiers chiffres de l'EAN
   * @returns La clé de contrôle (13ème chiffre)
   */
  private calculateChecksum(ean: string): number {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(ean[i]);
      sum += digit * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum;
  }

  /**
   * Génère le prochain numéro EAN-13 unique
   * @returns Le code EAN-13 complet
   */
  async generateEAN(): Promise<string> {
    // Vérifie que la configuration est valide
    const totalFixedLength = this.config.prefix.length + this.config.suffix.length;
    if (totalFixedLength + this.config.counterLength !== 12) {
      throw new Error('La longueur totale des composants doit être de 12 caractères');
    }

    // Récupère et incrémente le compteur
    const counterDoc = await this.collection.findOneAndUpdate(
      { _id: 'ean_counter' },
      { $inc: { lastCounter: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!counterDoc) {
      throw new Error('Impossible de récupérer le compteur');
    }

    // Formate le compteur avec les zéros initiaux nécessaires
    const counter = counterDoc.lastCounter.toString().padStart(this.config.counterLength, '0');

    // Construit les 12 premiers chiffres de l'EAN
    const eanWithoutChecksum = `${this.config.prefix}${this.config.suffix}${counter}`;

    // Calcule et ajoute la clé de contrôle
    const checksum = this.calculateChecksum(eanWithoutChecksum);

    // Retourne l'EAN-13 complet
    return `${eanWithoutChecksum}${checksum}`;
  }
}

// Exemple d'utilisation
async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('your_database');
    const collection = database.collection<EANCounter>('ean_counters');

    const eanConfig: EANConfig = {
      prefix: '300',    // Exemple: préfixe France
      suffix: '12345',  // Exemple: code entreprise
      counterLength: 4  // Longueur du compteur
    };

    const generator = new EANGenerator(collection, eanConfig);
    const ean = await generator.generateEAN();
    console.log('EAN-13 généré:', ean);

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await client.close();
  }
}

// Exécution
main().catch(console.error);