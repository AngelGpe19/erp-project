//src/components/cotizaciones/GananciaSelector.jsx
import React, { useState, useEffect } from "react";

const GananciaSelector = ({ ganancia, onChange }) => {
  const [tipo, setTipo] = useState(ganancia.tipo || "porcentaje"); // "porcentaje" o "fijo"
  const [valor, setValor] = useState(ganancia.valor || 0);

  useEffect(() => {
    onChange({ tipo, valor: parseFloat(valor) || 0 });
  }, [tipo, valor]);

  return (
    <div className="flex items-center gap-2">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="border rounded px-1 py-0.5"
      >
        <option value="porcentaje">%</option>
        <option value="fijo">Monto fijo</option>
      </select>
      <input
        type="number"
        min="0"
        step="0.01"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="border rounded px-2 py-1 w-20"
      />
    </div>
  );
};

export default GananciaSelector;
