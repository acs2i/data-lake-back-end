import fs from 'fs';
import XLSX, { utils } from 'xlsx'
import ExcelJS from 'exceljs';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import { v4 } from 'uuid';
import express, { Request, Response } from "express";
import { fileURLToPath } from 'url';
const router = express.Router();
import multer from 'multer'; // Multer for file uploads
import path from 'path';

dotenv.config();

// MongoDB connection URL and database name
const url = process.env.REMOTE_DEV_DB_URI; // Replace with your MongoDB connection string
const dbName = process.env.MONGO_DB_NAME; // Replace with your database name
// const collectionName = process.env.COLLECTION_NAME; // Replace with your collection name

// Function to fetch data from MongoDB
async function fetchDataFromMongoDB(collectionName: string) {
  const client = new MongoClient(url as string);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName as string);
    
    // Fetch all documents from the collection
    const data = await collection.find({}).toArray();
    
    return data;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}


async function jsonToCsv(jsonData: any): Promise<ExcelJS.Buffer> {
    // Treat the object id
    for (const data of jsonData) {
      if (data._id) data._id = data._id.toString();
      if (data.creator_id) data.creator_id = data.creator_id.toString();
    }
  
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
  
    // Convert JSON data to sheet data
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  
    // Add JSON data to the sheet, starting from row 3
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cellValue = worksheet[cellRef] ? worksheet[cellRef].v : '';
  
        // Add cell values starting from row 3, can make it larger
        sheet.getCell(R + 5, C + 1).value = cellValue;
      }
    }
  
    return await workbook.csv.writeBuffer();
    // Write the workbook to a file
    // return await workbook.xlsx.writeFile("dl");
    console.log('Data has been written to Excel file successfully!');
  }

async function Extract(collectionName: string) {
    try {
  
      const data = await fetchDataFromMongoDB(collectionName);
      
      if (data) {
   
        return await jsonToCsv(data);
        
      }
    } catch (err) {
      console.error("Extract error: ", err);
    }
  }
  

// async function Extract(outputFilePath, imagePath) {
//   try {
//     if (!outputFilePath) {
//       throw new Error("Extract: The outputFilePath was falsy: " + outputFilePath);
//     }
//     const data = await fetchDataFromMongoDB();
    
//     if (data) {
//       if (outputFilePath.endsWith('.csv')) {
//         jsonToCsv(data, outputFilePath);
//       } else if (imagePath) {
//         await jsonToXlsxWithPhoto(data, outputFilePath, imagePath);
//       } else {
//         jsonToXlsx(data, outputFilePath);
//       }
//     }
//   } catch (err) {
//     console.error("Extract error: ", err);
//     return false;
//   }
// }




async function ImportCsv(csvFilePath: string, collectionName: string) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const workbook = XLSX.read(csvData, { type: 'string' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
    const import_id = v4();
    const documents = jsonData.map((data: any) => {
    //   data["import_type"] = "import";
    //   data["import_id"] = import_id;
    //   data["file_name"] = csvFilePath;
  
      delete data._id;
      if (!data["version"]) data["version"] = 1;
      else data["version"] += 1;
  
      return data;
    });
  
    const client = new MongoClient(url as string);
    await client.connect();
    
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      await collection.insertMany(documents);
      console.log("Data inserted successfully");
    } catch (err) {
      console.error('Error inserting data:', err);
    } finally {
      await client.close();
    }
  }
  

// ImportCsv("./csvReceivedFile.csv");

// Extract("./outputhere.xlsx", "./french-flag.jpg");

router.get("/csv", async (req: Request, res: Response) => {
    try {
      // Extract the data and convert it to CSV format
      const {collection} = req.query;
      const file: ExcelJS.Buffer = await Extract(collection as string) as ExcelJS.Buffer;
  
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
  
      // Send the buffer (CSV) as binary
      res.send(file);
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('Error generating CSV file');
    }
});

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, './uploads'); // Store files in the uploads folder
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
const upload = multer({ storage });

router.post("/csv", upload.single('file'), async (req: Request & any , res: Response) => {
    try {

    const {collection} = req.body;

    if(!collection) {
        throw new Error("Collcetion wasn't defined")
    }

    console.log("collection, " , collection)

    // Check if a file was uploaded
    if (!req.file) {
    return res.status(400).send('No file uploaded');
    }

    // Get the uploaded file's path
    const filePath = req.file.path;

    // Get the file extension to check for CSV or Excel file
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt === '.csv' || fileExt === '.xlsx') {
    // Use ImportCsv for processing the CSV file
        
    await ImportCsv(filePath, collection as string);

    // Respond with success
    return res.status(200).send('File processed and data imported successfully');
    } else {
    return res.status(400).send('Invalid file type. Only CSV and XLSX files are accepted.');
    }
    } catch (err) {
      console.error('Error importing CSV/XLSX file:', err);
      return res.status(500).send('Error importing file');
    }
  });
  

export default router;