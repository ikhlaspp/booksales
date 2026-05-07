import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // Data statis untuk simulasi statistik (Nantinya bisa diganti dengan state dari API)
  const stats = [
    { title: "Total Users", value: "1,248", increase: "+12%", icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { title: "Total Books", value: "842", increase: "+5%", icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { title: "Total Transactions", value: "3,512", increase: "+18%", icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )},
    { title: "Revenue", value: "Rp 45.2M", increase: "+22%", icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  // Data statis untuk tabel transaksi
  const recentTransactions = [
    { id: "TRX-001", user: "Budi Santoso", book: "The Great Gatsby", date: "05 May 2026", amount: "Rp 150.000", status: "Success" },
    { id: "TRX-002", user: "Siti Aminah", book: "Atomic Habits", date: "04 May 2026", amount: "Rp 120.000", status: "Pending" },
    { id: "TRX-003", user: "Andi Wijaya", book: "1984", date: "04 May 2026", amount: "Rp 95.000", status: "Success" },
    { id: "TRX-004", user: "Rina Kusuma", book: "To Kill a Mockingbird", date: "03 May 2026", amount: "Rp 110.000", status: "Failed" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Overview Dashboard</h2>
          <p className="text-gray-500 mt-1">Pantau statistik dan aktivitas terbaru toko buku Anda.</p>
        </div>
        <Link 
          to="/admin/books/create" 
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Buku Baru
        </Link>
      </div>

      {/* Stats Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                {stat.increase}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
          <Link to="/admin/transactions" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">ID Transaksi</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">Pelanggan</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">Buku</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">Jumlah</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((trx, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{trx.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{trx.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{trx.book}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{trx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{trx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      trx.status === 'Success' ? 'bg-green-50 text-green-700' :
                      trx.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
