import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rausch"></div>
      </div>
    );
  }

  const dashboardData = data || {};
  const recentTransactions = dashboardData.recent_transactions || [];
  const salesTrend = dashboardData.sales_trend || [];

  const stats = [
    { title: "Total Users", value: dashboardData.total_users || 0, increase: dashboardData.users_increase || "+0%", icon: (
      <svg className="w-6 h-6 text-rausch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { title: "Total Books", value: dashboardData.total_books || 0, increase: dashboardData.books_increase || "+0%", icon: (
      <svg className="w-6 h-6 text-rausch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { title: "Total Transactions", value: dashboardData.total_transactions || 0, increase: dashboardData.transactions_increase || "+0%", icon: (
      <svg className="w-6 h-6 text-rausch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )},
    { title: "Revenue", value: dashboardData.revenue || "Rp 0", increase: dashboardData.revenue_increase || "+0%", icon: (
      <svg className="w-6 h-6 text-rausch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-8">
      {/* Bagian Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink tracking-tight">Overview Dashboard</h2>
          <p className="text-body-sm text-muted mt-1">Pantau statistik dan aktivitas terbaru toko buku Anda.</p>
        </div>
      </div>

      {/* Kartu Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-canvas p-6 rounded-md border border-hairline hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-surface-soft rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-ink bg-surface-strong px-2.5 py-1 rounded-full">
                {stat.increase}
              </span>
            </div>
            <div>
              <p className="text-body-sm text-muted">{stat.title}</p>
              <h3 className="text-display-lg text-ink mt-1 font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik Tren Penjualan */}
      <div className="bg-canvas p-6 rounded-md border border-hairline">
        <h3 className="text-title-md font-bold text-ink mb-6">Tren Buku Terbeli</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff385c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff385c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#717171" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#717171" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #EBEBEB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#dddddd', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area type="monotone" dataKey="terbeli" stroke="#ff385c" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-canvas rounded-md border border-hairline overflow-hidden">
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center">
          <h3 className="text-title-md font-bold text-ink">Transaksi Terbaru</h3>
          <Link to="/admin/transactions" className="text-body-sm text-rausch hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-soft">
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">ID Transaksi</th>
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">Pelanggan</th>
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">Buku</th>
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">Tanggal</th>
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">Jumlah</th>
                <th className="px-6 py-4 text-body-sm font-medium text-muted whitespace-nowrap border-b border-hairline">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {recentTransactions.map((trx, index) => (
                <tr key={index} className="hover:bg-surface-soft/50 transition-colors">
                  <td className="px-6 py-4 text-body-sm font-medium text-ink whitespace-nowrap">{trx.id}</td>
                  <td className="px-6 py-4 text-body-sm text-muted whitespace-nowrap">{trx.user}</td>
                  <td className="px-6 py-4 text-body-sm text-muted whitespace-nowrap">{trx.book}</td>
                  <td className="px-6 py-4 text-body-sm text-muted whitespace-nowrap">{trx.date}</td>
                  <td className="px-6 py-4 text-body-sm font-medium text-ink whitespace-nowrap">{trx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-strong text-ink">
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted">Belum ada transaksi terbaru</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
