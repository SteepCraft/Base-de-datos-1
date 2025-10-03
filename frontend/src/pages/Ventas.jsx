import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/api";
import { FiPlus, FiEye, FiSearch, FiX, FiShoppingCart } from "react-icons/fi";

const Ventas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingVenta, setViewingVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    codigo: "",
    id_cliente: "",
    productos: [],
  });

  const [productToAdd, setProductToAdd] = useState({
    codigo_producto: "",
    cant_venta: 1,
    precio_producto: "",
  });

  const { data: ventas, isLoading } = useQuery({
    queryKey: ["ventas"],
    queryFn: async () => {
      const response = await api.get("/venta");
      return response.data;
    },
  });

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

  const { data: detallesVenta } = useQuery({
    queryKey: ["detalles-venta"],
    queryFn: async () => {
      const response = await api.get("/detalle-venta");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async data => {
      // Primero crear la venta
      const ventaResponse = await api.post("/venta", {
        codigo: data.codigo,
        id_cliente: data.id_cliente,
        fecha_venta: new Date().toISOString(),
        valor_tot: data.valor_tot,
      });

      // Luego crear los detalles de venta
      for (const producto of data.productos) {
        await api.post("/detalle-venta", {
          venta_codigo: data.codigo,
          codigo_producto: producto.codigo_producto,
          cant_venta: producto.cant_venta,
          precio_producto: producto.precio_producto,
        });
      }

      return ventaResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ventas"]);
      queryClient.invalidateQueries(["detalles-venta"]);
      closeModal();
    },
  });

  const openModal = () => {
    setFormData({
      codigo: "",
      id_cliente: "",
      productos: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      codigo: "",
      id_cliente: "",
      productos: [],
    });
    setProductToAdd({
      codigo_producto: "",
      cant_venta: 1,
      precio_producto: "",
    });
  };

  const handleAddProduct = () => {
    if (
      !productToAdd.codigo_producto ||
      !productToAdd.cant_venta ||
      !productToAdd.precio_producto
    ) {
      alert("Complete todos los campos del producto");
      return;
    }

    const producto = productos?.find(
      p => p.codigo === parseInt(productToAdd.codigo_producto)
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
          ...productToAdd,
          descripcion: producto.descripcion,
        },
      ],
    });

    setProductToAdd({
      codigo_producto: "",
      cant_venta: 1,
      precio_producto: "",
    });
  };

  const handleRemoveProduct = index => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formData.productos.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    const valor_tot = formData.productos.reduce(
      (sum, p) => sum + parseFloat(p.precio_producto) * parseInt(p.cant_venta),
      0
    );

    createMutation.mutate({
      ...formData,
      valor_tot,
    });
  };

  const viewDetails = venta => {
    const detalles =
      detallesVenta?.filter(d => d.venta_codigo === venta.codigo) || [];
    setViewingVenta({ ...venta, detalles });
  };

  const filteredVentas = ventas?.filter(venta => {
    const cliente = clientes?.find(c => c.id === venta.id_cliente);
    const clienteNombre = cliente
      ? `${cliente.nombres} ${cliente.apellidos}`
      : "";
    return (
      venta.codigo.toString().includes(searchTerm) ||
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getClienteName = id_cliente => {
    const cliente = clientes?.find(c => c.id === id_cliente);
    return cliente ? `${cliente.nombres} ${cliente.apellidos}` : "N/A";
  };

  const getProductName = codigo_producto => {
    const producto = productos?.find(p => p.codigo === codigo_producto);
    return producto ? producto.descripcion : "N/A";
  };

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Ventas</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Gestiona las ventas realizadas a los clientes
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
            placeholder='Buscar ventas...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <button
          onClick={openModal}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          <FiPlus className='w-5 h-5 mr-2' />
          Nueva Venta
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
                  Cliente
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Fecha
                </th>
                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                  Total
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
              ) : filteredVentas?.length === 0 ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                filteredVentas?.map(venta => (
                  <tr key={venta.codigo} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      #{venta.codigo}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      {getClienteName(venta.id_cliente)}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {new Date(venta.fecha_venta).toLocaleDateString("es-ES")}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 whitespace-nowrap'>
                      ${parseFloat(venta.valor_tot || 0).toFixed(2)}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
                      <button
                        onClick={() => viewDetails(venta)}
                        className='text-blue-600 hover:text-blue-900'
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
      </div>

      {/* Modal Nueva Venta */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={closeModal}
            ></div>

            <div className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
              <form onSubmit={handleSubmit}>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='flex items-center text-lg font-medium text-gray-900'>
                      <FiShoppingCart className='mr-2' />
                      Nueva Venta
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
                          Código Venta *
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

                      <div>
                        <label className='block mb-1 text-sm font-medium text-gray-700'>
                          Cliente *
                        </label>
                        <select
                          required
                          value={formData.id_cliente}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              id_cliente: e.target.value,
                            })
                          }
                          className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                          <option value=''>Seleccione un cliente</option>
                          {clientes?.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nombres} {cliente.apellidos}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Agregar productos */}
                    <div className='pt-4 border-t'>
                      <h4 className='mb-3 text-sm font-medium text-gray-900'>
                        Agregar Productos
                      </h4>
                      <div className='grid grid-cols-4 gap-2 mb-2'>
                        <select
                          value={productToAdd.codigo_producto}
                          onChange={e => {
                            const producto = productos?.find(
                              p => p.codigo === parseInt(e.target.value)
                            );
                            setProductToAdd({
                              ...productToAdd,
                              codigo_producto: e.target.value,
                              precio_producto: producto?.precio || "",
                            });
                          }}
                          className='col-span-2 px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        >
                          <option value=''>Seleccione producto</option>
                          {productos?.map(producto => (
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
                          value={productToAdd.cant_venta}
                          onChange={e =>
                            setProductToAdd({
                              ...productToAdd,
                              cant_venta: e.target.value,
                            })
                          }
                          className='px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        />
                        <button
                          type='button'
                          onClick={handleAddProduct}
                          className='px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700'
                        >
                          <FiPlus className='inline' />
                        </button>
                      </div>
                    </div>

                    {/* Lista de productos */}
                    {formData.productos.length > 0 && (
                      <div className='overflow-hidden border rounded-lg'>
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                                Producto
                              </th>
                              <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                                Cantidad
                              </th>
                              <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                                Precio
                              </th>
                              <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                                Subtotal
                              </th>
                              <th className='px-4 py-2'></th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200'>
                            {formData.productos.map((producto, index) => (
                              <tr key={index}>
                                <td className='px-4 py-2 text-sm'>
                                  {producto.descripcion}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  {producto.cant_venta}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  $
                                  {parseFloat(producto.precio_producto).toFixed(
                                    2
                                  )}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  $
                                  {(
                                    parseFloat(producto.precio_producto) *
                                    parseInt(producto.cant_venta)
                                  ).toFixed(2)}
                                </td>
                                <td className='px-4 py-2 text-sm'>
                                  <button
                                    type='button'
                                    onClick={() => handleRemoveProduct(index)}
                                    className='text-red-600 hover:text-red-900'
                                  >
                                    <FiX />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className='bg-gray-50'>
                            <tr>
                              <td
                                colSpan='3'
                                className='px-4 py-2 text-sm font-medium text-right'
                              >
                                Total:
                              </td>
                              <td className='px-4 py-2 text-sm font-bold'>
                                $
                                {formData.productos
                                  .reduce(
                                    (sum, p) =>
                                      sum +
                                      parseFloat(p.precio_producto) *
                                        parseInt(p.cant_venta),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    disabled={createMutation.isPending}
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
                  >
                    Crear Venta
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

      {/* Modal Ver Detalles */}
      {viewingVenta && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={() => setViewingVenta(null)}
            ></div>

            <div className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'>
              <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Detalle de Venta #{viewingVenta.codigo}
                  </h3>
                  <button
                    onClick={() => setViewingVenta(null)}
                    className='text-gray-400 hover:text-gray-500'
                  >
                    <FiX className='w-6 h-6' />
                  </button>
                </div>

                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>
                        Cliente
                      </p>
                      <p className='text-sm text-gray-900'>
                        {getClienteName(viewingVenta.id_cliente)}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Fecha</p>
                      <p className='text-sm text-gray-900'>
                        {new Date(viewingVenta.fecha_venta).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className='overflow-hidden border rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                            Producto
                          </th>
                          <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                            Cantidad
                          </th>
                          <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                            Precio
                          </th>
                          <th className='px-4 py-2 text-xs font-medium text-left text-gray-500'>
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {viewingVenta.detalles?.map((detalle, index) => (
                          <tr key={index}>
                            <td className='px-4 py-2 text-sm'>
                              {getProductName(detalle.codigo_producto)}
                            </td>
                            <td className='px-4 py-2 text-sm'>
                              {detalle.cant_venta}
                            </td>
                            <td className='px-4 py-2 text-sm'>
                              ${parseFloat(detalle.precio_producto).toFixed(2)}
                            </td>
                            <td className='px-4 py-2 text-sm'>
                              $
                              {(
                                parseFloat(detalle.precio_producto) *
                                parseInt(detalle.cant_venta)
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className='bg-gray-50'>
                        <tr>
                          <td
                            colSpan='3'
                            className='px-4 py-2 text-sm font-medium text-right'
                          >
                            Total:
                          </td>
                          <td className='px-4 py-2 text-sm font-bold'>
                            $
                            {parseFloat(viewingVenta.valor_tot || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  onClick={() => setViewingVenta(null)}
                  className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm'
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

export default Ventas;
