import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiPlus, FiTrash2, FiSearch, FiX, FiTruck } from "react-icons/fi";

import api from "../config/api";

const Suministros = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id_proveedor: "",
    codigo_producto: "",
  });

  const { data: suministros, isLoading } = useQuery({
    queryKey: ["suministros"],
    queryFn: async () => {
      const response = await api.get("/suministro");
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

  const { data: productos } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await api.get("/producto");
      return response.data;
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id_proveedor: "",
      codigo_producto: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/suministro", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["suministros"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id_proveedor, codigo_producto }) => {
      await api.delete(`/suministro/${id_proveedor}/${codigo_producto}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["suministros"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id_proveedor, codigo_producto) => {
    if (
      window.confirm("¿Está seguro de eliminar esta relación de suministro?")
    ) {
      deleteMutation.mutate({ id_proveedor, codigo_producto });
    }
  };

  const getProveedorName = (id) => {
    const proveedor = proveedores?.find((p) => p.id === id);
    return proveedor ? `${proveedor.nombres} ${proveedor.apellidos}` : "N/A";
  };

  const getProductoName = (codigo) => {
    const producto = productos?.find((p) => p.codigo === codigo);
    return producto ? producto.descripcion : "N/A";
  };

  const filteredSuministros = suministros?.filter((suministro) => {
    const proveedorName = getProveedorName(suministro.id_proveedor);
    const productoName = getProductoName(suministro.codigo_producto);

    return (
      proveedorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productoName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-600'>Cargando suministros...</div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Suministros Proveedor-Producto
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Gestiona qué proveedores suministran qué productos
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700'
        >
          <FiPlus className='mr-2' />
          Nueva Relación
        </button>
      </div>

      {/* Búsqueda */}
      <div className='relative mb-6'>
        <FiSearch className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
        <input
          type='text'
          placeholder='Buscar por proveedor o producto...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
        />
      </div>

      {/* Tabla */}
      <div className='overflow-hidden bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                ID Proveedor
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Proveedor
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Código Producto
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Producto
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredSuministros?.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                  No hay relaciones de suministro registradas
                </td>
              </tr>
            ) : (
              filteredSuministros?.map((suministro) => (
                <tr
                  key={`${suministro.id_proveedor}-${suministro.codigo_producto}`}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {suministro.id_proveedor}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <FiTruck className='mr-2 text-purple-600' />
                      <div className='text-sm text-gray-900'>
                        {getProveedorName(suministro.id_proveedor)}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {suministro.codigo_producto}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {getProductoName(suministro.codigo_producto)}
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                    <button
                      onClick={() =>
                        handleDelete(
                          suministro.id_proveedor,
                          suministro.codigo_producto
                        )
                      }
                      className='text-red-600 hover:text-red-900'
                    >
                      <FiTrash2 className='w-5 h-5' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Relación */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={closeModal}
              aria-hidden='true'
            />

            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>

            <div className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10'>
              <form onSubmit={handleSubmit}>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Nueva Relación Proveedor-Producto
                    </h3>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='text-gray-400 hover:text-gray-500'
                    >
                      <FiX className='w-6 h-6' />
                    </button>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Proveedor *
                      </label>
                      <select
                        required
                        value={formData.id_proveedor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_proveedor: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      >
                        <option value=''>Seleccionar proveedor</option>
                        {proveedores?.map((proveedor) => (
                          <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombres} {proveedor.apellidos}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Producto *
                      </label>
                      <select
                        required
                        value={formData.codigo_producto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            codigo_producto: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      >
                        <option value=''>Seleccionar producto</option>
                        {productos?.map((producto) => (
                          <option key={producto.codigo} value={producto.codigo}>
                            {producto.codigo} - {producto.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='p-4 border-l-4 border-purple-400 bg-purple-50'>
                      <p className='text-sm text-purple-700'>
                        <strong>Nota:</strong> Esta relación indica que el
                        proveedor seleccionado puede suministrar el producto
                        elegido.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    disabled={createMutation.isPending}
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
                  >
                    {createMutation.isPending ? "Creando..." : "Crear Relación"}
                  </button>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm'
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suministros;
