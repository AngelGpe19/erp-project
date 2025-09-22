<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generar Cotización Excel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Incluimos ExcelJS para la manipulación de Excel -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>
    <!-- Incluimos FileSaver para guardar el archivo en el navegador -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: white;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 90%;
            width: 500px;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1.5rem;
        }
        button {
            background-color: #4f46e5;
            color: white;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #4338ca;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Generador de Cotización</h1>
        <p class="text-gray-600 mb-6">Haz clic en el botón para generar y descargar tu archivo de cotización con el formato especificado.</p>
        <button id="generateBtn">Generar y Descargar Excel</button>
    </div>

    <script>
        document.getElementById('generateBtn').addEventListener('click', async () => {
            // Creamos un nuevo libro de trabajo de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Cotización');

            // 1. Desactivamos las líneas de cuadrícula, barra de fórmulas y encabezados
            worksheet.views = [{
                showGridLines: false,
                showFormulas: false,
                showRowColHeaders: false
            }];

            // Estilos personalizados basados en los formatos de Excel
            const styles = {
                header: {
                    font: { bold: true, size: 12, color: { argb: 'FF000000' } },
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } }, // Color verde claro para encabezados
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
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }, // Color azul claro para entrada
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
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } }, // Color anaranjado claro para salida
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
                    numFmt: '$#,##0.00',
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                },
                totalCell: {
                    font: { bold: true, color: { argb: 'FF333333' } },
                    alignment: { vertical: 'middle', horizontal: 'right' },
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

            // Fila 1 - Título "Cotización"
            worksheet.mergeCells('A1:B1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'Cotización';
            titleCell.font = { bold: true, size: 16 };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

            // Fila 1 - Totales
            worksheet.getCell('D1').value = 'Antes de impuestos';
            worksheet.getCell('D1').style = styles.output;
            worksheet.getCell('E1').value = 120.00; // Datos de ejemplo
            worksheet.getCell('E1').style = { ...styles.output, numFmt: '$#,##0.00' };

            // Fila 2 - Totales
            worksheet.getCell('D2').value = 'Despues de impuestos';
            worksheet.getCell('D2').style = styles.output;
            worksheet.getCell('E2').value = 139.20; // Datos de ejemplo
            worksheet.getCell('E2').style = { ...styles.output, numFmt: '$#,##0.00' };

            // Fila 4 - Cliente
            worksheet.getCell('D4').value = 'Cliente:';
            worksheet.getCell('D4').style = styles.header;
            worksheet.mergeCells('E4:F4');
            const clientCell = worksheet.getCell('E4');
            clientCell.value = 'Nombre del cliente';
            clientCell.style = styles.input;
            clientCell.alignment = { horizontal: 'left', vertical: 'middle' };

            // Fila 5 - Encabezados de la tabla dinámica
            worksheet.getCell('A5').value = 'Numero';
            worksheet.getCell('A5').style = styles.header;
            worksheet.getCell('B5').value = 'Concepto';
            worksheet.getCell('B5').style = { ...styles.header, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } } }; // color naranja
            worksheet.getCell('C5').value = 'Descripcion';
            worksheet.getCell('C5').style = { ...styles.header, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBE5D6' } } }; // color naranja
            worksheet.getCell('D5').value = 'Unidad de medida';
            worksheet.getCell('D5').style = styles.header;
            worksheet.getCell('E5').value = 'Cantidad';
            worksheet.getCell('E5').style = styles.header;
            worksheet.getCell('F5').value = 'Precio';
            worksheet.getCell('F5').style = styles.header;
            worksheet.getCell('G5').value = 'Total';
            worksheet.getCell('G5').style = styles.header;

            // Datos de ejemplo simulando la consulta a la base de datos
            const data = [
                {
                    numero: 1,
                    concepto: 'Este es un concepto',
                    descripcion: 'Esta es una descripcion',
                    unidad_medida: '1 L',
                    cantidad: 1,
                    precio: 10.00,
                    total: 10.00
                },
                {
                    numero: 2,
                    concepto: 'Este es otro concepto pero con nombre largo',
                    descripcion: 'Esta es otra descripcion de ejemplo pero muy muy muy largo ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
                    unidad_medida: '8hrs',
                    cantidad: 5,
                    precio: 10.00,
                    total: 50.00
                },
                {
                    numero: 3,
                    concepto: 'Este es otro concepto',
                    descripcion: 'Esta es otro ejemplo de descripcion',
                    unidad_medida: 'm2',
                    cantidad: 6,
                    precio: 10.00,
                    total: 60.00
                }
            ];

            // 4. Agregamos las filas de datos dinámicos y aplicamos estilos
            let rowIndex = 6;
            data.forEach(row => {
                // Fila de datos
                worksheet.getCell(`A${rowIndex}`).value = row.numero;
                worksheet.getCell(`A${rowIndex}`).style = styles.cellContent;

                worksheet.getCell(`B${rowIndex}`).value = row.concepto;
                worksheet.getCell(`B${rowIndex}`).style = styles.cellContent;

                worksheet.getCell(`C${rowIndex}`).value = row.descripcion;
                worksheet.getCell(`C${rowIndex}`).style = styles.cellContent;

                worksheet.getCell(`D${rowIndex}`).value = row.unidad_medida;
                worksheet.getCell(`D${rowIndex}`).style = styles.cellContent;

                worksheet.getCell(`E${rowIndex}`).value = row.cantidad;
                worksheet.getCell(`E${rowIndex}`).style = styles.cellContent;

                worksheet.getCell(`F${rowIndex}`).value = row.precio;
                worksheet.getCell(`F${rowIndex}`).style = styles.money;

                worksheet.getCell(`G${rowIndex}`).value = row.total;
                worksheet.getCell(`G${rowIndex}`).style = styles.money;

                rowIndex++;
            });

            // 5. Generamos el archivo y lo descargamos
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'cotizacion.xlsx');
        });
    </script>
</body>
</html>