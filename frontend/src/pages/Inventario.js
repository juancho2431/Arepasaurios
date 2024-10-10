import React from 'react';
import IngredientesTable from '../components/inventory/IngredientesTable';
import ArepasTable from '../components/inventory/ArepasTable';
import BebidasTable from '../components/inventory/BebidasTable';
import '../styles/Inventario.css';

function InventarioPage() {
  return (
    <div>
      <h1>Inventario</h1>
      <IngredientesTable />
      <ArepasTable />
      <BebidasTable />
    </div>
  );
}

export default InventarioPage;
