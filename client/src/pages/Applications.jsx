import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, Trash2, Edit2, X } from 'lucide-react';

const STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

const ApplicationModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    jobLink: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        appliedDate: new Date(initialData.appliedDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: '',
        jobLink: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">{initialData ? 'Edit Application' : 'Add Application'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied *</label>
              <input required type="date" value={formData.appliedDate} onChange={e => setFormData({...formData, appliedDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
            <input type="url" value={formData.jobLink} onChange={e => setFormData({...formData, jobLink: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" rows="2"></textarea>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sort, setSort] = useState('newest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApplications = async () => {
    try {
      let url = `/applications?sort=${sort}`;
      if (search) url += `&search=${search}`;
      if (filterStatus) url += `&status=${filterStatus}`;
      
      const response = await api.get(url);
      setApplications(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, filterStatus, sort]);

  const handleSubmit = async (data) => {
    try {
      if (editingApp) {
        await api.put(`/applications/${editingApp._id}`, data);
      } else {
        await api.post('/applications', data);
      }
      setIsModalOpen(false);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving application');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications();
      } catch (err) {
        alert('Error deleting application');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      fetchApplications();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
        <button 
          onClick={() => { setEditingApp(null); setIsModalOpen(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center text-gray-500">Loading pipeline...</div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full">
            {STATUSES.map(status => {
              const columnApps = applications.filter(app => app.status === status);
              return (
                <div key={status} className="w-80 flex flex-col bg-gray-100/50 rounded-xl">
                  <div className="p-4 flex items-center justify-between border-b border-gray-200/50">
                    <h3 className="font-semibold text-gray-900">{status}</h3>
                    <span className="bg-white text-gray-500 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      {columnApps.length}
                    </span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {columnApps.map(app => (
                      <div key={app._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 leading-tight">{app.role}</h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                            <button onClick={() => { setEditingApp(app); setIsModalOpen(true); }} className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(app._id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{app.company}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                          <span className="text-xs text-gray-400 font-medium">
                            {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="text-xs font-medium bg-gray-50 border-none rounded py-1 pr-6 cursor-pointer focus:ring-0 text-gray-600 hover:bg-gray-100"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                    {columnApps.length === 0 && (
                      <div className="text-center py-6 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
        initialData={editingApp}
      />
    </div>
  );
};

export default Applications;
