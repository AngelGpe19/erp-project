//src/utils/generarExcelCotizacion.jsx 
// Importamos las librerías necesarias
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Función para generar el archivo de Excel con los datos de una cotización
export const generarExcelCotizacion = async (cotizacionData) => {
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
                numFmt: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
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
        // Aquí usamos la data de la cotización
        const { cotizacion, productos, cliente } = cotizacionData;

        // Fila 1 - Título "Cotización"
        worksheet.mergeCells('B1:C2');
        const titleCell = worksheet.getCell('B1');
        titleCell.value = 'Cotización';
        titleCell.font = { bold: true, size: 24 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Fila 1 y 2 - Totales
        worksheet.getCell('D1').value = 'Antes de impuestos';
        worksheet.getCell('D1').style = styles.output;
        worksheet.getCell('E1').value = cotizacion.total_estimado;
        worksheet.getCell('E1').style = { ...styles.output, numFmt: '$#,##0.00' };

        worksheet.getCell('D2').value = 'Despues de impuestos';
        worksheet.getCell('D2').style = styles.output;
        worksheet.getCell('E2').value = (cotizacion.total_estimado * 1.16).toFixed(2); // Calculo de IVA
        worksheet.getCell('E2').style = { ...styles.output, numFmt: '$#,##0.00' };

        // Fila 4 - Cliente
        worksheet.getCell('D4').value = 'Cliente:';
        worksheet.getCell('D4').style = styles.header;
        worksheet.mergeCells('E4:F4');
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

            worksheet.getCell(`B${rowIndex}`).value = p.nombre_producto; // Asegúrate de que tu API devuelve este campo
            worksheet.getCell(`B${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`C${rowIndex}`).value = p.descripcion; // Asegúrate de que tu API devuelve este campo
            worksheet.getCell(`C${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`D${rowIndex}`).value = p.unidad_medida;
            worksheet.getCell(`D${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`E${rowIndex}`).value = p.cantidad;
            worksheet.getCell(`E${rowIndex}`).style = styles.cellContent;

            worksheet.getCell(`F${rowIndex}`).value = p.precio_unitario_con_ganancia;
            worksheet.getCell(`F${rowIndex}`).style = styles.money;

            worksheet.getCell(`G${rowIndex}`).value = p.subtotal_con_ganancia;
            worksheet.getCell(`G${rowIndex}`).style = styles.money;

            rowIndex++;
        });

        // 5. Generamos el archivo y lo descargamos
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `cotizacion_${cotizacion.id_cotizacion}.xlsx`);

    } catch (error) {
        console.error("Error al generar el Excel:", error);
    }
};