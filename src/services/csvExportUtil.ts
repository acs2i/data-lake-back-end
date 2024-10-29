import fs from "fs";
import path from "path";
import { parse } from "json2csv";

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
        const exportsDir = path.resolve(__dirname, "../../exports");

        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
        }

        // Filtrer et tronquer les données pour un meilleur rendu
        const dataToExport = fieldsToExport.length > 0 
            ? fieldsToExport.reduce((acc, field) => {
                if (data[field] !== undefined) {
                    // Tronque la valeur si elle dépasse maxLength
                    const value = data[field].toString();
                    acc[field] = value.length > maxLength ? value.slice(0, maxLength) + "..." : value;
                }
                return acc;
              }, {} as Record<string, any>)
            : Object.keys(data).reduce((acc, key) => {
                const value = data[key].toString();
                acc[key] = value.length > maxLength ? value.slice(0, maxLength) + "..." : value;
                return acc;
              }, {} as Record<string, any>);

        const opts = { 
            fields: fieldsToExport.length > 0 ? fieldsToExport : Object.keys(data),
            delimiter: ";", // Définit le séparateur de colonnes comme point-virgule
            quote: '"'      // Ajoute les guillemets uniquement si nécessaire
        };
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
