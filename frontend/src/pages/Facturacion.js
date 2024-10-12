import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Facturacion.css'

const Facturacion = () => {
  const [ventas, setVentas] = useState([]);
  const [arepas, setArepas] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArepas();
    fetchBebidas();
    fetchVentas();
  }, []);

  const fetchArepas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/arepas');
      setArepas(response.data);
    } catch (err) {
      setError('Error al obtener las arepas');
    }
  };

  const fetchBebidas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bebidas');
      setBebidas(response.data);
    } catch (err) {
      setError('Error al obtener las bebidas');
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/ventas');
      setVentas(response.data);
    } catch (err) {
      setError('Error al obtener las ventas');
    }
  };

  const handleAddToCarrito = (item) => {
    setCarrito([...carrito, item]);
    setTotal(total + item.price);
  };

  const handleRemoveFromCarrito = (index) => {
    const itemToRemove = carrito[index];
    setCarrito(carrito.filter((_, i) => i !== index));
    setTotal(total - itemToRemove.price);
  };

  const handleConfirmSale = async () => {
    if (carrito.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    const ventaData = {
      fecha: new Date().toISOString(),
      total: total,
      detalles: carrito.map((item) => ({
        tipo_producto: item.type,
        producto_id: item.arepa_id || item.bebida_id,
        cantidad: 1, // Puedes ajustar según la cantidad seleccionada
        precio: item.price,
      })),
    };

    try {
      console.log('Datos de la venta:', ventaData);
      await axios.post('http://localhost:3000/api/ventas', ventaData);
      setCarrito([]);
      setTotal(0);
      fetchVentas(); // Actualizar lista de ventas después de confirmar la venta
    } catch (err) {
      setError('Error al realizar la venta');
    }
  };

  return (
    <div>
      <h1>Facturación</h1>
      {error && <p className="error">{error}</p>}

      <div className="productos">
        <div className="arepas">
          <h2>Arepas</h2>
          {arepas.map((arepa) => (
            <div key={arepa.arepa_id}>
              <span>{arepa.name} - ${arepa.price}</span>
              <button onClick={() => handleAddToCarrito({ ...arepa, type: 'arepa' })}>Agregar</button>
            </div>
          ))}
        </div>

        <div className="bebidas">
          <h2>Bebidas</h2>
          {bebidas.map((bebida) => (
            <div key={bebida.bebida_id}>
              <span>{bebida.name} - ${bebida.price}</span>
              <button onClick={() => handleAddToCarrito({ ...bebida, type: 'bebida' })}>Agregar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="carrito">
        <h2>Carrito de Compra</h2>
        {carrito.length === 0 ? (
          <p>No hay productos seleccionados</p>
        ) : (
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
                <button onClick={() => handleRemoveFromCarrito(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
        <p>Total: ${total}</p>
        <button onClick={handleConfirmSale} disabled={carrito.length === 0}>Confirmar Venta</button>
      </div>

      <div className="ventas">
        <h2>Historial de Ventas</h2>
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.ventas_id}>
                <td>{venta.ventas_id}</td>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>{venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Facturacion;
