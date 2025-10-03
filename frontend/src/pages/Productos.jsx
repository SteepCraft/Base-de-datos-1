import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const Productos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    precio: "",
    num_existencia: "",
  });

  const { data: productos, isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await api.get("/producto");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async data => {
      const response = await api.post("/producto", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productos"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/producto/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productos"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async id => {
      await api.delete(`/producto/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productos"]);
    },
  });

  const openModal = (producto = null) => {
    if (producto) {
      setEditingProducto(producto);
      setFormData({
        codigo: producto.codigo || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        num_existencia: producto.num_existencia || "",
      });
    } else {
      setEditingProducto(null);
      setFormData({
        codigo: "",
        descripcion: "",
        precio: "",
        num_existencia: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProducto(null);
    setFormData({
      codigo: "",
      descripcion: "",
      precio: "",
      num_existencia: "",
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingProducto) {
      updateMutation.mutate({ id: editingProducto.codigo, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = id => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProductos = productos?.filter(producto =>
    producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Productos</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Gestiona el catálogo de productos informáticos
        </p>
      </div>

      {/* Acciones */}
      <div className='flex flex-col justify-between gap-4 mb-6 sm:flex-row'>
        <div className='relative flex-1 max-w-md'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <FiSearch className='w-5 h-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Buscar productos...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <button
          onClick={() => openModal()}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          <FiPlus className='w-5 h-5 mr-2' />
          Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className='overflow-hidden bg-white rounded-lg shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Código
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Descripción
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Precio
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Stock
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Cargando...
                  </td>
                </tr>
              ) : filteredProductos?.length === 0 ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                filteredProductos?.map(producto => (
                  <tr key={producto.codigo} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      {producto.codigo}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      {producto.descripcion}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      ${parseFloat(producto.precio || 0).toFixed(2)}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          producto.num_existencia < 10
                            ? "bg-red-100 text-red-800"
                            : producto.num_existencia < 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {producto.num_existencia}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
                      <button
                        onClick={() => openModal(producto)}
                        className='mr-4 text-blue-600 hover:text-blue-900'
                      >
                        <FiEdit2 className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.codigo)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={closeModal}
            ></div>

            <div className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <form onSubmit={handleSubmit}>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {editingProducto ? "Editar Producto" : "Nuevo Producto"}
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
                    {!editingProducto && (
                      <div>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>
                          Código *
                        </label>
                        <input
                          type='number'
                          required
                          value={formData.codigo}
                          onChange={e =>
                            setFormData({ ...formData, codigo: e.target.value })
                          }
                          className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    )}

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Descripción *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.descripcion}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            descripcion: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Precio *
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        required
                        value={formData.precio}
                        onChange={e =>
                          setFormData({ ...formData, precio: e.target.value })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Stock
                      </label>
                      <input
                        type='number'
                        value={formData.num_existencia}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            num_existencia: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                </div>

                <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
                  >
                    {editingProducto ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm'
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

export default Productos;
