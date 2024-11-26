import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ConditionModel from '../../schemas/conditionsSchema';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const app = express();

// Augmenter la limite de taille des requêtes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Dans votre route de upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier invalide. Seuls les PDF sont autorisés.'));
    }
  }
});

// Route for file upload
router.put('/condition/:id/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const conditionId = req.params.id;
    const filePath = `/uploads/${req.file.filename}`;

    // Update condition document with file path
    const updatedCondition = await ConditionModel.findByIdAndUpdate(
      conditionId,
      { $push: { filePath: filePath } },
      { new: true }
    );

    if (!updatedCondition) {
      // If file was uploaded but condition update failed, clean up the file
      fs.unlinkSync(path.join(__dirname, '../public', filePath));
      return res.status(404).json({ error: 'Condition not found' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: filePath,
      condition: updatedCondition
    });

  } catch (error) {
    console.error('File upload error:', error);
    if (req.file) {
      // Clean up uploaded file if there was an error
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'File upload failed' });
  }
});

export default router;