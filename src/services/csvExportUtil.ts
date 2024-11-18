import fs from "fs";
import path from "path";
import { parse } from "json2csv";

/**
 * Nettoie et formate une valeur pour l'export CSV.
 * @param value - Valeur à nettoyer
 * @returns Valeur nettoyée et formatée
 */
function sanitizeValue(value: any): string {
    if (value === null || value === undefined) {
        return "";
    }

    // Conversion en string et nettoyage des sauts de ligne
    let cleanValue = value.toString()
        .replace(/\r?\n|\r/g, ' ') // Remplace les sauts de ligne par des espaces
        .replace(/\t/g, ' ')       // Remplace les tabulations par des espaces
        .trim();                   // Enlève les espaces au début et à la fin

    // Si la valeur contient un point-virgule, on l'entoure de guillemets
    if (cleanValue.includes(';')) {
        cleanValue = `"${cleanValue.replace(/"/g, '""')}"`;  // Double les guillemets existants
    }

    return cleanValue;
}

/**
 * Exporte les données fournies en CSV avec des champs spécifiques.
 * @param data - Les données à exporter.
 * @param fileName - Le nom du fichier CSV (optionnel).
 * @param fieldsToExport - Tableau de champs spécifiques à exporter.
 * @returns Le chemin du fichier CSV généré.
 */
export async function exportToCSV(
    data: Record<string, any>, 
    fileName: string = "export", 
    fieldsToExport: string[] = []
): Promise<string> {
    try {
        // const exportsDir = "/var/sftp/y2tst/out";
        const exportsDir = "./";

        // Filtrer et nettoyer les données
        const dataToExport = fieldsToExport.length > 0 
            ? fieldsToExport.reduce((acc, field) => {
                if (data[field] !== undefined) {
                    acc[field] = sanitizeValue(data[field]);
                }
                return acc;
              }, {} as Record<string, any>)
            : Object.keys(data).reduce((acc, key) => {
                acc[key] = sanitizeValue(data[key]);
                return acc;
              }, {} as Record<string, any>);

        const opts = { 
            fields: fieldsToExport.length > 0 ? fieldsToExport : Object.keys(data),
            delimiter: ";",
            quote: '"',
            escapedQuote: '""', // Double les guillemets pour échapper
            header: true,
        };

        // Générer le CSV
        let csv = parse(dataToExport, opts);

        // Supprimer les guillemets dans le CSV généré
        csv = csv.replace(/"/g, "");

        // Utiliser un nom unique avec horodatage pour éviter les conflits
        const filePath = path.join(exportsDir, `${fileName}`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    } catch (error) {
        console.error("Erreur lors de l'export CSV :", error);
        throw new Error("Échec de l'export CSV");
    }
}

/**
 * Exemple d'utilisation:
 * 
 * const testData = {
 *   name: "John; Doe",
 *   description: "Contains; semicolons and \"quotes\"",
 *   notes: "Multiple\nlines\tand\ttabs",
 *   longText: "This is a very long text that will not be truncated anymore",
 * };
 * 
 * await exportToCSV(testData, "test_export");
 */