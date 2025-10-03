import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiUsers,
  FiShield,
} from "react-icons/fi";

import api from "../config/api";
import { useAuth } from "../context/AuthContext";

const Usuarios = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    contrasena: "",
  });

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await api.get("/usuario");
      return response.data;
    },
    enabled: user?.id === 1, // Solo cargar si es super admin
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      email: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      contrasena: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/usuario", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/usuario/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/usuario/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
    },
  });

  // Solo permitir acceso a super admin (id=1)
  if (!user || user.id !== 1) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <FiShield className='w-16 h-16 mx-auto mb-4 text-red-600' />
          <h2 className='text-2xl font-bold text-gray-900'>Acceso Denegado</h2>
          <p className='mt-2 text-gray-600'>
            Solo el Super Administrador puede acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUsuario) {
      // Si no se cambió la contraseña, no enviarla
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.contrasena) {
        delete dataToUpdate.contrasena;
      }
      updateMutation.mutate({ id: editingUsuario.id, data: dataToUpdate });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      email: usuario.email,
      nombres: usuario.nombres || "",
      apellidos: usuario.apellidos || "",
      telefono: usuario.telefono || "",
      contrasena: "", // No mostrar contraseña actual
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (id === 1) {
      alert("No puedes eliminar al Super Administrador");
      return;
    }

    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUsuarios = usuarios?.filter(
    (usuario) =>
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-600'>Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='flex items-center text-3xl font-bold text-gray-900'>
            <FiShield className='mr-3 text-red-600' />
            Gestión de Usuarios
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Solo accesible para el Super Administrador
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700'
        >
          <FiPlus className='mr-2' />
          Nuevo Usuario
        </button>
      </div>

      {/* Búsqueda */}
      <div className='relative mb-6'>
        <FiSearch className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
        <input
          type='text'
          placeholder='Buscar usuario...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
        />
      </div>

      {/* Tabla */}
      <div className='overflow-hidden bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                ID
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Email
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Nombres
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Apellidos
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Teléfono
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Rol
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredUsuarios?.length === 0 ? (
              <tr>
                <td colSpan='7' className='px-6 py-4 text-center text-gray-500'>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              filteredUsuarios?.map((usuario) => (
                <tr key={usuario.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {usuario.id}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{usuario.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {usuario.nombres}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {usuario.apellidos}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {usuario.telefono}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {usuario.id === 1 ? (
                      <span className='inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full'>
                        Super Admin
                      </span>
                    ) : (
                      <span className='inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full'>
                        Usuario
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        <FiEdit2 className='w-5 h-5' />
                      </button>
                      {usuario.id !== 1 && (
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          <FiTrash2 className='w-5 h-5' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

            <div className='relative z-10 inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <form onSubmit={handleSubmit}>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='flex items-center text-lg font-medium text-gray-900'>
                      <FiUsers className='mr-2' />
                      {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
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
                        Email *
                      </label>
                      <input
                        type='email'
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                      />
                    </div>

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
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
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
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Teléfono
                      </label>
                      <input
                        type='tel'
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Contraseña{" "}
                        {editingUsuario ? "(dejar vacío para mantener)" : "*"}
                      </label>
                      <input
                        type='password'
                        required={!editingUsuario}
                        value={formData.contrasena}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contrasena: e.target.value,
                          })
                        }
                        className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                        placeholder={
                          editingUsuario ? "Dejar vacío para no cambiar" : ""
                        }
                      />
                    </div>

                    {editingUsuario?.id === 1 && (
                      <div className='p-4 border-l-4 border-red-400 bg-red-50'>
                        <p className='text-sm text-red-700'>
                          <strong>Advertencia:</strong> Estás editando al Super
                          Administrador. Ten cuidado con los cambios.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
                  >
                    {editingUsuario ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm'
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

export default Usuarios;
