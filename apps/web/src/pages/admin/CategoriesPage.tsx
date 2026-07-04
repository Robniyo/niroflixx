import { useState, useEffect } from 'react';
import { Plus, Trash2, Folder } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => { try { const r = await api.get('/categories'); setCategories(r.data.data); } catch {} finally { setLoading(false); } };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    try {
      await api.post('/categories', { name: newCat.trim() });
      toast.success('Category added');
      setNewCat('');
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchCategories(); } catch {}
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-h4 font-bold text-secondary-900 mb-6">Categories</h1>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Type a category name..."
            className="flex-1 px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
          <Button onClick={addCategory} leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
        </div>

        {categories.length === 0 ? (
          <p className="text-secondary-500 text-center py-8">No categories yet. Type one above.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c: any) => (
              <div key={c.id} className="flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full text-sm">
                <Folder className="w-4 h-4 text-primary-600" />
                {c.name}
                <button onClick={() => deleteCategory(c.id)} className="text-secondary-400 hover:text-danger ml-1"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}