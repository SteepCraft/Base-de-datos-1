import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Convertir array de objetos a CSV
 * @param {Array} data - Array de objetos
 * @returns {string} - String en formato CSV
 */
const arrayToCSV = (data) => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Agregar encabezados
  csvRows.push(headers.join(","));

  // Agregar datos
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escapar valores que contengan comas o comillas
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

/**
 * Exportar datos a CSV
 * @param {Array} data - Array de objetos con los datos
 * @param {string} filename - Nombre del archivo sin extensión
 */
export const exportToCSV = (data, filename) => {
  const csv = arrayToCSV(data);
  const bom = "\uFEFF"; // BOM para UTF-8
  const blob = new Blob([bom, csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exportar clientes a CSV
 * @param {Array} clientes - Array de clientes
 */
export const exportClientesToCSV = (clientes) => {
  const data = clientes.map((cliente) => ({
    ID: cliente.id,
    Nombres: cliente.nombres,
    Apellidos: cliente.apellidos,
    Dirección: cliente.direccion || "N/A",
    Teléfono: cliente.telefono || "N/A",
  }));

  exportToCSV(data, "Clientes");
};

/**
 * Exportar productos a CSV
 * @param {Array} productos - Array de productos
 */
export const exportProductosToCSV = (productos) => {
  const data = productos.map((producto) => {
    const precio = parseFloat(producto.precio) || 0;
    const existencia = parseInt(producto.num_existencia, 10) || 0;
    return {
      Código: producto.codigo,
      Descripción: producto.descripcion,
      Precio: `$${precio.toFixed(2)}`,
      Existencia: existencia,
      "Valor Total": `$${(precio * existencia).toFixed(2)}`,
    };
  });

  exportToCSV(data, "Productos");
};

/**
 * Exportar inventario a CSV
 * @param {Array} productos - Array de productos con inventario
 */
export const exportInventarioToCSV = (productos) => {
  const data = productos.map((producto) => {
    const precio = parseFloat(producto.precio) || 0;
    const existencia = parseInt(producto.num_existencia, 10) || 0;
    return {
      Código: producto.codigo,
      Producto: producto.descripcion,
      "Stock Actual": existencia,
      Precio: `$${precio.toFixed(2)}`,
      "Valor Stock": `$${(precio * existencia).toFixed(2)}`,
      Estado:
        existencia === 0
          ? "Sin Stock"
          : existencia < 10
            ? "Stock Bajo"
            : "Stock OK",
    };
  });

  exportToCSV(data, "Inventario");
};

/**
 * Exportar proveedores a CSV
 * @param {Array} proveedores - Array de proveedores
 */
export const exportProveedoresToCSV = (proveedores) => {
  const data = proveedores.map((proveedor) => ({
    ID: proveedor.id,
    Nombres: proveedor.nombres,
    Apellidos: proveedor.apellidos,
    Dirección: proveedor.direccion || "N/A",
    Providencia: proveedor.providencia || "N/A",
    Teléfono: proveedor.telefono || "N/A",
  }));

  exportToCSV(data, "Proveedores");
};

/**
 * Exportar ventas a PDF
 * @param {Array} ventas - Array de ventas con detalles
 * @param {Array} clientes - Array de clientes
 */
export const exportVentasToPDF = (ventas, clientes) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Ventas", 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

  // Resumen
  const totalVentas = ventas.reduce((sum, v) => sum + (v.valor_tot || 0), 0);
  doc.setFontSize(12);
  doc.text(`Total de Ventas: ${ventas.length}`, 14, 38);
  doc.text(`Valor Total: $${totalVentas.toFixed(2)}`, 14, 45);

  // Tabla de ventas
  const tableData = ventas.map((venta) => {
    const cliente = clientes?.find((c) => c.id === venta.id_cliente);
    const clienteNombre = cliente
      ? `${cliente.nombres} ${cliente.apellidos}`
      : "N/A";

    return [
      venta.codigo,
      clienteNombre,
      new Date(venta.fecha_venta).toLocaleDateString("es-ES"),
      `$${(venta.valor_tot || 0).toFixed(2)}`,
      venta.detalleVentas?.length || 0,
    ];
  });

  autoTable(doc, {
    startY: 55,
    head: [["Código", "Cliente", "Fecha", "Valor Total", "Productos"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  doc.save("Reporte_Ventas.pdf");
};

/**
 * Generar PDF de venta específica (sin descargar automáticamente)
 * @param {Object} venta - Objeto de venta con detalles
 * @param {Object} cliente - Objeto de cliente
 * @param {Array} productos - Array de productos
 * @returns {Object} - { doc: jsPDF, filename: string }
 */
export const generateVentaPDF = (venta, cliente, productos) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("Detalle de Venta", 14, 20);

  // Información de la venta
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Código: ${venta.codigo}`, 14, 35);
  doc.text(
    `Cliente: ${cliente?.nombres || "N/A"} ${cliente?.apellidos || ""}`,
    14,
    42
  );
  doc.text(
    `Fecha: ${new Date(venta.fecha_venta).toLocaleDateString("es-ES")}`,
    14,
    49
  );

  // Tabla de productos
  const tableData =
    venta.detalleVentas?.map((detalle) => {
      const producto = productos?.find(
        (p) => p.codigo === detalle.codigo_producto
      );
      const cantidad = parseInt(detalle.cant_venta, 10) || 0;
      const precio = parseFloat(detalle.precio_producto) || 0;
      return [
        detalle.codigo_producto,
        producto?.descripcion || "N/A",
        cantidad,
        `$${precio.toFixed(2)}`,
        `$${(cantidad * precio).toFixed(2)}`,
      ];
    }) || [];

  autoTable(doc, {
    startY: 60,
    head: [["Código", "Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `TOTAL: $${(parseFloat(venta.valor_tot) || 0).toFixed(2)}`,
    14,
    finalY
  );

  return { doc, filename: `Venta_${venta.codigo}.pdf` };
};

/**
 * Exportar una venta específica a PDF con detalles (legacy - usa generateVentaPDF)
 * @param {Object} venta - Objeto de venta con detalles
 * @param {Object} cliente - Objeto de cliente
 * @param {Array} productos - Array de productos
 */
export const exportVentaDetalladaPDF = (venta, cliente, productos) => {
  const { doc, filename } = generateVentaPDF(venta, cliente, productos);
  doc.save(filename);
};

/**
 * Exportar compras a PDF
 * @param {Array} compras - Array de compras con detalles
 * @param {Array} proveedores - Array de proveedores
 */
export const exportComprasToPDF = (compras, proveedores) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Compras", 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

  // Resumen
  const totalCompras = compras.reduce(
    (sum, c) => sum + (c.tot_compras || 0),
    0
  );
  doc.setFontSize(12);
  doc.text(`Total de Compras: ${compras.length}`, 14, 38);
  doc.text(`Valor Total: $${totalCompras.toFixed(2)}`, 14, 45);

  // Tabla de compras
  const tableData = compras.map((compra) => {
    const proveedor = proveedores?.find((p) => p.id === compra.id_proveedor);
    const proveedorNombre = proveedor
      ? `${proveedor.nombres} ${proveedor.apellidos}`
      : "N/A";

    return [
      compra.codigo,
      proveedorNombre,
      new Date(compra.fecha_compra).toLocaleDateString("es-ES"),
      `$${(compra.tot_compras || 0).toFixed(2)}`,
      compra.detalleCompras?.length || 0,
    ];
  });

  autoTable(doc, {
    startY: 55,
    head: [["Código", "Proveedor", "Fecha", "Valor Total", "Productos"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 9 },
  });

  doc.save("Reporte_Compras.pdf");
};

/**
 * Exportar inventario a PDF
 * @param {Array} productos - Array de productos
 */
export const exportInventarioToPDF = (productos) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Inventario", 14, 20);

  // Fecha
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

  // Resumen
  const totalProductos = productos.length;
  const valorTotal = productos.reduce((sum, p) => {
    const precio = parseFloat(p.precio) || 0;
    const existencia = parseInt(p.num_existencia, 10) || 0;
    return sum + precio * existencia;
  }, 0);
  const stockBajo = productos.filter(
    (p) => (parseInt(p.num_existencia, 10) || 0) < 10
  ).length;

  doc.setFontSize(12);
  doc.text(`Total Productos: ${totalProductos}`, 14, 38);
  doc.text(`Valor Total Inventario: $${valorTotal.toFixed(2)}`, 14, 45);
  doc.text(`Productos con Stock Bajo: ${stockBajo}`, 14, 52);

  // Tabla
  const tableData = productos.map((p) => {
    const precio = parseFloat(p.precio) || 0;
    const existencia = parseInt(p.num_existencia, 10) || 0;
    return [
      p.codigo,
      p.descripcion,
      existencia,
      `$${precio.toFixed(2)}`,
      `$${(precio * existencia).toFixed(2)}`,
      existencia === 0 ? "Sin Stock" : existencia < 10 ? "Bajo" : "OK",
    ];
  });

  autoTable(doc, {
    startY: 62,
    head: [["Código", "Producto", "Stock", "Precio", "Valor", "Estado"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 8 },
  });

  doc.save("Reporte_Inventario.pdf");
};

/**
 * Generar PDF de compra específica (sin descargar automáticamente)
 * @param {Object} compra - Objeto de compra con detalles
 * @param {Object} proveedor - Objeto de proveedor
 * @param {Array} productos - Array de productos
 * @returns {Object} - { doc: jsPDF, filename: string }
 */
export const generateCompraPDF = (compra, proveedor, productos) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("Detalle de Compra", 14, 20);

  // Información de la compra
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Código: ${compra.codigo}`, 14, 35);
  doc.text(
    `Proveedor: ${proveedor?.nombres || "N/A"} ${proveedor?.apellidos || ""}`,
    14,
    42
  );
  doc.text(
    `Fecha: ${new Date(compra.fecha_compra).toLocaleDateString("es-ES")}`,
    14,
    49
  );

  // Tabla de productos
  const tableData =
    compra.detalleCompras?.map((detalle) => {
      const producto = productos?.find(
        (p) => p.codigo === detalle.codigo_producto
      );
      const precio = parseFloat(detalle.precio_unit) || 0;
      const cantidad = parseInt(detalle.cant_compras, 10) || 0;
      return [
        detalle.codigo_producto,
        producto?.descripcion || "N/A",
        cantidad,
        `$${precio.toFixed(2)}`,
        `$${(cantidad * precio).toFixed(2)}`,
      ];
    }) || [];

  autoTable(doc, {
    startY: 60,
    head: [["Código", "Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 10 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `TOTAL: $${(parseFloat(compra.tot_compras) || 0).toFixed(2)}`,
    14,
    finalY
  );

  return { doc, filename: `Compra_${compra.codigo}.pdf` };
};

/**
 * Exportar una compra específica a PDF con detalles (legacy - usa generateCompraPDF)
 * @param {Object} compra - Objeto de compra con detalles
 * @param {Object} proveedor - Objeto de proveedor
 * @param {Array} productos - Array de productos
 */
export const exportCompraDetalladaPDF = (compra, proveedor, productos) => {
  const { doc, filename } = generateCompraPDF(compra, proveedor, productos);
  doc.save(filename);
};
