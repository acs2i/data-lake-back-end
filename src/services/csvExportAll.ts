import { parse } from "json2csv";
import fs from "fs";
import path from "path";

// Fonction modifiée pour gérer un tableau d'objets
export async function exportToCSV(
    data: Record<string, any>[], 
    fileName: string = "export", 
    fieldsToExport: string[] = []
): Promise<string> {
    try {
        // const exportsDir = "/var/sftp/y2tst/out";
        const exportsDir = "/var/sftp/y2tst/out";

        // Transformer et nettoyer chaque objet du tableau
        const cleanedData = data.map(item => {
            return fieldsToExport.reduce((acc, field) => {
                acc[field] = sanitizeValue(item[field]);
                return acc;
            }, {} as Record<string, any>);
        });

        const opts = { 
            fields: fieldsToExport,
            delimiter: ";",
            quote: '"',
            escapedQuote: '""',
            header: true,
        };

        // Générer le CSV avec le tableau d'objets
        let csv = parse(cleanedData, opts);

        // Supprimer les guillemets dans le CSV généré
        csv = csv.replace(/"/g, "");

        const filePath = path.join(exportsDir, `${fileName}`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    } catch (error) {
        console.error("Erreur lors de l'export CSV :", error);
        throw new Error("Échec de l'export CSV");
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