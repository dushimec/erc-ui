import React, { useEffect, useState } from 'react';
import { contactApi } from '../../api/contact';
import { websiteApi } from '../../api/website';
import { toast } from 'react-toastify';
import { Trash2, CheckCircle, Mail, Phone, MapPin, Bell } from 'lucide-react';
import DataTable from '../../components/DataTable';

const ContactManagement: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [contactInfo, setContactInfo] = useState<any>({
        helpTitle: 'How can we help?',
        helpDescription: '',
        description: '',
        address: '',
        phone: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [msgRes, infoRes] = await Promise.all([
                contactApi.getAllMessages(),
                websiteApi.getContactInfo()
            ]);
            if (msgRes.success) setMessages(msgRes.data);
            if (infoRes.success && infoRes.data) {
                setContactInfo({
                    ...contactInfo,
                    ...infoRes.data
                });
            }
        } catch (error) {
            toast.error('Failed to load contact data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInfoUpdate = async () => {
        try {
            const res = await websiteApi.upsertContactInfo(contactInfo);
            if (res.success) toast.success('Contact info updated');
        } catch (error) {
            toast.error('Failed to update contact info');
        }
    };

    const markRead = async (id: string) => {
        try {
            await contactApi.markAsRead(id);
            toast.success('Marked as read');
            fetchData();
        } catch (error) {
            toast.error('Failed to update message');
        }
    };

    const deleteMsg = async (id: string) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await contactApi.deleteMessage(id);
            toast.success('Message deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const unreadCount = messages.filter(m => !m.read).length;

    const columns = [
        {
            header: 'Status', accessor: (m: any) => (
                <div className={`w-2.5 h-2.5 rounded-full ${m.read ? 'bg-slate-200' : 'bg-red-500 shadow-sm shadow-red-200'}`}></div>
            )
        },
        {
            header: 'Sender', accessor: (m: any) => (
                <div>
                    <p className={`font-bold ${m.read ? 'text-slate-500' : 'text-slate-900'} uppercase tracking-tighter`}>{m.firstName} {m.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.phone}</p>
                </div>
            )
        },
        {
            header: 'Message Preview', accessor: (m: any) => (
                <div className="max-w-md">
                    <p className="truncate text-sm text-slate-600 italic">"{m.message}"</p>
                    <span className="text-[10px] text-slate-400 font-medium">Recorded from {m.location || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: 'Date Received', accessor: (m: any) => (
                <span className="text-xs font-bold text-slate-500">{new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )
        },
        {
            header: 'Actions', accessor: (m: any) => (
                <div className="flex space-x-1">
                    {!m.read && (
                        <button onClick={() => markRead(m.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Mark as read">
                            <CheckCircle size={18} />
                        </button>
                    )}
                    <button onClick={() => deleteMsg(m.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contact & Inquiries</h1>
                    <p className="text-slate-500 mt-1 font-medium">Engage with your community and manage connections.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="glass-card px-6 py-3 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white mr-4 shadow-md">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Inquiries</p>
                            <p className="text-xl font-bold text-slate-900 leading-none">{messages.length}</p>
                        </div>
                    </div>
                    <div className="glass-card px-6 py-3 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white mr-4 shadow-md">
                            <Bell size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Unread</p>
                            <p className="text-xl font-bold text-slate-900 leading-none">{unreadCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Contact Info Form */}
                <div className="xl:col-span-1 glass-card p-8 rounded-3xl flex flex-col h-fit sticky top-8">
                    <div className="flex items-center mb-8">
                        <div className="p-3 bg-slate-900 rounded-2xl text-white mr-4 shadow-lg">
                            <MapPin size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Church Info</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-red-600">Help Section Title</label>
                            <input
                                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm transition-all font-bold"
                                value={contactInfo.helpTitle}
                                placeholder="e.g. How can we help?"
                                onChange={(e) => setContactInfo({ ...contactInfo, helpTitle: e.target.value })}
                            />
                        </div>
                        <div className="group">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-red-600">Help Section Description</label>
                                <span className={`text-[9px] font-bold ${contactInfo.helpDescription?.length > 250 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {contactInfo.helpDescription?.length || 0}/250 chars (Triggers Read More)
                                </span>
                            </div>
                            <textarea
                                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm h-32 transition-all leading-relaxed"
                                value={contactInfo.helpDescription}
                                placeholder="Edit the text under 'How can we help?'..."
                                onChange={(e) => setContactInfo({ ...contactInfo, helpDescription: e.target.value })}
                            />
                        </div>
                        <div className="group">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-red-600">Main Church Description</label>
                                <span className={`text-[9px] font-bold ${contactInfo.description?.length > 300 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {contactInfo.description?.length || 0}/300 chars (Triggers Read More)
                                </span>
                            </div>
                            <textarea
                                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm h-40 transition-all leading-relaxed"
                                value={contactInfo.description}
                                placeholder="Describe your church..."
                                onChange={(e) => setContactInfo({ ...contactInfo, description: e.target.value })}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-red-600">Physical Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                <input
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm transition-all"
                                    value={contactInfo.address}
                                    placeholder="Church location..."
                                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-red-600">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                <input
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm transition-all"
                                    value={contactInfo.phone}
                                    placeholder="+250..."
                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-red-600">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                <input
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white text-sm transition-all"
                                    value={contactInfo.email}
                                    placeholder="hello@church.com"
                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleInfoUpdate}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                        >
                            <CheckCircle size={18} className="mr-2" /> Save Settings
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="xl:col-span-3 glass-card p-10 rounded-3xl min-h-[700px]">
                    <div className="flex items-center justify-between mb-10 font-primary">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Community Inbox</h2>
                            <p className="text-sm text-slate-500 font-medium">Messages submitted via your website's contact form.</p>
                        </div>
                    </div>
                    <DataTable columns={columns} data={messages} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default ContactManagement;
