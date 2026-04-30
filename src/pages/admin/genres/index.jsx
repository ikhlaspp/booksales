import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/genres');
      setGenres(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGenre = async (id) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/genres/${id}`);
        fetchGenres();
        alert("Genre deleted successfully.");
      } catch (error) {
        console.error("Error deleting genre:", error);
      }
    }
  };

  return (
    <section className="bg-white p-6 sm:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-slate-800">Genres</h2>
            <p className="text-sm text-slate-500 mt-1">Manage book genres in your store.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/admin/genres/create"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
            >
              Add New Genre
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Genre Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Description</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading genres...</td>
                </tr>
              ) : genres.length > 0 ? (
                genres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4">{genre.id}</td>
                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {genre.name}
                    </th>
                    <td className="px-6 py-4 text-slate-500">{genre.description || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link to={`/admin/genres/edit/${genre.id}`} className="font-medium text-slate-600 hover:text-slate-900 transition-colors">Edit</Link>
                      <button onClick={() => deleteGenre(genre.id)} className="font-medium text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
