import fs from "fs";
import path from "path";
import { parse } from "json2csv";

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

export async function exportToCSVArray(
    data: Record<string, any>[],
    fileName: string = "export.csv",
    fieldsToExport: string[] = []
  ): Promise<string> {
    try {
      const exportsDir = path.resolve("./exports");
  
      // Vérifie que le répertoire existe, sinon le crée
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }
  
      const dataToExport = data.map((item) => {
        const sanitizedItem: Record<string, any> = {};
        (fieldsToExport.length > 0 ? fieldsToExport : Object.keys(item)).forEach((field) => {
          sanitizedItem[field] = item[field] !== undefined ? item[field].toString().replace(/[\r\n\t]/g, " ").trim() : "";
        });
        return sanitizedItem;
      });
  
      const opts = {
        fields: fieldsToExport.length > 0 ? fieldsToExport : Object.keys(data[0] || {}),
        delimiter: ";",
        quote: '"',
        escapedQuote: '""',
        header: true,
      };
  
      const csv = parse(dataToExport, opts).replace(/"/g, "");
      const filePath = path.join(exportsDir, fileName);
      fs.writeFileSync(filePath, csv);
  
      return filePath;
    } catch (error) {
      console.error("Erreur lors de l'export CSV :", error);
      throw new Error("Échec de l'export CSV");
    }
  }