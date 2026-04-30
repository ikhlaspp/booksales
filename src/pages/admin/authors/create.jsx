import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminAuthorCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      /* If you have auth, pass token in headers here:
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://127.0.0.1:8000/api/authors', formData, config);
      */
      
      // Let's assume testing without auth or auth token is in localstorage
      const token = localStorage.getItem('token') || '';
      const config = { headers: {} };
      if (token) config.headers.Authorization = `Bearer ${token}`;
      
      await axios.post('http://127.0.0.1:8000/api/authors', formData, config);
      alert('Author created successfully');
      navigate('/admin/authors');
    } catch (error) {
      console.error("Error creating author:", error);
      alert('Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 sm:p-10 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-slate-800">Add Author</h2>
          <p className="text-sm text-slate-500 mt-1">Create a new author profile.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700">Author Name</label>
            <input type="text" name="name" id="name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" placeholder="e.g. J.K. Rowling" required={true} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="photo" className="block mb-2 text-sm font-medium text-slate-700">Photo URL</label>
            <input type="text" name="photo" id="photo" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" placeholder="https://example.com/photo.jpg" value={formData.photo} onChange={(e) => setFormData({...formData, photo: e.target.value})} />
          </div>
          <div>
            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-slate-700">Biography</label>
            <textarea id="bio" rows="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" placeholder="Brief biography about this author..." value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50">
              {loading ? 'Adding...' : 'Save Author'}
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
