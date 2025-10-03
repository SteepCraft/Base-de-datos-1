import { useQuery } from "@tanstack/react-query";
import { FiUsers, FiPackage, FiTruck, FiShoppingCart } from "react-icons/fi";

import api from "../config/api";

const Dashboard = () => {
  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await api.get("/cliente");
      return response.data;
    },
  });

  const { data: productos } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await api.get("/producto");
      return response.data;
    },
  });

  const { data: proveedores } = useQuery({
    queryKey: ["proveedores"],
    queryFn: async () => {
      const response = await api.get("/proveedor");
      return response.data;
    },
  });

  const { data: ventas } = useQuery({
    queryKey: ["ventas"],
    queryFn: async () => {
      const response = await api.get("/venta");
      return response.data;
    },
  });

  const stats = [
    {
      name: "Total Clientes",
      value: clientes?.length || 0,
      icon: FiUsers,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      name: "Total Productos",
      value: productos?.length || 0,
      icon: FiPackage,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      name: "Total Proveedores",
      value: proveedores?.length || 0,
      icon: FiTruck,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      name: "Total Ventas",
      value: ventas?.length || 0,
      icon: FiShoppingCart,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Bienvenido al sistema de gestión de la tienda informática
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className='overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md'
            >
              <div className='p-6'>
                <div className='flex items-center'>
                  <div
                    className={`flex-shrink-0 ${stat.lightColor} rounded-lg p-3`}
                  >
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className='flex-1 w-0 ml-5'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        {stat.name}
                      </dt>
                      <dd className='flex items-baseline'>
                        <div className='text-2xl font-semibold text-gray-900'>
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Productos con bajo stock */}
        <div className='bg-white rounded-lg shadow-sm'>
          <div className='px-6 py-5 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Productos con Bajo Stock
            </h3>
          </div>
          <div className='px-6 py-4'>
            {productos
              ?.filter((p) => p.num_existencia < 10)
              .slice(0, 5)
              .map((producto) => (
                <div
                  key={producto.codigo}
                  className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {producto.descripcion}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Código: {producto.codigo}
                    </p>
                  </div>
                  <div className='ml-4'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                      Stock: {producto.num_existencia}
                    </span>
                  </div>
                </div>
              )) || (
              <p className='py-4 text-sm text-gray-500'>
                No hay productos con bajo stock
              </p>
            )}
          </div>
        </div>

        {/* Últimas ventas */}
        <div className='bg-white rounded-lg shadow-sm'>
          <div className='px-6 py-5 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Últimas Ventas
            </h3>
          </div>
          <div className='px-6 py-4'>
            {ventas
              ?.slice(-5)
              .reverse()
              .map((venta) => (
                <div
                  key={venta.codigo}
                  className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900'>
                      Venta #{venta.codigo}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {new Date(venta.fecha_venta).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className='ml-4'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                      ${parseFloat(venta.valor_tot || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )) || (
              <p className='py-4 text-sm text-gray-500'>
                No hay ventas registradas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
