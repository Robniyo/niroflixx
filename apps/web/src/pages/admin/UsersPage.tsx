import { useState, useEffect } from 'react';
import { Mail, Phone, Shield, MoreVertical, Plus, X, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ResponsiveTable from '@/components/ui/ResponsiveTable';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

const roleOptions = [
  { value: 'USER', label: 'User' },
  { value: 'CANDIDATE', label: 'Candidate' },
  { value: 'INSTRUCTOR', label: 'Instructor' },
  { value: 'CONTENT_MANAGER', label: 'Content Manager' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'ADMIN', password: '' });
  const [creating, setCreating] = useState(false);
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const res = await api.get('/admin/users'); setUsers(res.data.data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try { await api.patch(`/admin/users/${userId}/role`, { role: newRole }); setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u)); toast.success('Role updated'); }
    catch { toast.error('Failed'); }
    setOpenMenu(null);
  };

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try { await api.patch(`/admin/users/${userId}/status`, { status: newStatus }); setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u)); toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}`); }
    catch { toast.error('Failed'); }
    setOpenMenu(null);
  };
  const deleteUser = async (id: string, email: string) => {
  if (!confirm(`Permanently delete ${email}? This cannot be undone.`)) return;
  try {
    await api.delete(`/admin/users/${id}`);
    toast.success('User deleted');
    fetchUsers();
  } catch { toast.error('Failed'); }
};

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try { const res = await api.post('/admin/users', newUser); setUsers([res.data.data, ...users]); toast.success('Admin created!'); setShowAddModal(false); setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: 'ADMIN', password: '' }); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h4 font-bold text-secondary-900">Users</h1>
          <p className="text-secondary-500 text-body-sm mt-1">{users.length} registered users</p>
        </div>
        {isSuperAdmin && <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Admin</Button>}
      </div>

         <ResponsiveTable
          columns={[
            { key: 'user', label: 'User', render: (u) => (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold text-xs">{u.firstName?.[0]}{u.lastName?.[0]}</span>
                </div>
                <span className="font-medium text-sm">{u.firstName} {u.lastName}</span>
              </div>
            )},
            { key: 'contact', label: 'Contact', render: (u) => (
              <div className="text-xs text-secondary-600">
                <div>{u.email}</div>
                {u.phone && <div>{u.phone}</div>}
              </div>
            )},
            { key: 'role', label: 'Role', render: (u) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                u.role === 'ADMIN' ? 'bg-danger-light text-danger-dark' :
                u.role === 'CONTENT_MANAGER' ? 'bg-primary-50 text-primary-600' :
                'bg-secondary-100 text-secondary-600'
              }`}>{u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'ADMIN' ? 'Admin' : u.role === 'CONTENT_MANAGER' ? 'Content Mgr' : u.role === 'INSTRUCTOR' ? 'Instructor' : 'User'}</span>
            )},
            { key: 'status', label: 'Status', render: (u) => (
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(u.id, u.status)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>
                  {u.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                </button>
                <button onClick={() => deleteUser(u.id, u.email)} className="text-xs text-danger hover:underline">Delete</button>
              </div>
            )},
            { key: 'date', label: 'Joined', render: (u) => (
              <span className="text-xs text-secondary-400">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            ), hideOnMobile: true },
            { key: 'actions', label: '', render: (u) => (
              u.role !== 'SUPER_ADMIN' && isSuperAdmin ? (
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} className="p-1 text-secondary-400 hover:text-secondary-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenu === u.id && (
                    <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-20 py-1 w-36">
                      {roleOptions.map((r) => (
                        <button key={r.value} onClick={() => changeRole(u.id, r.value)} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary-50 ${u.role === r.value ? 'text-primary-600 font-semibold bg-primary-50' : 'text-secondary-700'}`}>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null
            ), hideOnMobile: true },
          ]}
          data={users}
          emptyMessage="No users found"
        />
      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-secondary-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Add Team Member</h3>
                  <p className="text-body-sm text-secondary-500">Create an admin account</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-secondary-700 mb-1">First Name *</label>
                  <input type="text" required value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} placeholder="Jean" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
                <div>
                  <label className="block text-label text-secondary-700 mb-1">Last Name *</label>
                  <input type="text" required value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} placeholder="Bosco" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1">Email Address *</label>
                <input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="jean@example.com" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-secondary-700 mb-1">Phone</label>
                  <input type="tel" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} placeholder="+250 7XX XXX XXX" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
                <div>
                  <label className="block text-label text-secondary-700 mb-1">Assign Role *</label>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm">
                    <option value="ADMIN">Admin</option>
                    <option value="CONTENT_MANAGER">Content Manager</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1">Password</label>
                <input type="text" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Default: niroflixx2026" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={creating} rightIcon={<UserPlus className="w-4 h-4" />}>Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}