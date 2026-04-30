import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function AdminGenreEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/genres/${id}`);
        const data = response.data.data || response.data;
        setFormData({
          name: data.name || '',
          description: data.description || ''
        });
      } catch (error) {
        console.error("Error fetching genre:", error);
        alert("Failed to load genre data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchGenre();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const config = { headers: {} };
      if (token) config.headers.Authorization = `Bearer ${token}`;
      
      await axios.put(`http://127.0.0.1:8000/api/genres/${id}`, formData, config);
      alert('Genre updated successfully');
      navigate('/admin/genres');
    } catch (error) {
      console.error("Error updating genre:", error);
      alert('Failed to update genre');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <section className="bg-white p-6 sm:p-10 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-slate-800">Edit Genre</h2>
          <p className="text-sm text-slate-500 mt-1">Update genre information.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700">Genre Name</label>
            <input type="text" name="name" id="name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" required={true} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" rows="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" required={true} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to="/admin/genres" className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
