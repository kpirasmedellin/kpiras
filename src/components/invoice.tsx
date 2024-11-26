import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InvoiceProps {
  cliente: {
    nombre: string
    telefono: string
    direccion: string
  }
  carrito: Array<{
    id: number
    nombre: string
    cantidad: number
    precio: number
  }>
  observaciones: string
  total: number
}

export const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ cliente, carrito, observaciones, total }, ref) => (
    <div ref={ref} className="w-[80mm] p-4 border bg-white">
      <h3 className="text-center font-bold text-lg">Factura</h3>
      {cliente && (
        <div className="mt-4">
          <p><strong>Cliente:</strong> {cliente.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
        </div>
      )}
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Producto</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carrito.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell className="text-right">{prod.cantidad}</TableCell>
                <TableCell className="text-right">${prod.cantidad * prod.precio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4"><strong>Total:</strong> ${total}</p>
      {observaciones && <p className="mt-2"><strong>Observaciones:</strong> {observaciones}</p>}
      <p className="text-center mt-6 text-xs">Gracias por su compra</p>
    </div>
  )
)

Invoice.displayName = "Invoice"

