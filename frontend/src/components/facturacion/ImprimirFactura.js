import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import logo from '../../assets/LOGO_AREPASAURIOS.png';
import '../../styles/ImprimirFactura.css'

const ImprimirFactura = () => {
  const { ventaId } = useParams();
  const [venta, setVenta] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    console.log('Intentando obtener la venta con ID:', ventaId);
    const fetchVenta = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ventas/${ventaId}`);
        console.log('Datos de la venta obtenidos:', response.data);
        setVenta(response.data);
      } catch (error) {
        setError('Error al obtener la venta');
        console.error('Detalles del error:', error);
      }
    };
  
    if (ventaId) {
      fetchVenta();
    }
  }, [ventaId]);
  
  

  const handlePrint = () => {
    if (!venta || !venta.VentaDetalles || venta.VentaDetalles.length === 0) {
      console.error('No hay detalles de venta disponibles');
      return;
    }

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 150],
    });

    let yOffset = 5;

    // Logo e información del negocio
    if (logo) {
      doc.addImage(logo, 'PNG', 20, yOffset, 40, 30);
      yOffset += 25;
    }
    doc.setFont('helvetica');
    doc.setFontSize(10);
    doc.text('Teléfono: 3223165793', 10, yOffset+=10);
    doc.text('Régimen: No responsable de IVA', 10, (yOffset += 5));

    // Información de la venta
    doc.setFontSize(18);
    doc.text('Factura de Venta', 20, (yOffset += 10));
    doc.setFontSize(10);
    doc.text(`Venta #${venta.ventas_id}`, 10, (yOffset += 5));
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleString()}`, 10, (yOffset += 5));
    

    // Detalles del pedido
    doc.setFontSize(15);
    doc.text('Detalles del Pedido:', 20, (yOffset += 10));
    doc.setFontSize(10);
    venta.VentaDetalles.forEach((detalle) => {
      const producto = detalle.tipo_producto === 'arepa' ? detalle.arepa : detalle.bebida;
      const nombreProducto = producto ? producto.name : 'Producto desconocido';
      const lineaDetalle = `${nombreProducto} (x${detalle.cantidad}):..................$${detalle.precio}`;
      const LINE_SPACING = 5;
      doc.text(lineaDetalle, LINE_SPACING, (yOffset += 5));
    });
    yOffset += 5;
    doc.line(5, yOffset, 75, yOffset);
    
    // Total de la venta
    doc.setFontSize(20);
    doc.text(`Total: $${venta.total}`, 30, (yOffset += 10));

    // Pie de página
    doc.setFontSize(18);
    doc.text('¡¡Gracias por su compra!!', 5, (yOffset += 10));
    doc.setFontSize(10);
    doc.text('NIT: 1027520378-9', 25, (yOffset += 5));

    // Abrir el PDF en una ventana nueva y enviarlo directamente a impresión
    const pdfBlob = doc.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL);
  };

  return (
    <div>
      <h2>Imprimir Factura</h2>
      {error && <p>{error}</p>}
      {venta && (
        <div>
          <button onClick={handlePrint}>Imprimir Factura</button>
        </div>
      )}
    </div>
  );
};

export default ImprimirFactura;
