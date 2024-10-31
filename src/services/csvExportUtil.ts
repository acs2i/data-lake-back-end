import fs from "fs";
import path from "path";
import { parse } from "json2csv";

/**
 * Nettoie et formate une valeur pour l'export CSV.
 * @param value - Valeur à nettoyer
 * @param maxLength - Longueur maximale
 * @returns Valeur nettoyée et formatée
 */
function sanitizeValue(value: any, maxLength: number): string {
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

    // Tronquer si nécessaire
    if (cleanValue.length > maxLength) {
        // Si la valeur est entre guillemets, on préserve le format
        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
            cleanValue = `"${cleanValue.slice(1, maxLength-4)}...""`; // -4 pour "..."
        } else {
            cleanValue = `${cleanValue.slice(0, maxLength-3)}...`; // -3 pour ...
        }
    }

    return cleanValue;
}

/**
 * Exporte les données fournies en CSV avec des champs spécifiques et un format amélioré.
 * @param data - Les données à exporter.
 * @param fileName - Le nom du fichier CSV (optionnel).
 * @param fieldsToExport - Tableau de champs spécifiques à exporter.
 * @param maxLength - Longueur maximale des valeurs de cellule.
 * @returns Le chemin du fichier CSV généré.
 */
export async function exportToCSV(
    data: Record<string, any>, 
    fileName: string = "export", 
    fieldsToExport: string[] = [], 
    maxLength: number = 20
): Promise<string> {
    try {
        const exportsDir = "/var/sftp/y2tst/out";

        // Filtrer et nettoyer les données
        const dataToExport = fieldsToExport.length > 0 
            ? fieldsToExport.reduce((acc, field) => {
                if (data[field] !== undefined) {
                    acc[field] = sanitizeValue(data[field], maxLength);
                }
                return acc;
              }, {} as Record<string, any>)
            : Object.keys(data).reduce((acc, key) => {
                acc[key] = sanitizeValue(data[key], maxLength);
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
        const filePath = path.join(exportsDir, `${fileName}.csv`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    } catch (error) {
        console.error("Erreur lors de l'export CSV :", error);
        throw new Error("Échec de l'export CSV");
    }
}

/**
 * Exemple d'utilisation avec différents cas de figure:
 * 
 * const testData = {
 *   name: "John; Doe",
 *   description: "Contains; semicolons and \"quotes\"",
 *   notes: "Multiple\nlines\tand\ttabs",
 *   longText: "This is a very long text that needs to be truncated...",
 * };
 * 
 * await exportToCSV(testData, "test_export", [], 20);
 */