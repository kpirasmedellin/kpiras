import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';
import useStore from '@/stores/useStore';
import { createKitchen, createInvoice } from '@/services/apiServices';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


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

Invoice.displayName = "Invoice";

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

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

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
    if (carrito.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'No hay ningún producto pendiente por facturar.',
        icon: 'warning',
      });
      return;
    }
  
    if (isProcessing) {
      return;
    }
  
    setIsProcessing(true);
  
    Swal.fire({
      title: 'Procesando factura',
      text: 'Por favor, espere mientras se genera la factura...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  
    const clienteFacturacion = cliente || clienteGenerico;
  
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
  
    const invoiceData = {
      clientId: clienteFacturacion.id || null,
      products: carrito.map((prod) => ({
        id: prod.id,
        cantidad: prod.cantidad,
        costo: prod.costo,
        precio: prod.precio,
      })),
      total: total,
      estado: 'FACTURADO',
      observaciones,
    };
  
    try {
      await createKitchen(kitchenData);
      await createInvoice(invoiceData);
      handlePrint();
      clearCarrito();
  
      await Swal.fire({
        title: 'Factura generada',
        text: 'La factura se ha generado y enviado a imprimir correctamente.',
        icon: 'success',
      });
  
      window.location.reload(); // Recarga completa de la página
    } catch (error) {
      console.error('Error durante la facturación:', error);
      Swal.fire({
        title: 'Error al facturar',
        text: 'Ocurrió un error al intentar facturar. Por favor, intenta de nuevo.',
        icon: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="p-4 bg-amber-50 min-h-screen text-amber-600">
      <h3 className="text-xl font-bold text-amber-700">Carrito</h3>

      {cliente ? (
        <div className="mb-4">
          <p>Cliente: {cliente.nombre}</p>
          <p>Teléfono: {cliente.telefono}</p>
          <p>Dirección: {cliente.direccion}</p>
        </div>
      ) : (
        <div className="mb-4">
          <p>Cliente: {clienteGenerico.nombre}</p>
          <p>Teléfono: {clienteGenerico.telefono}</p>
          <p>Dirección: {clienteGenerico.direccion}</p>
        </div>
      )}

      <ul>
        {carrito.map((producto) => (
          <li key={producto.id} className="flex justify-between items-center py-2 border-b border-amber-200">
            <span className='w-3/5'>
              {producto.nombre}= ${producto.precio * producto.cantidad}
            </span>
            <div className="flex items-center gap-1 w-2/5">
              <button 
                onClick={() => decrementQuantity(producto.id)} 
                className="px-3 py-1 bg-amber-200 text-amber-700 rounded font-black text-xl hover:bg-amber-300 transition-colors"
                disabled={isProcessing}
              >
                -
              </button>
              <span className="w-8 text-center">{producto.cantidad}</span>
              <button 
                onClick={() => incrementQuantity(producto.id)} 
                className="px-2 py-1 bg-amber-200 text-amber-700 rounded font-black text-xl hover:bg-amber-300 transition-colors"
                disabled={isProcessing}
              >
                +
              </button>
              <button 
                onClick={() => removeFromCarrito(producto.id)} 
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={isProcessing}
              >
                <Trash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-lg font-bold">Total: ${total}</p>
      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        className="border border-amber-400 rounded p-2 w-full mt-4 bg-amber-50 text-amber-600 focus:border-amber-600"
        disabled={isProcessing}
      />
      <button
        onClick={handleFacturar}
        className={`w-full mt-4 py-2 px-4 rounded text-white transition-colors ${
          isProcessing || carrito.length === 0
            ? 'bg-amber-300 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-600'
        }`}
        disabled={isProcessing || carrito.length === 0}
      >
        {isProcessing ? 'Procesando...' : 'Facturar'}
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

