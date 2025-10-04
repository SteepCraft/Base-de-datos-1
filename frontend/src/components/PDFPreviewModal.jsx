import { useState, useEffect } from "react";
import { FiX, FiDownload } from "react-icons/fi";

const PDFPreviewModal = ({ isOpen, onClose, pdfDoc, filename }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (isOpen && pdfDoc) {
      // Generar el PDF como blob URL para preview
      const pdfBlob = pdfDoc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Cleanup al cerrar
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [isOpen, pdfDoc]);

  const handleDownload = () => {
    if (pdfDoc && filename) {
      pdfDoc.save(filename);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Overlay */}
        <div
          className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
          onClick={onClose}
          aria-hidden='true'
        />

        {/* Modal */}
        <div className='relative inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl z-10'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Vista Previa del Documento
            </h3>
            <div className='flex gap-2'>
              <button
                onClick={handleDownload}
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                <FiDownload className='w-4 h-4 mr-2' />
                Descargar PDF
              </button>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-500'
              >
                <FiX className='w-6 h-6' />
              </button>
            </div>
          </div>

          {/* PDF Preview */}
          <div className='px-6 py-4 bg-gray-100' style={{ height: "70vh" }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className='w-full h-full border-0 rounded'
                title='PDF Preview'
              />
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>Cargando vista previa...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
