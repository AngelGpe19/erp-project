//src/components/cotizaciones/TotalesResumen.jsx
import React, { useContext } from "react";
import { CotizacionContext } from "../../context/CotizacionContext";

const TotalesResumen = () => {
  const { productosCotizacion } = useContext(CotizacionContext);

  const impuestoPorcentaje = 0.16;

  const totalSinImpuesto = productosCotizacion.reduce((acc, item) => {
    const precioConGanancia =
      item.precio.precio_unitario *
      (item.ganancia.tipo === "porcentaje"
        ? 1 + item.ganancia.valor / 100
        : 1 + item.ganancia.valor);

    return acc + precioConGanancia * item.cantidadContenido;
  }, 0);

  const impuesto = totalSinImpuesto * impuestoPorcentaje;
  const totalConImpuesto = totalSinImpuesto + impuesto;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 max-w-md">
      <h3 className="text-lg font-bold mb-2">Resumen</h3>
      <p>Total sin impuesto: ${totalSinImpuesto.toFixed(2)}</p>
      <p>Impuesto ({(impuestoPorcentaje * 100).toFixed(0)}%): ${impuesto.toFixed(2)}</p>
      <p className="font-bold">Total con impuesto: ${totalConImpuesto.toFixed(2)}</p>
    </div>
  );
};

export default TotalesResumen;
