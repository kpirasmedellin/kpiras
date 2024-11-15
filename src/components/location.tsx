import Image from 'next/image'
import { MapPin, Clock, Phone } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantLocation() {
  return (
    <div className="relative bg-gray-100 py-16" style={{ backgroundImage: 'url(/patron.png)' }}>
      <div className="absolute inset-0 bg-white opacity-80 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestra Ubicación
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-yellow-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Dirección</h3>
              </div>
              <p className="mt-4 text-gray-600">
                Calle 55 #24-02, Enciso<br />
                Medellín, Antioquia
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Horario</h3>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Lunes, Miercoles y Jueves: 4:00 PM - 10:00 PM<br />
                Viernes y Sabado: 2:00 PM - 12:00 PM<br />
                Domingos: 2:00 PM - 10:00 PM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-yellow-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Contacto</h3>
              </div>
              <p className="mt-4 text-gray-600">
                Teléfono: 313 5091600<br />
                Email: info@kpiras.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación en el mapa</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2124445749554!2d-75.55891732474735!3d6.238816327144676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80d16d9%3A0x42137cfcc7b5e610!2sCl.%2055%20%2324-2%2C%20Enciso%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1sen!2sco!4v1700027144549!5m2!1sen!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Kpiras"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pide a domicilio</h3>
            <p className="text-lg text-gray-600 mb-8 text-center">Encuéntranos también en:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                <Link className="block p-6" href={"https://web.didiglobal.com/co/food/"}>
                  <div className="flex items-center justify-center h-24">
                    
                    <Image
                      src="/didifood.png"
                      alt="Didi Food Logo"
                      width={180}
                      height={60}
                      className="object-contain"
                    />
                    
                  </div>
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                <Link className="block p-6" href={"https://www.rappi.com.co/"}>
                  <div className="flex items-center justify-center h-24">
                    <Image
                      src="/rappi.png"
                      alt="Rappi Logo"
                      width={150}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
