// src/components/TablaDetalleCotizacion.jsx
import React from "react";
import GananciaSelector from "./GananciaSelector";

const TablaDetalleCotizacion = ({
  productosCotizacion,
  actualizarCantidadContenido,
  actualizarCantidadPiezas,
  actualizarGanancia,
  eliminarProducto,
}) => {
  const handleCantidadContenidoChange = (index, value) => {
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      actualizarCantidadContenido(index, val);
    }
  };

  const handleCantidadPiezasChange = (index, value) => {
    const val = parseInt(value);
    if (!isNaN(val) && val > 0) {
      actualizarCantidadPiezas(index, val);
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
            <th>Cantidad Piezas</th>
            <th>Precio Unitario</th>
            <th>Ganancia</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosCotizacion.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No hay productos agregados.
              </td>
            </tr>
          )}

          {productosCotizacion.map((item, index) => {
          const precioConGanancia =
  item.ganancia.tipo === "porcentaje"
    ? parseFloat(item.precio.precio_unitario) * (1 + parseFloat(item.ganancia.valor) / 100)
    : parseFloat(item.precio.precio_unitario) + parseFloat(item.ganancia.valor);

const subtotal = precioConGanancia * parseInt(item.cantidadPiezas || 0, 10);


            return (
              <tr key={`${item.producto.id_producto}-${item.precio.id_precio}`}>
                <td>{item.producto.nombre}</td>
                <td>{item.producto.unidad_medida}</td>
                <td>
                  {/* Cantidad Contenido: volumen fijo, editable solo si quieres */}
                  <input
                    type="number"
                    min="1"
                    value={item.cantidadContenido}
                    onChange={(e) =>
                      handleCantidadContenidoChange(index, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-20"
                  />
                </td>
                <td>
                  {/* Cantidad Piezas: la cantidad que se multiplica para subtotal */}
                  <input
                    type="number"
                    min="1"
                    value={item.cantidadPiezas}
                    onChange={(e) =>
                      handleCantidadPiezasChange(index, e.target.value)
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
