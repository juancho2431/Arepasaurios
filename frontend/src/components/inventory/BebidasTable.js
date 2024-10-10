import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BebidasTable() {
  const [bebidas, setBebidas] = useState([]);
  const [newBebida, setNewBebida] = useState({
    name: '',
    stock: 0,
    price: 0
  });

  useEffect(() => {
    fetchBebidas();
  }, []);

  const fetchBebidas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bebidas');
      setBebidas(response.data);
    } catch (error) {
      console.error('Error al obtener las bebidas:', error);
    }
  };

  const handleAddBebida = async () => {
    try {
      await axios.post('http://localhost:3000/api/bebidas', newBebida);
      fetchBebidas();
      setNewBebida({ name: '', stock: 0, price: 0 });
    } catch (error) {
      console.error('Error al agregar la bebida:', error);
    }
  };

  const handleEditBebida = async (id) => {
    try {
      const updatedBebida = bebidas.find((bebida) => bebida.bebida_id === id);
      await axios.put(`http://localhost:3000/api/bebidas/${id}`, updatedBebida);
      fetchBebidas();
    } catch (error) {
      console.error('Error al editar la bebida:', error);
    }
  };

  const handleDeleteBebida = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bebidas/${id}`);
      fetchBebidas();
    } catch (error) {
      console.error('Error al eliminar la bebida:', error);
    }
  };

  return (
    <div>
      <h2>Bebidas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bebidas.map((bebida) => (
            <tr key={bebida.bebida_id}>
              <td>{bebida.bebida_id}</td>
              <td>
                <input
                  type="text"
                  value={bebida.name}
                  onChange={(e) =>
                    setBebidas((prev) =>
                      prev.map((b) =>
                        b.bebida_id === bebida.bebida_id ? { ...b, name: e.target.value } : b
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={bebida.stock}
                  onChange={(e) =>
                    setBebidas((prev) =>
                      prev.map((b) =>
                        b.bebida_id === bebida.bebida_id ? { ...b, stock: e.target.value } : b
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={bebida.price}
                  onChange={(e) =>
                    setBebidas((prev) =>
                      prev.map((b) =>
                        b.bebida_id === bebida.bebida_id ? { ...b, price: e.target.value } : b
                      )
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => handleEditBebida(bebida.bebida_id)}>Editar</button>
                <button onClick={() => handleDeleteBebida(bebida.bebida_id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Agregar Bebida</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={newBebida.name}
        onChange={(e) => setNewBebida({ ...newBebida, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={newBebida.stock}
        onChange={(e) => setNewBebida({ ...newBebida, stock: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio"
        value={newBebida.price}
        onChange={(e) => setNewBebida({ ...newBebida, price: e.target.value })}
      />
      <button onClick={handleAddBebida}>Agregar</button>
    </div>
  );
}

export default BebidasTable;