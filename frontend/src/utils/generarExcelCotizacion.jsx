// src/utils/generarExcelCotizacion.jsx 
// Importamos las librerías necesarias
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Función para generar el archivo de Excel con los datos de una cotización
export const generarExcelCotizacion = async (cotizacionData, logoBase64) => {
    try {
        // Creamos un nuevo libro de trabajo de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotización');

        // 1. Desactivamos las líneas de cuadrícula, barra de fórmulas y encabezados
        worksheet.views = [{
            showGridLines: false,
            showFormulas: false,
            showRowColHeaders: false
        }];

         // --- AJUSTE DE ALTURA DE FILAS 
        worksheet.getRow(1).height = 31.5;
        worksheet.getRow(2).height = 31.5;
        worksheet.getRow(3).height = 31.5;

        // Estilos personalizados
        const styles = {
            header: {
                font: { bold: true, size: 12, color: { argb: 'FF000000' } },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            input: {
                font: { bold: true, color: { argb: 'FF333333' } },
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            output: {
                font: { bold: true, color: { argb: 'FF333333' } },
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            cellContent: {
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            money: {
                alignment: { vertical: 'middle', horizontal: 'center' },
                // numFmt: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)', // Se omite el formato de moneda en el código final para mantenerlo simple como pediste
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            totalLabel: { // Estilo para las etiquetas de los totales al final de la tabla
                font: { bold: true, color: { argb: 'FF000000' } },
                alignment: { horizontal: 'right', vertical: 'middle' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            },
            yellowCell: { // Estilo para las celdas de observaciones
                font: { bold: true, color: { argb: 'FF000000' } },
                alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }, // Amarillo
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            }
        };

        // 2. Definimos las columnas y sus anchos
        worksheet.columns = [
            { key: 'numero', width: 10 },
            { key: 'concepto', width: 25 },
            { key: 'descripcion', width: 40 },
            { key: 'unidad_medida', width: 15 },
            { key: 'cantidad', width: 10 },
            { key: 'precio', width: 15 },
            { key: 'total', width: 15 }
        ];

        // 3. Escribimos los datos estáticos y aplicamos estilos
        const { cotizacion, productos, cliente } = cotizacionData;
        
        // Celdas de Totales (reubicadas en Fila 1 y 2 en el original, ahora eliminadas de ahí)
        const totalEstimado = cotizacion.total_estimado;
        const totalConImpuestos = (totalEstimado * 1.16).toFixed(2); // Calculo de IVA
        const impuestos = (totalConImpuestos - totalEstimado).toFixed(2);

 // --- INSERCIÓN DE IMAGEN (A1:B3) ---
        if (logoBase64) {
            // Añadimos la imagen al libro
            const imageId = workbook.addImage({
                base64: logoBase64,
                extension: 'png',
            });

            // Combinamos las celdas para el logo
            worksheet.mergeCells('A1:B3');

            // Colocamos la imagen sobre las celdas combinadas
            // tl: Top-Left (Columna 0, Fila 0) -> A1
            // br: Bottom-Right (Columna 2, Fila 3) -> Final de B3 (el inicio de C4)
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                br: { col: 2, row: 3 }, 
                editAs: 'oneCell' // Ayuda a que se mantenga dentro
            });
        }

        // Fila 1 - Título "Cotización" (Cambiado de B1:C2 a C1:D2)
        worksheet.mergeCells('C1:D2');
        const titleCell = worksheet.getCell('C1');
        titleCell.value = 'Cotización';
        titleCell.font = { bold: true, size: 24 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Fila 1 a 3 - Datos del proveedor (E1:G3)
        worksheet.mergeCells('E1:G3');
        const supplierInfo = `JORGE GUERRERO HERNANDEZ\nRFC: GUHJ880818522\nCalle: Margaritas # 67, Col: Rancho Alegre 1 CP. 96558\nCoatzacoalcos, Veracruz; México\nTel 1640718 Cel. 9211021874, E-Mail: jorgeguerrerohernandez@gmail.com`;
        const supplierCell = worksheet.getCell('E1');
        supplierCell.value = supplierInfo;
        supplierCell.font = { size: 10 };
        supplierCell.alignment = { horizontal: 'right', vertical: 'top', wrapText: true };

        // Fila 4 - Cliente
        worksheet.getCell('D4').value = 'Cliente:';
        worksheet.getCell('D4').style = styles.header;
        worksheet.mergeCells('E4:G4'); // Ampliado para cubrir más espacio
        const clientCell = worksheet.getCell('E4');
        clientCell.value = cliente.nombre;
        clientCell.style = styles.input;
        clientCell.alignment = { horizontal: 'left', vertical: 'middle' };

        
        // Fila 5 - Encabezados de la tabla dinámica
        worksheet.getCell('A5').value = 'Numero';
        worksheet.getCell('A5').style = styles.header;
        worksheet.getCell('B5').value = 'Concepto';
        worksheet.getCell('B5').style = { ...styles.header, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } } };
        worksheet.getCell('C5').value = 'Descripcion';
        worksheet.getCell('C5').style = { ...styles.header, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } } };
        worksheet.getCell('D5').value = 'Unidad de medida';
        worksheet.getCell('D5').style = styles.header;
        worksheet.getCell('E5').value = 'Cantidad';
        worksheet.getCell('E5').style = styles.header;
        worksheet.getCell('F5').value = 'Precio';
        worksheet.getCell('F5').style = styles.header;
        worksheet.getCell('G5').value = 'Total';
        worksheet.getCell('G5').style = styles.header;

        // 4. Agregamos las filas de datos dinámicos y aplicamos estilos
        let rowIndex = 6;
        productos.forEach((p, index) => {
            worksheet.getCell(`A${rowIndex}`).value = index + 1;
            worksheet.getCell(`A${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`B${rowIndex}`).value = p.nombre_producto; 
            worksheet.getCell(`B${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`C${rowIndex}`).value = p.descripcion; 
            worksheet.getCell(`C${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`D${rowIndex}`).value = p.unidad_medida;
            worksheet.getCell(`D${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`E${rowIndex}`).value = p.cantidad;
            worksheet.getCell(`E${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`F${rowIndex}`).value = p.precio_unitario_con_ganancia;
            worksheet.getCell(`F${rowIndex}`).style = styles.cellContent; // Aplicamos cellContent en lugar de money

            worksheet.getCell(`G${rowIndex}`).value = p.subtotal_con_ganancia;
            worksheet.getCell(`G${rowIndex}`).style = styles.cellContent; // Aplicamos cellContent en lugar de money

            rowIndex++;
        });

        // 4.1. Agregamos los totales al final de la lista (columna G)
        const totalRowIndex = rowIndex; // Fila inmediatamente después del último producto

        // Antes de impuestos (Subtotal)
        worksheet.getCell(`F${totalRowIndex}`).value = 'Antes de impuestos:';
        worksheet.getCell(`F${totalRowIndex}`).style = styles.totalLabel;
        worksheet.getCell(`G${totalRowIndex}`).value = totalEstimado;
        worksheet.getCell(`G${totalRowIndex}`).style = styles.cellContent;

        // Impuestos (IVA)
        worksheet.getCell(`F${totalRowIndex + 1}`).value = 'Impuestos (16% IVA):';
        worksheet.getCell(`F${totalRowIndex + 1}`).style = styles.totalLabel;
        worksheet.getCell(`G${totalRowIndex + 1}`).value = impuestos;
        worksheet.getCell(`G${totalRowIndex + 1}`).style = styles.cellContent;

        // Después de impuestos (Total)
        worksheet.getCell(`F${totalRowIndex + 2}`).value = 'Después de impuestos:';
        worksheet.getCell(`F${totalRowIndex + 2}`).style = styles.totalLabel;
        worksheet.getCell(`G${totalRowIndex + 2}`).value = totalConImpuestos;
        worksheet.getCell(`G${totalRowIndex + 2}`).style = styles.cellContent;


        // 4.2. Agregamos las observaciones (3 celdas abajo del final de la tabla de conceptos)
        const obsRowIndex = totalRowIndex + 5; // Empezar 3 filas después de los totales (totalRowIndex + 2)

        const observations = [
            'OBSERVACIONES:',
            'MATERIAL SUJETO A DISPONIBILIDAD SPV.',
            'SE COTIZA GASTOS DE ENVIO',
            'VIGENCIA DE LA COTIZACION: De 3 Días habiles.'
        ];

        // Usamos la columna B
        observations.forEach((obs, index) => {
            worksheet.getCell(`B${obsRowIndex + index}`).value = obs;
            worksheet.getCell(`B${obsRowIndex + index}`).style = styles.yellowCell;
            worksheet.getCell(`B${obsRowIndex + index}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        });


        // 5. Generamos el archivo y lo descargamos
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `cotizacion_${cotizacion.id_cotizacion}.xlsx`);

    } catch (error) {
        console.error("Error al generar el Excel:", error);
    }
};