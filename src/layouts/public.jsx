import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] font-sans text-[#222222]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}