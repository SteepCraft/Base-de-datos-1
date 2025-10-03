import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiSearch,
  FiPackage,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../config/api";

const Inventario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all"); // all, low, ok

  const { data: productos, isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await api.get("/producto");
      return response.data;
    },
  });

  const { data: inventario } = useQuery({
    queryKey: ["inventario"],
    queryFn: async () => {
      const response = await api.get("/inventario");
      return response.data;
    },
  });

  const getStockStatus = (stockActual) => {
    if (stockActual === 0)
      return { text: "Sin Stock", color: "red", icon: FiAlertTriangle };
    if (stockActual < 10)
      return { text: "Stock Bajo", color: "yellow", icon: FiAlertTriangle };
    return { text: "Stock OK", color: "green", icon: FiCheckCircle };
  };

  const filteredProductos = productos?.filter((producto) => {
    const matchesSearch =
      producto.codigo?.toString().includes(searchTerm) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStock === "all") return matchesSearch;
    if (filterStock === "low")
      return matchesSearch && producto.num_existencia < 10;
    if (filterStock === "ok")
      return matchesSearch && producto.num_existencia >= 10;

    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-600'>Cargando inventario...</div>
      </div>
    );
  }

  const totalProductos = productos?.length || 0;
  const stockBajo = productos?.filter((p) => p.num_existencia < 10).length || 0;
  const sinStock = productos?.filter((p) => p.num_existencia === 0).length || 0;
  const valorTotal =
    productos?.reduce((sum, p) => sum + p.num_existencia * p.precio, 0) || 0;

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Inventario</h1>
        <p className='mt-1 text-sm text-gray-500'>
          Control de stock y existencias de productos
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-4'>
        <div className='p-6 bg-white rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <FiPackage className='w-8 h-8 text-blue-600' />
            </div>
            <div className='flex-1 ml-4'>
              <p className='text-sm font-medium text-gray-500'>
                Total Productos
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {totalProductos}
              </p>
            </div>
          </div>
        </div>

        <div className='p-6 bg-white rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <FiAlertTriangle className='w-8 h-8 text-yellow-600' />
            </div>
            <div className='flex-1 ml-4'>
              <p className='text-sm font-medium text-gray-500'>Stock Bajo</p>
              <p className='text-2xl font-bold text-yellow-600'>{stockBajo}</p>
            </div>
          </div>
        </div>

        <div className='p-6 bg-white rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <FiAlertTriangle className='w-8 h-8 text-red-600' />
            </div>
            <div className='flex-1 ml-4'>
              <p className='text-sm font-medium text-gray-500'>Sin Stock</p>
              <p className='text-2xl font-bold text-red-600'>{sinStock}</p>
            </div>
          </div>
        </div>

        <div className='p-6 bg-white rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <FiCheckCircle className='w-8 h-8 text-green-600' />
            </div>
            <div className='flex-1 ml-4'>
              <p className='text-sm font-medium text-gray-500'>Valor Total</p>
              <p className='text-2xl font-bold text-green-600'>
                ${valorTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className='flex flex-col gap-4 mb-6 md:flex-row'>
        <div className='relative flex-1'>
          <FiSearch className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
          <input
            type='text'
            placeholder='Buscar por código o descripción...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => setFilterStock("all")}
            className={`px-4 py-2 rounded-lg ${
              filterStock === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStock("low")}
            className={`px-4 py-2 rounded-lg ${
              filterStock === "low"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Bajo
          </button>
          <button
            onClick={() => setFilterStock("ok")}
            className={`px-4 py-2 rounded-lg ${
              filterStock === "ok"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock OK
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className='overflow-hidden bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Código
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Producto
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Precio
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Stock Actual
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Estado
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Valor Stock
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredProductos?.length === 0 ? (
              <tr>
                <td colSpan='6' className='px-6 py-4 text-center text-gray-500'>
                  No hay productos en inventario
                </td>
              </tr>
            ) : (
              filteredProductos?.map((producto) => {
                const status = getStockStatus(producto.num_existencia);
                const StatusIcon = status.icon;
                const inventarioData = producto.inventario;

                return (
                  <tr key={producto.codigo} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {producto.codigo}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {producto.descripcion}
                      </div>
                      {inventarioData && (
                        <div className='text-xs text-gray-500'>
                          Inicio: {inventarioData.stock_inicio} | Final:{" "}
                          {inventarioData.stock_final}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        ${Number.parseFloat(producto.precio).toFixed(2)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-lg font-bold text-gray-900'>
                        {producto.num_existencia}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}
                      >
                        <StatusIcon className='w-4 h-4 mr-1' />
                        {status.text}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-semibold text-gray-900'>
                        $
                        {(producto.num_existencia * producto.precio).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className='flex justify-end gap-4 mt-4'>
        <div className='flex items-center text-sm text-gray-600'>
          <div className='w-3 h-3 mr-2 bg-red-500 rounded-full' />
          Sin Stock (0)
        </div>
        <div className='flex items-center text-sm text-gray-600'>
          <div className='w-3 h-3 mr-2 bg-yellow-500 rounded-full' />
          Stock Bajo ({`<`}10)
        </div>
        <div className='flex items-center text-sm text-gray-600'>
          <div className='w-3 h-3 mr-2 bg-green-500 rounded-full' />
          Stock OK (≥10)
        </div>
      </div>
    </div>
  );
};

export default Inventario;
