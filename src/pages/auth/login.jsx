import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
      }
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      
      if (!formData.email || !formData.password) {
          setErrors({ submit: "Email dan password tidak boleh kosong" });
          return;
      }

      setIsLoading(true);
      
      try {
          const response = await fetch('http://localhost:8000/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              body: JSON.stringify(formData)
          });
          
          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || 'Gagal login, periksa kembali email dan password Anda.');
          }

          console.log("Data Response API:", data);

          const user = data?.user || data?.data?.user;
          const token = data?.access_token || data?.token || data?.data?.token;

          if (!token) {
              throw new Error('Format response dari server tidak valid (token tidak ditemukan).');
          }

          localStorage.setItem('token', token);
          localStorage.setItem('user_id', user?.id || '');
          localStorage.setItem('user_role', data?.role || user?.role || 'admin');
          
          const from = location.state?.from?.pathname || '/admin';
          navigate(from, { replace: true });
          
      } catch (error) {
          setErrors({ submit: error.message || "Terjadi kesalahan pada sistem." });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="max-w-md w-full">
            {/* Logo / Brand Mark */}
            <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white font-bold text-3xl">B</span>
                </div>
            </div>
            
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Selamat Datang</h2>
                <p className="text-gray-500">Silakan masukkan detail akun Anda untuk masuk.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
                {errors.submit && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        {errors.submit}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
                            placeholder="contoh@email.com"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? 'Memproses...' : 'Sign in'}
                </button>
                
                <p className="text-sm text-center text-gray-500 pt-4">
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Daftar di sini
                    </Link>
                </p>
            </form>
        </div>
    </div>
  );
}
