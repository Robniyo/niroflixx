import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, Newspaper, Upload, PlusCircle, FileText, Braces, Trash,
} from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
import RichTextEditor from '@/components/ui/RichTextEditor';

const emptyArticle = {
  title: '',
  summary: '',
  content: '',
  author: 'Future Scholars Team',
  categoryId: '',
  coverImage: '',
  status: 'PUBLISHED',
  featured: false,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
};

function parseCSV(text: string): any[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

export default function NewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyArticle });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkMode, setBulkMode] = useState<'form' | 'csv' | 'json'>('form');
  const [bulkRows, setBulkRows] = useState([{ ...emptyArticle }]);
  const [bulkText, setBulkText] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const r = await api.get('/news?limit=100'); setItems(r.data.data); } catch {} finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ ...emptyArticle }); setShowModal(true); };

  const openEdit = async (id: string) => {
    try {
      const r = await api.get(`/news/id/${id}`);
      const d = r.data.data;
      setForm({
        title: d.title || '',
        summary: d.summary || '',
        content: d.content || '',
        categoryId: d.categoryId || '',
        author: d.author || 'Future Scholars Team',
        coverImage: d.coverImage || '',
        status: d.status,
        featured: d.featured,
        seoTitle: d.seoTitle || '',
        seoDescription: d.seoDescription || '',
        seoKeywords: d.seoKeywords || '',
      });
      setEditing(id);
      setShowModal(true);
    } catch {}
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, coverImage: res.data.data.url });
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/news/${editing}`, form);
        toast.success('Updated');
      } else {
        await api.post('/news', form);
        toast.success('Created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive?')) return;
    try { await api.delete(`/news/${id}`); toast.success('Archived'); fetchItems(); } catch {}
  };

  const addBulkRow = () => setBulkRows(prev => [...prev, { ...emptyArticle }]);
  const removeBulkRow = (index: number) => setBulkRows(prev => prev.filter((_, i) => i !== index));
  const updateBulkRow = (index: number, field: string, value: any) => {
    setBulkRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleBulkImport = async () => {
    let articles: any[] = [];

    if (bulkMode === 'form') {
      articles = bulkRows.filter(row => row.title.trim() !== '' && row.content.trim() !== '');
    } else if (bulkMode === 'csv') {
      articles = parseCSV(bulkText);
    } else {
      try {
        articles = JSON.parse(bulkText);
      } catch {
        toast.error('Invalid JSON format');
        return;
      }
    }

    if (!Array.isArray(articles) || articles.length === 0) {
      toast.error('No valid articles found');
      return;
    }

    setBulkImporting(true);
    try {
      const res = await api.post('/news/bulk', { articles });
      toast.success(`Imported ${res.data.imported || articles.length} articles`);
      setBulkRows([{ ...emptyArticle }]);
      setBulkText('');
      setShowBulkImport(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bulk import failed');
    } finally { setBulkImporting(false); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h4 font-bold text-secondary-900">News & Articles</h1>
          <p className="text-secondary-500 text-body-sm mt-1">{items.length} articles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => { setBulkMode('form'); setShowBulkImport(true); }}>Bulk Add</Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Write Article</Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200">
          <Newspaper className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500">No articles yet.</p>
        </div>
      ) : (
        <ResponsiveTable
          columns={[
            { key: 'title', label: 'Title', render: (a) => <span className="font-medium text-sm">{a.title}</span> },
            { key: 'author', label: 'Author', render: (a) => <span className="text-xs text-secondary-600">{a.author || '—'}</span> },
            { key: 'status', label: 'Status', render: (a) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'PUBLISHED' ? 'bg-success-light text-success-dark' : 'bg-secondary-100 text-secondary-600'}`}>{a.status}</span> },
            { key: 'date', label: 'Published', render: (a) => <span className="text-xs">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '—'}</span> },
            { key: 'actions', label: '', render: (a) => (
              <div className="flex gap-1">
                <button onClick={() => openEdit(a.id)} className="p-1 text-secondary-400 hover:text-primary-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1 text-secondary-400 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
            ), hideOnMobile: true },
          ]}
          data={items}
          emptyMessage="No articles yet"
        />
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBulkImport(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 animate-scale-in">
            <button onClick={() => setShowBulkImport(false)} className="absolute top-4 right-4 p-2 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button>
            <h3 className="text-h4 font-bold mb-2">Bulk Add Articles</h3>

            {/* Mode tabs */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setBulkMode('form')} className={`px-4 py-2 rounded-lg text-sm font-medium ${bulkMode === 'form' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}>Form</button>
              <button onClick={() => setBulkMode('csv')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${bulkMode === 'csv' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}><FileText className="w-4 h-4" /> CSV</button>
              <button onClick={() => setBulkMode('json')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${bulkMode === 'json' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}><Braces className="w-4 h-4" /> JSON</button>
            </div>

            {bulkMode === 'form' ? (
              <div className="space-y-6">
                {bulkRows.map((row, index) => (
                  <div key={index} className="border border-secondary-200 rounded-xl p-4 bg-secondary-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-sm text-secondary-700">Article #{index + 1}</span>
                      {bulkRows.length > 1 && (
                        <button onClick={() => removeBulkRow(index)} className="text-danger hover:text-red-700 text-sm flex items-center gap-1">
                          <Trash className="w-4 h-4" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input type="text" value={row.title} onChange={e => updateBulkRow(index, 'title', e.target.value)} className="w-full px-3 py-2.5 bg-white border rounded-lg text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Summary</label>
                        <textarea rows={2} value={row.summary} onChange={e => updateBulkRow(index, 'summary', e.target.value)} className="w-full px-3 py-2.5 bg-white border rounded-lg text-sm resize-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Content *</label>
                        <RichTextEditor
                          value={row.content}
                          onChange={(html) => updateBulkRow(index, 'content', html)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Author</label>
                        <input type="text" value={row.author} onChange={e => updateBulkRow(index, 'author', e.target.value)} className="w-full px-3 py-2.5 bg-white border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select value={row.status} onChange={e => updateBulkRow(index, 'status', e.target.value)} className="w-full px-3 py-2.5 bg-white border rounded-lg text-sm">
                          <option value="PUBLISHED">Published</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addBulkRow} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  <PlusCircle className="w-4 h-4" /> Add Another Article
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-secondary-500 mb-2">
                  {bulkMode === 'csv' ? 'Paste CSV rows. Headers: title,summary,content,author,status' : 'Paste a JSON array of article objects.'}
                </p>
                <textarea
                  rows={10}
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 border rounded-lg text-sm font-mono resize-none"
                  placeholder={bulkMode === 'csv' ? 'title,summary,content,author,status' : '[\n  { "title": "...", "summary": "...", "content": "...", "author": "...", "status": "PUBLISHED" }\n]'}
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowBulkImport(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleBulkImport} isLoading={bulkImporting}>Save All Articles</Button>
            </div>
          </div>
        </div>
      )}

      {/* Single Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold">{editing ? 'Edit' : 'New'} Article</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Summary</label><textarea rows={2} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Content *</label>
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Author</label><input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Cover Image URL</label><input type="url" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Upload Cover Image</label>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border rounded-lg cursor-pointer hover:bg-secondary-100 text-sm">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Choose Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {form.coverImage && <span className="text-xs text-success">Uploaded ✓</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">SEO Title</label>
                <input type="text" value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">SEO Description</label>
                <textarea rows={2} value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">SEO Keywords (comma separated)</label>
                <input type="text" value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="feat" />
                <label htmlFor="feat" className="text-sm">Featured</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Publish'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}