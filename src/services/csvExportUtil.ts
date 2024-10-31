import fs from "fs";
import path from "path";
import { parse } from "json2csv";

/**
 * Nettoie et formate une valeur pour l'export CSV en préservant les caractères spéciaux.
 * @param value - Valeur à nettoyer
 * @param maxLength - Longueur maximale (non utilisée pour préserver la chaîne complète)
 * @returns Valeur formatée
 */
function sanitizeValue(value: any): string {
    if (value === null || value === undefined) {
        return "";
    }

    // Conversion en string sans modification des caractères spéciaux
    let cleanValue = value.toString();

    // Si la valeur contient un point-virgule, on l'entoure de guillemets
    const needsQuotes = cleanValue.includes(';');
    
    // Ajouter les guillemets si nécessaire
    if (needsQuotes) {
        cleanValue = `"${cleanValue}"`;
    }

    return cleanValue;
}

/**
 * Exporte les données fournies en CSV avec des champs spécifiques et un format amélioré.
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
        const exportsDir = "/var/sftp/y2tst/out";

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
            escapedQuote: '""',
            header: true,
        };

        // Générer le CSV
        let csv = parse(dataToExport, opts);

        // Utiliser un nom unique avec horodatage pour éviter les conflits
        const filePath = path.join(exportsDir, `${fileName}.csv`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    } catch (error) {
        console.error("Erreur lors de l'export CSV :", error);
        throw new Error("Échec de l'export CSV");
    }
}