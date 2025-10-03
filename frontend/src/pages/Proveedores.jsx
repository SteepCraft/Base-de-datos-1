import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

import api from "../config/api";

const Proveedores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    providencia: "",
    telefono: "",
  });

  const { data: proveedores, isLoading } = useQuery({
    queryKey: ["proveedores"],
    queryFn: async () => {
      const response = await api.get("/proveedor");
      return response.data;
    },
  });

  // Definir closeModal antes de las mutaciones
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProveedor(null);
    setFormData({
      id: "",
      nombres: "",
      apellidos: "",
      direccion: "",
      providencia: "",
      telefono: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/proveedor", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["proveedores"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/proveedor/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["proveedores"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/proveedor/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["proveedores"]);
    },
  });

  const openModal = (proveedor = null) => {
    if (proveedor) {
      setEditingProveedor(proveedor);
      setFormData({
        id: proveedor.id || "",
        nombres: proveedor.nombres || "",
        apellidos: proveedor.apellidos || "",
        direccion: proveedor.direccion || "",
        providencia: proveedor.providencia || "",
        telefono: proveedor.telefono || "",
      });
    } else {
      setEditingProveedor(null);
      setFormData({
        id: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        providencia: "",
        telefono: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProveedor) {
      updateMutation.mutate({ id: editingProveedor.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este proveedor?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProveedores = proveedores?.filter((proveedor) =>
    `${proveedor.nombres} ${proveedor.apellidos}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Proveedores</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Gestiona los proveedores de productos
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
            placeholder='Buscar proveedores...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <button
          onClick={() => openModal()}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          <FiPlus className='w-5 h-5 mr-2' />
          Nuevo Proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className='overflow-hidden bg-white rounded-lg shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  ID
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Nombres
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Apellidos
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Dirección
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Provincia
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Teléfono
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
                    colSpan='7'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Cargando...
                  </td>
                </tr>
              ) : filteredProveedores?.length === 0 ? (
                <tr>
                  <td
                    colSpan='7'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No hay proveedores registrados
                  </td>
                </tr>
              ) : (
                filteredProveedores?.map((proveedor) => (
                  <tr key={proveedor.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      {proveedor.id}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      {proveedor.nombres}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      {proveedor.apellidos}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {proveedor.direccion}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {proveedor.providencia}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {proveedor.telefono}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
                      <button
                        onClick={() => openModal(proveedor)}
                        className='mr-4 text-blue-600 hover:text-blue-900'
                      >
                        <FiEdit2 className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(proveedor.id)}
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
                      {editingProveedor
                        ? "Editar Proveedor"
                        : "Nuevo Proveedor"}
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
                    {!editingProveedor && (
                      <div>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>
                          ID *
                        </label>
                        <input
                          type='text'
                          required
                          maxLength={10}
                          value={formData.id}
                          onChange={(e) =>
                            setFormData({ ...formData, id: e.target.value })
                          }
                          className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    )}

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Nombres *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.nombres}
                        onChange={(e) =>
                          setFormData({ ...formData, nombres: e.target.value })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Apellidos *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.apellidos}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apellidos: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Dirección *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            direccion: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Provincia *
                      </label>
                      <input
                        type='text'
                        required
                        value={formData.providencia}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            providencia: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Teléfono *
                      </label>
                      <input
                        type='tel'
                        required
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
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
                    {editingProveedor ? "Actualizar" : "Crear"}
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

export default Proveedores;
