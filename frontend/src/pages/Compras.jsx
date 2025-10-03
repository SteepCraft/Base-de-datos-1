import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiPlus, FiEye, FiSearch, FiX, FiShoppingBag } from "react-icons/fi";

import api from "../config/api";

const Compras = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCompra, setViewingCompra] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    codigo: "",
    id_proveedor: "",
    productos: [],
  });

  const [productToAdd, setProductToAdd] = useState({
    codigo_producto: "",
    cant_compra: 1,
    precio_producto: "",
  });

  const { data: compras, isLoading } = useQuery({
    queryKey: ["compras"],
    queryFn: async () => {
      const response = await api.get("/compra");
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
      codigo: "",
      id_proveedor: "",
      productos: [],
    });
    setProductToAdd({
      codigo_producto: "",
      cant_compra: 1,
      precio_producto: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/compra", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["compras"]);
      queryClient.invalidateQueries(["productos"]); // Actualizar stock
      queryClient.invalidateQueries(["inventario"]);
      closeModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.productos.length === 0) {
      alert("Debe agregar al menos un producto a la compra");
      return;
    }

    createMutation.mutate(formData);
  };

  const addProductToCompra = () => {
    if (
      !productToAdd.codigo_producto ||
      !productToAdd.cant_compra ||
      !productToAdd.precio_producto
    ) {
      alert("Complete todos los campos del producto");
      return;
    }

    const producto = productos?.find(
      (p) => p.codigo === Number.parseInt(productToAdd.codigo_producto, 10)
    );

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    setFormData({
      ...formData,
      productos: [
        ...formData.productos,
        {
          codigo_producto: Number.parseInt(productToAdd.codigo_producto, 10),
          cant_compra: Number.parseInt(productToAdd.cant_compra, 10),
          precio_producto: Number.parseFloat(productToAdd.precio_producto),
          nombre_producto: producto.descripcion,
        },
      ],
    });

    setProductToAdd({
      codigo_producto: "",
      cant_compra: 1,
      precio_producto: "",
    });
  };

  const removeProductFromCompra = (index) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index),
    });
  };

  const getProveedorName = (id) => {
    const proveedor = proveedores?.find((p) => p.id === id);
    return proveedor ? `${proveedor.nombres} ${proveedor.apellidos}` : "N/A";
  };

  const filteredCompras = compras?.filter(
    (compra) =>
      compra.codigo?.toString().includes(searchTerm) ||
      getProveedorName(compra.id_proveedor)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-600'>Cargando compras...</div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Compras a Proveedores
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Gestiona las compras de productos a proveedores
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700'
        >
          <FiPlus className='mr-2' />
          Nueva Compra
        </button>
      </div>

      {/* Búsqueda */}
      <div className='relative mb-6'>
        <FiSearch className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
        <input
          type='text'
          placeholder='Buscar compra por código o proveedor...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
        />
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
                Proveedor
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Fecha
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Total
              </th>
              <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredCompras?.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                  No hay compras registradas
                </td>
              </tr>
            ) : (
              filteredCompras?.map((compra) => (
                <tr key={compra.codigo} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {compra.codigo}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {getProveedorName(compra.id_proveedor)}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {new Date(compra.fecha_compra).toLocaleDateString(
                        "es-ES"
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-semibold text-green-600'>
                      ${Number.parseFloat(compra.tot_compras || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                    <button
                      onClick={() => setViewingCompra(compra)}
                      className='text-green-600 hover:text-green-900'
                    >
                      <FiEye className='w-5 h-5' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Compra */}
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

            <div className='relative z-10 inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
              <form onSubmit={handleSubmit}>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='flex items-center text-lg font-medium text-gray-900'>
                      <FiShoppingBag className='mr-2' />
                      Nueva Compra a Proveedor
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
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>
                          Código Compra *
                        </label>
                        <input
                          type='number'
                          required
                          value={formData.codigo}
                          onChange={(e) =>
                            setFormData({ ...formData, codigo: e.target.value })
                          }
                          className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        />
                      </div>

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
                          className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        >
                          <option value=''>Seleccionar proveedor</option>
                          {proveedores?.map((proveedor) => (
                            <option key={proveedor.id} value={proveedor.id}>
                              {proveedor.nombres} {proveedor.apellidos}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Agregar Productos */}
                    <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg'>
                      <h4 className='mb-3 text-sm font-medium text-gray-700'>
                        Agregar Producto
                      </h4>
                      <div className='grid grid-cols-4 gap-2'>
                        <select
                          value={productToAdd.codigo_producto}
                          onChange={(e) =>
                            setProductToAdd({
                              ...productToAdd,
                              codigo_producto: e.target.value,
                            })
                          }
                          className='block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        >
                          <option value=''>Seleccionar producto</option>
                          {productos?.map((producto) => (
                            <option
                              key={producto.codigo}
                              value={producto.codigo}
                            >
                              {producto.descripcion}
                            </option>
                          ))}
                        </select>

                        <input
                          type='number'
                          min='1'
                          placeholder='Cantidad'
                          value={productToAdd.cant_compra}
                          onChange={(e) =>
                            setProductToAdd({
                              ...productToAdd,
                              cant_compra: e.target.value,
                            })
                          }
                          className='block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        />

                        <input
                          type='number'
                          step='0.01'
                          placeholder='Precio'
                          value={productToAdd.precio_producto}
                          onChange={(e) =>
                            setProductToAdd({
                              ...productToAdd,
                              precio_producto: e.target.value,
                            })
                          }
                          className='block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        />

                        <button
                          type='button'
                          onClick={addProductToCompra}
                          className='px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700'
                        >
                          <FiPlus className='inline mr-1' /> Agregar
                        </button>
                      </div>
                    </div>

                    {/* Lista de Productos */}
                    {formData.productos.length > 0 && (
                      <div className='overflow-hidden border rounded-lg'>
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-4 py-2 text-xs text-left text-gray-500'>
                                Producto
                              </th>
                              <th className='px-4 py-2 text-xs text-left text-gray-500'>
                                Cantidad
                              </th>
                              <th className='px-4 py-2 text-xs text-left text-gray-500'>
                                Precio
                              </th>
                              <th className='px-4 py-2 text-xs text-left text-gray-500'>
                                Subtotal
                              </th>
                              <th className='px-4 py-2 text-xs text-left text-gray-500'>
                                Acción
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            {formData.productos.map((producto, index) => (
                              <tr key={index}>
                                <td className='px-4 py-2 text-sm'>
                                  {producto.nombre_producto}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  {producto.cant_compra}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  ${producto.precio_producto.toFixed(2)}
                                </td>
                                <td className='px-4 py-2 text-sm font-semibold'>
                                  $
                                  {(
                                    producto.cant_compra *
                                    producto.precio_producto
                                  ).toFixed(2)}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      removeProductFromCompra(index)
                                    }
                                    className='text-red-600 hover:text-red-900'
                                  >
                                    <FiX />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className='bg-gray-50'>
                              <td
                                colSpan='3'
                                className='px-4 py-2 text-sm font-bold text-right'
                              >
                                Total:
                              </td>
                              <td className='px-4 py-2 text-sm font-bold text-green-600'>
                                $
                                {formData.productos
                                  .reduce(
                                    (sum, p) =>
                                      sum + p.cant_compra * p.precio_producto,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    disabled={createMutation.isPending}
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
                  >
                    {createMutation.isPending ? "Creando..." : "Crear Compra"}
                  </button>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm'
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      {viewingCompra && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={() => setViewingCompra(null)}
              aria-hidden='true'
            />

            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>

            <div className='relative z-10 inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'>
              <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Detalle de Compra #{viewingCompra.codigo}
                  </h3>
                  <button
                    onClick={() => setViewingCompra(null)}
                    className='text-gray-400 hover:text-gray-500'
                  >
                    <FiX className='w-6 h-6' />
                  </button>
                </div>

                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>
                        Proveedor
                      </p>
                      <p className='text-sm text-gray-900'>
                        {getProveedorName(viewingCompra.id_proveedor)}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Fecha</p>
                      <p className='text-sm text-gray-900'>
                        {new Date(
                          viewingCompra.fecha_compra
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>

                  {viewingCompra.detalleCompras && (
                    <div className='overflow-hidden border rounded-lg'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th className='px-4 py-2 text-xs text-left text-gray-500'>
                              Producto
                            </th>
                            <th className='px-4 py-2 text-xs text-left text-gray-500'>
                              Cantidad
                            </th>
                            <th className='px-4 py-2 text-xs text-left text-gray-500'>
                              Precio
                            </th>
                            <th className='px-4 py-2 text-xs text-left text-gray-500'>
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {viewingCompra.detalleCompras.map((detalle) => (
                            <tr key={detalle.codigo_producto}>
                              <td className='px-4 py-2 text-sm'>
                                {detalle.producto?.descripcion || "N/A"}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                {detalle.cant_compra}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                $
                                {Number.parseFloat(
                                  detalle.precio_producto
                                ).toFixed(2)}
                              </td>
                              <td className='px-4 py-2 text-sm font-semibold'>
                                $
                                {(
                                  detalle.cant_compra * detalle.precio_producto
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className='flex justify-end pt-4 border-t'>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>Total Compra</p>
                      <p className='text-2xl font-bold text-green-600'>
                        $
                        {Number.parseFloat(
                          viewingCompra.tot_compras || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  onClick={() => setViewingCompra(null)}
                  className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm'
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
