import express, { Request, Response } from "express";
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parse';
import { PRODUCT } from "./sharedProduct";
import ProductModel from "../../schemas/productSchema";

const router = express.Router();

const EXPORT = process.env.IMPORT_PATH || "/var/sftp/y2tst/in";

interface ImageData {
  reference: string;
  img_url: string;
}

async function processCSVFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Log du contenu du fichier pour debug
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('File content:', fileContent);

    const results: ImageData[] = [];
    let rowCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(csv.parse({
        delimiter: ';',
        columns: true,
        skip_empty_lines: true,
        trim: true, // Ajout du trim pour éliminer les espaces
        on_record: (record: any) => {
          // Normalisation des clés
          const normalizedRecord: any = {};
          for (const [key, value] of Object.entries(record)) {
            normalizedRecord[key.toLowerCase().trim()] = value;
          }
          return normalizedRecord;
        }
      }))
      .on('data', (data: any) => {
        rowCount++;
        console.log(`Processing row ${rowCount}:`, data);

        // Vérification des clés disponibles
        console.log('Available keys:', Object.keys(data));

        // Tentative de récupération des données avec différentes possibilités de noms de colonnes
        const reference = data.reference || data.ref || data['référence'];
        const imgUrl = data.img_url || data.url || data.image || data['img_url'];

        if (reference && imgUrl) {
          results.push({
            reference: reference.toString().trim(),
            img_url: imgUrl.toString().trim()
          });
        } else {
          console.warn(`Invalid data format in row ${rowCount}:`, data);
        }
      })
      .on('end', async () => {
        try {
          console.log(`Found ${results.length} valid records to process`);

          for (const record of results) {
            console.log('Processing record:', record);
            try {
              const updateResult = await ProductModel.updateOne(
                { reference: record.reference },
                { $set: { imgPath: record.img_url } }
              );
              console.log('Update result:', updateResult);
            } catch (error) {
              console.error(`Error updating product ${record.reference}:`, error);
            }
          }

          console.log(`Successfully processed ${results.length} records`);
          fs.unlinkSync(filePath);
          console.log(`File deleted: ${filePath}`);
          resolve();
        } catch (error) {
          console.error('Error processing records:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

async function processImageFiles(): Promise<void> {
  try {
    console.log('Checking directory:', EXPORT);
    const files = fs.readdirSync(EXPORT);
    console.log('Found files:', files);

    // Recherche de fichiers avec différentes casses possibles
    const imageFiles = files.filter(file => 
      file.toUpperCase().startsWith('IMG_URL_') && 
      file.toLowerCase().endsWith('.csv')
    );

    console.log('Filtered image files:', imageFiles);

    if (imageFiles.length === 0) {
      console.log('No image files to process');
      return;
    }

    for (const file of imageFiles) {
      console.log('Processing file:', file);
      const filePath = path.join(EXPORT, file);
      await processCSVFile(filePath);
    }

    console.log('Image processing completed successfully');
  } catch (error) {
    console.error('Error in image processing:', error);
  }
}

// Route pour le traitement manuel des images
router.post(PRODUCT + '/process-images', async (req: Request, res: Response) => {
  try {
    await processImageFiles();
    res.status(200).json({ message: 'Image processing completed successfully' });
  } catch (error) {
    console.error('Error processing image files:', error);
    res.status(500).json({ error: 'Failed to process image files' });
  }
});

// Initialisation et démarrage du cron
console.log('Initializing image processing...');
processImageFiles();

cron.schedule('*/59 * * * *', async () => {
  console.log('Running scheduled image processing...');
  await processImageFiles();
});

export default router;