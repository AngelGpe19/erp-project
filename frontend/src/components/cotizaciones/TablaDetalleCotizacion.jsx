// src/components/TablaDetalleCotizacion.jsx
import React from "react";
import GananciaSelector from "./GananciaSelector";

const TablaDetalleCotizacion = ({
  productosCotizacion,
  actualizarCantidadContenido,
  actualizarGanancia,
  eliminarProducto,
}) => {
  const handleCantidadChange = (index, value) => {
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      actualizarCantidadContenido(index, val);
    }
  };

  const handleGananciaChange = (index, ganancia) => {
    actualizarGanancia(index, ganancia);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Detalle de la Cotización</h3>
      <table className="w-full text-sm border">
        <thead className="bg-blue-100">
          <tr>
            <th>Producto</th>
            <th>Unidad</th>
            <th>Cantidad Contenido</th>
            <th>Precio Unitario</th>
            <th>Ganancia</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosCotizacion.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No hay productos agregados.
              </td>
            </tr>
          )}

          {productosCotizacion.map((item, index) => {
            const precioConGanancia =
              item.precio.precio_unitario *
              (item.ganancia.tipo === "porcentaje"
                ? 1 + item.ganancia.valor / 100
                : 1 + item.ganancia.valor);

            const subtotal = precioConGanancia * item.cantidadContenido;

            return (
              <tr key={`${item.producto.id_producto}-${item.precio.id_precio}`}>
                <td>{item.producto.nombre}</td>
                <td>{item.producto.unidad_medida}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidadContenido}
                    onChange={(e) =>
                      handleCantidadChange(index, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-20"
                  />
                </td>
                <td>${parseFloat(item.precio.precio_unitario).toFixed(2)}</td>
                <td>
                  <GananciaSelector
                    ganancia={item.ganancia}
                    onChange={(ganancia) => handleGananciaChange(index, ganancia)}
                  />
                </td>
                <td>${subtotal.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => eliminarProducto(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDetalleCotizacion;
