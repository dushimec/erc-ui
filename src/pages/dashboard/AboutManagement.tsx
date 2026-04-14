import React, { useEffect, useState } from 'react';
import { websiteApi } from '../../api/website';
import { toast } from 'react-toastify';
import { Save, UserPlus, Trash2, Edit2, Mail, Phone } from 'lucide-react';
import Modal from '../../components/Modal';
import Skeleton from '../../components/Skeleton';

const AboutManagement: React.FC = () => {
    // ... state and effects ...
    const [sections, setSections] = useState<any[]>([]);
    const [leadership, setLeadership] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState<any>(null);
    const [newLeader, setNewLeader] = useState<any>({ name: '', role: '', sequence: 0, imageUrl: '', email: '', phone: '', file: '' });
    const [activeTab, setActiveTab] = useState<'content' | 'leadership'>('content');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [sectionsRes, leadRes] = await Promise.all([
                websiteApi.getAboutSections(),
                websiteApi.getLeadership()
            ]);
            if (sectionsRes.success) setSections(sectionsRes.data);
            if (leadRes.success) setLeadership(leadRes.data);
        } catch (error) {
            toast.error('Failed to load website content');
        } finally {
            setIsLoading(false);
        }
    };

    // ... handlers ...
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewLeader({ ...newLeader, file: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSectionUpdate = async (type: string, title: string, content: string) => {
        try {
            const res = await websiteApi.upsertAboutSection({ type, title, content });
            if (res.success) {
                toast.success(`${title} updated successfully`);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to update section');
        }
    };

    const handleLeaderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const res = editingLeader
                ? await websiteApi.updateLeadership(editingLeader.id, newLeader)
                : await websiteApi.addLeadership(newLeader);

            if (res.success) {
                toast.success(editingLeader ? 'Leader updated' : 'Leader added');
                setIsLeaderModalOpen(false);
                setEditingLeader(null);
                setNewLeader({ name: '', role: '', sequence: 0, imageUrl: '', email: '', phone: '', file: '' });
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to save leader');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLeader = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this leader?')) return;
        try {
            await websiteApi.deleteLeadership(id);
            toast.success('Leader removed');
            fetchData();
        } catch (error) {
            toast.error('Failed to remove leader');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About Page Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Elevate your church's story and leadership presence.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Page Content
                    </button>
                    <button
                        onClick={() => setActiveTab('leadership')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'leadership' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Leadership Team
                    </button>
                </div>
            </div>

            {activeTab === 'content' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="glass-card p-8 rounded-3xl space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton width={120} height={20} />
                                    <Skeleton width={20} height={20} />
                                </div>
                                <Skeleton height={150} />
                                <Skeleton width={150} height={12} />
                            </div>
                        ))
                    ) : ['WHO_WE_ARE', 'MISSION', 'VISION', 'HISTORY', 'START_UP'].map(type => {
                        const section = sections.find(s => s.type === type) || { title: type.replace(/_/g, ' '), content: '' };
                        return (
                            <div key={type} className="glass-card p-8 rounded-3xl flex flex-col group transition-all duration-300 hover:shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 lowercase first-letter:uppercase">{section.title.toLowerCase()}</h2>
                                    <Edit2 size={16} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                                </div>
                                <textarea
                                    className="flex-1 w-full p-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white outline-none text-sm leading-relaxed min-h-[150px] transition-all"
                                    defaultValue={section.content}
                                    placeholder={`Enter details for ${section.title}...`}
                                    onBlur={(e) => handleSectionUpdate(type, section.title, e.target.value)}
                                />
                                <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Save size={12} className="mr-2 text-emerald-500" />
                                    <span>Changes save automatically on exit</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card p-10 rounded-3xl">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 font-primary">Our Leaders</h2>
                            <p className="text-slate-500 text-sm font-medium">Manage the spiritual leaders of your community.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingLeader(null);
                                setNewLeader({ name: '', role: '', sequence: 0, imageUrl: '', email: '', phone: '', file: '' });
                                setIsLeaderModalOpen(true);
                            }}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg hover:scale-105 active:scale-95"
                        >
                            <UserPlus size={20} className="mr-2" /> Add Leader
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center">
                                    <Skeleton variant="circular" width={64} height={64} className="mr-5 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                        <div className="pt-2 flex flex-col space-y-1">
                                            <Skeleton width="40%" height={10} />
                                            <Skeleton width="40%" height={10} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : leadership.map(leader => (
                            <div key={leader.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center group relative overflow-hidden transition-all hover:shadow-xl hover:border-red-100">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
                                    <button onClick={() => {
                                        setEditingLeader(leader);
                                        setNewLeader({
                                            name: leader.name,
                                            role: leader.role,
                                            sequence: leader.sequence,
                                            imageUrl: leader.imageUrl || '',
                                            email: leader.email || '',
                                            phone: leader.phone || '',
                                            file: ''
                                        });
                                        setIsLeaderModalOpen(true);
                                    }} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => deleteLeader(leader.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center mr-5 shadow-lg relative shrink-0">
                                    {leader.imageUrl ? (
                                        <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-slate-400 font-bold text-2xl uppercase">{leader.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-red-600 transition-colors uppercase tracking-tight truncate max-w-[150px]">{leader.name}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 truncate max-w-[150px]">{leader.role}</p>
                                    <div className="mt-2 flex flex-col space-y-1">
                                        {leader.email && <div className="flex items-center text-[9px] text-slate-500 font-medium"><Mail size={10} className="mr-1" /> {leader.email}</div>}
                                        {leader.phone && <div className="flex items-center text-[9px] text-slate-500 font-medium"><Phone size={10} className="mr-1" /> {leader.phone}</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isLoading && leadership.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                            <UserPlus size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No leaders added yet. Start by adding your church leadership.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Leader Modal */}
            <Modal
                isOpen={isLeaderModalOpen}
                onClose={() => setIsLeaderModalOpen(false)}
                title={editingLeader ? "Edit Leader" : "Add Leader"}
            >
                <form onSubmit={handleLeaderSubmit} className="space-y-5 p-2">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden mb-4 shadow-xl border-4 border-white relative group">
                            {newLeader.file || newLeader.imageUrl ? (
                                <img src={newLeader.file || newLeader.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <UserPlus size={40} />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                                <span className="text-[10px] font-bold uppercase">Change</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Image Upload</p>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-600 transition-colors">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Cyiza Celia"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all font-medium"
                            value={newLeader.name}
                            onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-600 transition-colors">Role</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Senior Pastor"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all font-medium"
                            value={newLeader.role}
                            onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-600 transition-colors">Email Address</label>
                            <input
                                type="email"
                                placeholder="leader@church.com"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all font-medium text-sm"
                                value={newLeader.email}
                                onChange={(e) => setNewLeader({ ...newLeader, email: e.target.value })}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-600 transition-colors">Contact Phone</label>
                            <input
                                type="text"
                                placeholder="+250..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all font-medium text-sm"
                                value={newLeader.phone}
                                onChange={(e) => setNewLeader({ ...newLeader, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-600 transition-colors">Display Priority (Sequence)</label>
                        <input
                            type="number"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all font-medium"
                            value={newLeader.sequence}
                            onChange={(e) => setNewLeader({ ...newLeader, sequence: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Saving...
                                </>
                            ) : (
                                editingLeader ? 'Update Leader Profile' : 'Confirm & Save Leader'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AboutManagement;
