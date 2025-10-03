import { useState, useEffect } from "react";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <div className='flex items-center justify-center w-16 h-16 mx-auto bg-blue-600 rounded-full'>
            <span className='text-2xl font-bold text-white'>IT</span>
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>
            Tienda Informática
          </h2>
          <p className='mt-2 text-sm text-center text-gray-600'>
            Inicia sesión para acceder al sistema
          </p>
        </div>

        <form
          className='p-8 mt-8 space-y-6 bg-white shadow-lg rounded-xl'
          onSubmit={handleSubmit}
        >
          {error && (
            <div className='p-4 rounded-md bg-red-50'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <FiAlertCircle className='w-5 h-5 text-red-400' />
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block mb-1 text-sm font-medium text-gray-700'
              >
                Correo electrónico
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <FiMail className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='usuario@ejemplo.com'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block mb-1 text-sm font-medium text-gray-700'
              >
                Contraseña
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <FiLock className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='••••••••'
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-lg group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className='flex items-center'>
                  <svg
                    className='w-5 h-5 mr-3 -ml-1 text-white animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                     />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                     />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
