import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import useStore from '@/stores/useStore';
import { createKitchen, createInvoice } from '@/services/apiServices';

const Invoice = React.forwardRef(({ cliente, carrito, observaciones, total }: any, ref: any) => (
  <div ref={ref} className="w-[80mm] p-4 border">
    <h3 className="text-center font-bold text-lg">Factura</h3>
    {cliente && (
      <div className="mt-4">
        <p><strong>Cliente:</strong> {cliente.nombre}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>Dirección:</strong> {cliente.direccion}</p>
      </div>
    )}
    <div className="mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Producto</th>
            <th className="text-right">Cantidad</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((prod: any) => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td className="text-right">{prod.cantidad}</td>
              <td className="text-right">${prod.cantidad * prod.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-4"><strong>Total:</strong> ${total}</p>
    {observaciones && <p className="mt-2"><strong>Observaciones:</strong> {observaciones}</p>}
    <p className="text-center mt-6 text-xs">Gracias por su compra</p>
  </div>
));

export default function Cart() {
  const {
    carrito,
    removeFromCarrito,
    incrementQuantity,
    decrementQuantity,
    observaciones,
    setObservaciones,
    cliente,
    calcularCarrito,
    clearCarrito,
  } = useStore();

  const clienteGenerico = {
    id: 0,
    nombre: 'Consumidor Final',
    telefono: '1',
    direccion: '1',
  };

  const total = carrito.reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    onBeforePrint: async () => {
      return new Promise<void>((resolve) => {
        try {
          calcularCarrito(); // Actualizar conteo y total
          console.log('Preparando para imprimir...');
          resolve();
        } catch (error) {
          console.error('Error en onBeforePrint:', error);
          resolve(); // Resolvemos la promesa incluso en caso de error para permitir que la impresión continúe
        }
      });
    },
    onAfterPrint: () => {
      console.log('Impresión completada');
    },
    onPrintError: (errorLocation, error) => {
      console.error('Error durante la impresión:', errorLocation, error);
    },
  });

  const handleFacturar = async () => {
    const clienteFacturacion = cliente || clienteGenerico;
  
    console.log('Facturando...');
    console.log('Cliente:', clienteFacturacion);
    console.log('Productos:', carrito);
    console.log('Observaciones:', observaciones);
  
    // Preparar datos para cocina y factura desde el carrito
    const kitchenData = {
      clientId: clienteFacturacion.id || null,
      products: carrito.map((prod) => ({
        id: prod.id,
        cantidad: prod.cantidad,
        costo: prod.costo,
        precio: prod.precio,
      })),
      observaciones,
    };
    
    console.log('Datos enviados a createKitchen:', kitchenData);
    await createKitchen(kitchenData);
  
    const invoiceData = {
      clientId: clienteFacturacion.id || null,
      products: carrito.map((prod) => ({
        id: prod.id,
        cantidad: prod.cantidad, // Incluye la cantidad
        costo: prod.costo, // Incluye el costo unitario
        precio: prod.precio, // Incluye el precio unitario
      })),
      total: total,
      estado: 'FACTURADO',
      observaciones,
    };
  
    try {
      // Crear ticket de cocina
      const kitchenResponse = await createKitchen(kitchenData);
      console.log('Ticket de cocina creado exitosamente:', kitchenResponse);
  
      // Crear factura
      const invoiceResponse = await createInvoice(invoiceData);
      console.log('Factura creada exitosamente:', invoiceResponse);
  
      // Imprimir la factura
      handlePrint();
  
      // Limpiar carrito después de la facturación
      clearCarrito();
    } catch (error) {
      console.error('Error durante la facturación:', error);
      alert('Ocurrió un error al intentar facturar. Por favor, intenta de nuevo.');
    }
  };
  
  
  return (
    <div className="p-4 border mt-4">
      <h3 className="text-xl font-bold">Carrito</h3>

      {cliente ? (
        <div className="mb-4">
          <p><strong>Cliente:</strong> {cliente.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
        </div>
      ) : (
        <div className="mb-4">
          <p><strong>Cliente:</strong> {clienteGenerico.nombre}</p>
          <p><strong>Teléfono:</strong> {clienteGenerico.telefono}</p>
          <p><strong>Dirección:</strong> {clienteGenerico.direccion}</p>
        </div>
      )}

      <ul>
        {carrito.map((producto) => (
          <li key={producto.id} className="flex justify-between items-center">
            <span>
              {producto.nombre} - ${producto.precio} x {producto.cantidad} = ${producto.precio * producto.cantidad}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => decrementQuantity(producto.id)} className="text-blue-500">-</button>
              <button onClick={() => incrementQuantity(producto.id)} className="text-blue-500">+</button>
              <button onClick={() => removeFromCarrito(producto.id)} className="text-red-500">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4">Total: ${total}</p>
      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        className="border p-2 w-full mt-4"
      />
      <button
        onClick={handleFacturar}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Facturar
      </button>

      {/* Factura oculta para impresión */}
      <div style={{ display: 'none' }}>
        <Invoice
          ref={invoiceRef}
          cliente={cliente || clienteGenerico}
          carrito={carrito}
          observaciones={observaciones}
          total={total}
        />
      </div>
    </div>
  );
}
