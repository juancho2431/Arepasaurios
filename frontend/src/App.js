import React from 'react';
import './App.css';
import Productos from './Productos';  // Importa el componente Productos

const App = () => {
  return (
    <div>
      <h1>Inventario de Arepas</h1>
      <Productos />
    </div>
  );
};

export default App;
