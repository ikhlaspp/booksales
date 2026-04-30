import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function AdminAuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/authors/${id}`);
        const data = response.data.data || response.data;
        setFormData({
          name: data.name || '',
          photo: data.photo || '',
          bio: data.bio || ''
        });
      } catch (error) {
        console.error("Error fetching author:", error);
        alert("Failed to load author data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const config = { headers: {} };
      if (token) config.headers.Authorization = `Bearer ${token}`;
      
      await axios.put(`http://127.0.0.1:8000/api/authors/${id}`, formData, config);
      alert('Author updated successfully');
      navigate('/admin/authors');
    } catch (error) {
      console.error("Error updating author:", error);
      alert('Failed to update author');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <section className="bg-white p-6 sm:p-10 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-slate-800">Edit Author</h2>
          <p className="text-sm text-slate-500 mt-1">Update author information.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700">Author Name</label>
            <input type="text" name="name" id="name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" required={true} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="photo" className="block mb-2 text-sm font-medium text-slate-700">Photo URL</label>
            <input type="text" name="photo" id="photo" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" value={formData.photo} onChange={(e) => setFormData({...formData, photo: e.target.value})} />
          </div>
          <div>
            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-slate-700">Biography</label>
            <textarea id="bio" rows="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to="/admin/authors" className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}