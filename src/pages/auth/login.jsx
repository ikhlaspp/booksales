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

          const userRole = data?.role || user?.role || 'user'; 
          
          localStorage.setItem('token', token);
          localStorage.setItem('user_id', user?.id || '');
          localStorage.setItem('user_name', user?.name || '');
          localStorage.setItem('user_role', userRole);

          window.dispatchEvent(new Event('authChange'));

          let defaultPath = '/';
          if (userRole === 'admin') {
              defaultPath = '/admin';
          } else if (userRole === 'user' || userRole === 'customer') {
              defaultPath = '/profile'; 
          }

          const from = location.state?.from?.pathname || defaultPath;
          navigate(from, { replace: true });
          
      } catch (error) {
          setErrors({ submit: error.message || "Terjadi kesalahan pada sistem." });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex-1 bg-[#ffffff] flex items-center justify-center p-4 py-12 font-sans text-[#222222]">
        <div className="max-w-md w-full">
            <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-[#ff385c] rounded-full flex items-center justify-center shadow-lg shadow-[#ff385c]/30">
                    <span className="text-white font-bold text-3xl">B</span>
                </div>
            </div>
            
            <div className="text-center mb-10">
                <h2 className="text-[28px] font-bold mb-2 tracking-tight text-[#222222]">Selamat Datang</h2>
                <p className="text-[16px] text-[#6a6a6a]">Silakan masukkan detail akun Anda untuk masuk.</p>
                {location.state?.message && (
                    <div className="mt-4 p-3 text-[14px] font-medium text-[#c13515] bg-[#ffd1da]/30 rounded-[8px] border border-[#ffd1da]">
                        {location.state.message}
                    </div>
                )}
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
                {errors.submit && (
                    <div className="p-3 text-[14px] font-medium text-[#c13515] bg-[#ffd1da]/30 rounded-[8px] border border-[#ffd1da]">
                        {errors.submit}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative h-[56px] rounded-[8px] border border-[#dddddd] bg-[#ffffff] transition-colors focus-within:border-2 focus-within:border-[#222222]">
                        <label className="absolute left-3 top-2 text-[12px] font-medium text-[#6a6a6a]">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="absolute bottom-0 left-0 w-full bg-transparent px-3 pb-2 pt-6 text-[16px] text-[#222222] outline-none"
                            placeholder="contoh@email.com"
                        />
                    </div>
                    <div className="relative h-[56px] rounded-[8px] border border-[#dddddd] bg-[#ffffff] transition-colors focus-within:border-2 focus-within:border-[#222222]">
                        <label className="absolute left-3 top-2 text-[12px] font-medium text-[#6a6a6a]">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            className="absolute bottom-0 left-0 w-full bg-transparent pl-3 pr-10 pb-2 pt-6 text-[16px] text-[#222222] outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a6a6a] hover:text-[#222222] focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                )}
                            </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#ff385c] px-4 text-[16px] font-medium text-white transition-colors duration-200 hover:bg-[#e00b41] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? 'Memproses...' : 'Sign in'}
                </button>
                
                <p className="pt-4 text-center text-[14px] text-[#6a6a6a]">
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-[#222222] underline transition-colors hover:text-[#ff385c]"
                    >
                        Daftar di sini
                    </Link>
                </p>
            </form>
        </div>
    </div>
  );
}
