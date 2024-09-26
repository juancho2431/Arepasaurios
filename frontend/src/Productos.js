import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'arepa',
    precio_venta: 0,
    ingredientes: []
  });
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    nombre: '',
    unidad: '',
    cantidad_porcion: 0,
    stock_actual: 0,
    stock_minimo: 0
  });
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState({ id: '', cantidad: 1 });
  const [productoEditando, setProductoEditando] = useState(null);
  const [ingredienteEditando, setIngredienteEditando] = useState(null);

  // Obtener productos e ingredientes
  useEffect(() => {
    cargarProductos();
    cargarIngredientes();
  }, []);

  const cargarProductos = () => {
    axios.get('http://localhost:3000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  };

  const cargarIngredientes = () => {
    axios.get('http://localhost:3000/api/ingredientes')
      .then(response => setIngredientesDisponibles(response.data))
      .catch(error => console.error('Error al obtener ingredientes:', error));
  };

  const manejarCambioProducto = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const manejarCambioIngrediente = (e) => {
    setNuevoIngrediente({
      ...nuevoIngrediente,
      [e.target.name]: e.target.value
    });
  };

  const guardarProducto = () => {
    if (productoEditando) {
      axios.put(`http://localhost:3000/api/productos/${productoEditando.id}`, nuevoProducto)
        .then(response => {
          setProductos(productos.map(p => p.id === productoEditando.id ? response.data : p));
          limpiarFormularioProducto();
        })
        .catch(error => console.error('Error al editar el producto:', error));
    } else {
      axios.post('http://localhost:3000/api/productos', nuevoProducto)
        .then(response => {
          setProductos([...productos, response.data]);
          limpiarFormularioProducto();
        })
        .catch(error => console.error('Error al agregar el producto:', error));
    }
  };

  const guardarIngrediente = () => {
    if (ingredienteEditando) {
      axios.put(`http://localhost:3000/api/ingredientes/${ingredienteEditando.id}`, nuevoIngrediente)
        .then(response => {
          setIngredientesDisponibles(ingredientesDisponibles.map(i => i.id === ingredienteEditando.id ? response.data : i));
          limpiarFormularioIngrediente();
        })
        .catch(error => console.error('Error al editar el ingrediente:', error));
    } else {
      axios.post('http://localhost:3000/api/ingredientes', nuevoIngrediente)
        .then(response => {
          setIngredientesDisponibles([...ingredientesDisponibles, response.data]);
          limpiarFormularioIngrediente();
        })
        .catch(error => console.error('Error al agregar el ingrediente:', error));
    }
  };

  const eliminarProducto = (id) => {
    axios.delete(`http://localhost:3000/api/productos/${id}`)
      .then(() => {
        setProductos(productos.filter(producto => producto.id !== id));
      })
      .catch(error => console.error('Error al eliminar producto:', error));
  };

  const eliminarIngrediente = (id) => {
    axios.delete(`http://localhost:3000/api/ingredientes/${id}`)
      .then(() => {
        setIngredientesDisponibles(ingredientesDisponibles.filter(ing => ing.id !== id));
      })
      .catch(error => console.error('Error al eliminar ingrediente:', error));
  };

  const seleccionarProductoParaEditar = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio_venta: producto.precio_venta,
      ingredientes: producto.ingredientes || []
    });
    setProductoEditando(producto);
  };

  const seleccionarIngredienteParaEditar = (ingrediente) => {
    setNuevoIngrediente({
      nombre: ingrediente.nombre,
      unidad: ingrediente.unidad,
      cantidad_porcion: ingrediente.cantidad_porcion,
      stock_actual: ingrediente.stock_actual,
      stock_minimo: ingrediente.stock_minimo
    });
    setIngredienteEditando(ingrediente);
  };

  const limpiarFormularioProducto = () => {
    setNuevoProducto({
      nombre: '',
      categoria: 'arepa',
      precio_venta: 0,
      ingredientes: []
    });
    setProductoEditando(null);
  };

  const limpiarFormularioIngrediente = () => {
    setNuevoIngrediente({
      nombre: '',
      unidad: '',
      cantidad_porcion: 0,
      stock_actual: 0,
      stock_minimo: 0
    });
    setIngredienteEditando(null);
  };

  const agregarIngrediente = () => {
    if (!ingredienteSeleccionado || ingredienteSeleccionado.id === "") {
      alert("Por favor selecciona un ingrediente.");
      return;
    }

    setNuevoProducto({
      ...nuevoProducto,
      ingredientes: [...nuevoProducto.ingredientes, ingredienteSeleccionado]
    });

    setIngredienteSeleccionado({ id: '', cantidad: 1 });
  };

  return (
    <div className="container">
      <h1>Inventario de Arepas</h1>

      <div className="form-container">
        <h2>{productoEditando ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form>
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={manejarCambioProducto}
            placeholder="Nombre del producto"
          />
          <select
            name="categoria"
            value={nuevoProducto.categoria}
            onChange={manejarCambioProducto}
          >
            <option value="arepa">Arepa</option>
            <option value="bebida">Bebida</option>
          </select>
          <input
            type="number"
            name="precio_venta"
            value={nuevoProducto.precio_venta}
            onChange={manejarCambioProducto}
            placeholder="Precio de venta"
          />

          <h3>Ingredientes</h3>
          <select
            name="ingrediente"
            value={ingredienteSeleccionado.id}
            onChange={(e) => setIngredienteSeleccionado({
              ...ingredienteSeleccionado,
              id: e.target.value
            })}
          >
            <option value="">Seleccionar Ingrediente</option>
            {ingredientesDisponibles && ingredientesDisponibles.map(ing => (
              <option key={ing.id} value={ing.id}>{ing.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            value={ingredienteSeleccionado.cantidad}
            onChange={(e) => setIngredienteSeleccionado({
              ...ingredienteSeleccionado,
              cantidad: e.target.value
            })}
            placeholder="Cantidad"
          />
          <button type="button" onClick={agregarIngrediente}>Agregar Ingrediente</button>

          <ul>
            {nuevoProducto.ingredientes.map((ing, index) => (
              <li key={index}>
                {ingredientesDisponibles.find(i => i.id === ing.id)?.nombre} - Cantidad: {ing.cantidad}
              </li>
            ))}
          </ul>

          <button type="button" onClick={guardarProducto}>
            {productoEditando ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
        </form>
      </div>

      <div className="form-container">
        <h2>{ingredienteEditando ? 'Editar Ingrediente' : 'Agregar Ingrediente'}</h2>
        <form>
          <input
            type="text"
            name="nombre"
            value={nuevoIngrediente.nombre}
            onChange={manejarCambioIngrediente}
            placeholder="Nombre del ingrediente"
          />
          <input
            type="text"
            name="unidad"
            value={nuevoIngrediente.unidad}
            onChange={manejarCambioIngrediente}
            placeholder="Unidad"
          />
          <input
            type="number"
            name="cantidad_porcion"
            value={nuevoIngrediente.cantidad_porcion}
            onChange={manejarCambioIngrediente}
            placeholder="Cantidad por porción"
          />
          <input
            type="number"
            name="stock_actual"
            value={nuevoIngrediente.stock_actual}
            onChange={manejarCambioIngrediente}
            placeholder="Stock actual"
          />
          <input
            type="number"
            name="stock_minimo"
            value={nuevoIngrediente.stock_minimo}
            onChange={manejarCambioIngrediente}
            placeholder="Stock mínimo"
          />

          <button type="button" onClick={guardarIngrediente}>
            {ingredienteEditando ? 'Guardar Cambios' : 'Agregar Ingrediente'}
          </button>
        </form>
      </div>

      <div className="product-list">
        <h2>Lista de Productos</h2>
        <ul>
          {productos && productos.map(producto => (
            <li key={producto.id}>
              <strong>{producto.nombre}</strong> - {producto.categoria} - ${producto.precio_venta}
              <ul>
                {producto.ingredientes && producto.ingredientes.map(ing => (
                  <li key={ing.id}>{ing.nombre} - Cantidad: {ing.ProductoIngrediente?.cantidad || 0}</li>
                ))}
              </ul>
              <button onClick={() => seleccionarProductoParaEditar(producto)}>Editar Producto</button>
              <button onClick={() => eliminarProducto(producto.id)}>Eliminar Producto</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ingredient-list">
        <h2>Lista de Ingredientes</h2>
        <ul>
          {ingredientesDisponibles && ingredientesDisponibles.map(ing => (
            <li key={ing.id}>
              {ing.nombre} - {ing.unidad} - Stock: {ing.stock_actual}
              <button onClick={() => seleccionarIngredienteParaEditar(ing)}>Editar Ingrediente</button>
              <button onClick={() => eliminarIngrediente(ing.id)}>Eliminar Ingrediente</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Productos;
