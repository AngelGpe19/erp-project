// src/utils/generarReportesExcel.jsx
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Estilo base para los encabezados de los reportes
const headerStyle = {
    font: { bold: true, size: 12 },
    alignment: { horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } },
    border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
};

// Función para generar el reporte de productos
export const generarReporteProductos = async (productos) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Productos');

        // Definimos las columnas y sus encabezados
        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Unidad de Medida', key: 'unidad_medida', width: 20 },
            { header: 'Descripción', key: 'descripcion', width: 50 },
            { header: 'Categoría', key: 'categoria', width: 20 }
        ];

        // Aplicamos el estilo al encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Agregamos los datos
        worksheet.addRows(productos);

        // Generamos el archivo y lo descargamos
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `reporte_productos.xlsx`);

    } catch (error) {
        console.error("Error al generar el reporte de productos:", error);
    }
};

// Función para generar el reporte de precios
export const generarReportePrecios = async (precios) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Precios');

        // Definimos las columnas y sus encabezados
        worksheet.columns = [
            { header: 'ID Precio', key: 'id_precio', width: 15 },
            { header: 'Producto', key: 'nombre_producto', width: 30 },
            { header: 'Proveedor', key: 'nombre_proveedor', width: 30 },
            { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
            { header: 'Fecha de Registro', key: 'fecha_registro', width: 20 },
            { header: 'Condiciones de Pago', key: 'condiciones_pago', width: 30 },
            { header: 'Cantidad', key: 'cantidad', width: 15 },
            { header: 'Marca', key: 'marca', width: 20 },
            { header: 'Enlace', key: 'enlace', width: 50 }
        ];

        // Aplicamos el estilo al encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Agregamos los datos
        worksheet.addRows(precios);

        // Generamos el archivo y lo descargamos
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `reporte_precios.xlsx`);

    } catch (error) {
        console.error("Error al generar el reporte de precios:", error);
    }
};
