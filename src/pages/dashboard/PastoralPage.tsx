import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';

import DataTable from '../../components/DataTable';
import { pastoralApi } from '../../api/pastoral';
import type { PrayerRequest, CounselingAppointment } from '../../types/api';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, Calendar, MessageCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const PastoralPage: React.FC = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'prayers' | 'appointments'>('prayers');
    const { searchTerm } = useSearch();

    // Prayer state

    const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
    const [responseText, setResponseText] = useState('');

    // Appointment state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionInProgress, setActionInProgress] = useState<{ id: string, status: string } | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [prRes, appRes] = await Promise.all([
                pastoralApi.getAllPrayerRequests(),
                pastoralApi.getAllAppointments()
            ]);
            if (prRes.success) setRequests(prRes.data);
            if (appRes.success) setAppointments(appRes.data);
        } catch (error) {
            toast.error('Failed to load pastoral data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePrayerResponse = async () => {
        if (!selectedRequest || !responseText.trim()) return;
        try {
            setIsSubmitting(true);
            const response = await pastoralApi.respondToPrayerRequest(selectedRequest.id, responseText);
            if (response.success) {
                toast.success('Response sent successfully');
                setSelectedRequest(null);
                setResponseText('');
                fetchData();
            }
        } catch (error) { toast.error('Failed to send response'); }
        finally { setIsSubmitting(false); }
    };

    const handleUpdateAppointment = async (id: string, status: string) => {
        try {
            setActionInProgress({ id, status });
            const response = await pastoralApi.updateAppointmentStatus(id, status);
            if (response.success) {
                toast.success(`Appointment ${status.toLowerCase()}ed`);
                fetchData();
            }
        } catch (error) { toast.error('Failed to update appointment'); }
        finally { setActionInProgress(null); }
    };

    const prayerColumns = [
        {
            header: 'Member',
            accessor: (req: PrayerRequest) => (
                <div className="py-2">
                    <div className="font-bold text-gray-900">
                        {req.member ? `${req.member.firstName} ${req.member.lastName}` : (req.requesterName || "Anonymous")}
                    </div>
                    {(req.member?.email || req.requesterEmail) && (
                        <div className="text-xs text-gray-500">{req.member?.email || req.requesterEmail}</div>
                    )}
                </div>
            )
        },
        {
            header: 'Prayer Request',
            accessor: (req: PrayerRequest) => (
                <div className="max-w-md py-2">
                    <div className="text-sm font-medium text-gray-900 leading-relaxed line-clamp-3">"{req.request}"</div>
                    {req.response && (
                        <div className="mt-2 p-2 bg-red-50 rounded border-l-2 border-red-500">
                            <p className="text-xs text-red-700 italic">Response: {req.response}</p>
                        </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded-full ${req.isPrivate ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                            {req.isPrivate ? 'Private' : 'Public'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (req: PrayerRequest) => (
                <div className="flex items-center">
                    {req.responded ? (
                        <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full uppercase tracking-tight">
                            <CheckCircle size={14} className="mr-1" /> Responded
                        </span>
                    ) : (
                        <span className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tight">
                            <Clock size={14} className="mr-1" /> Pending
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (req: PrayerRequest) => (
                <button
                    onClick={() => { setSelectedRequest(req); setResponseText(req.response || ''); }}
                    className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1 border border-red-100"
                >
                    <MessageCircle size={16} />
                    {req.responded ? 'Update' : 'Respond'}
                </button>
            )
        }
    ];

    const appointmentColumns = [
        {
            header: 'Member',
            accessor: (app: CounselingAppointment) => (
                <div className="py-2">
                    <div className="font-bold text-gray-900">
                        {app.member ? `${app.member.firstName} ${app.member.lastName}` : (app.requesterName || "Anonymous")}
                    </div>
                    {(app.member?.email || app.requesterEmail) && (
                        <div className="text-xs text-gray-500">{app.member?.email || app.requesterEmail}</div>
                    )}
                </div>
            )
        },
        {
            header: 'Purpose & Time',
            accessor: (app: CounselingAppointment) => (
                <div className="max-w-md py-2">
                    <div className="text-sm font-medium text-gray-900 leading-relaxed line-clamp-3">"{app.purpose || app.notes || 'Counseling'}"</div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-red-500" />
                            {new Date(app.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (app: CounselingAppointment) => {
                const colors = {
                    PENDING: 'bg-amber-100 text-amber-700',
                    APPROVED: 'bg-green-100 text-green-700',
                    REJECTED: 'bg-red-100 text-red-700',
                    COMPLETED: 'bg-blue-100 text-blue-700'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[app.status]}`}>
                        {app.status}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            accessor: (app: CounselingAppointment) => {
                const isProcessing = actionInProgress?.id === app.id;
                return (
                    <div className="flex items-center gap-2">
                        {app.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={() => handleUpdateAppointment(app.id, 'APPROVED')}
                                    disabled={!!actionInProgress}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] flex justify-center"
                                >
                                    {isProcessing && actionInProgress.status === 'APPROVED' ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : 'Approve'}
                                </button>
                                <button
                                    onClick={() => handleUpdateAppointment(app.id, 'REJECTED')}
                                    disabled={!!actionInProgress}
                                    className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] flex justify-center"
                                >
                                    {isProcessing && actionInProgress.status === 'REJECTED' ? (
                                        <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : 'Reject'}
                                </button>
                            </>
                        )}
                        {app.status === 'APPROVED' && (
                            <button
                                onClick={() => handleUpdateAppointment(app.id, 'COMPLETED')}
                                disabled={!!actionInProgress}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px] flex justify-center"
                            >
                                {isProcessing && actionInProgress.status === 'COMPLETED' ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : 'Mark Done'}
                            </button>
                        )}
                    </div>
                );
            }
        }
    ];

    const filteredRequests = requests.filter(req =>
        req.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.member && (req.member.firstName + ' ' + req.member.lastName).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredAppointments = appointments.filter(app =>
        (app.purpose || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.member && (app.member.firstName + ' ' + app.member.lastName).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pastoral Care</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage prayer requests and counseling appointments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-1 rounded-xl flex">
                        <button
                            onClick={() => setActiveTab('prayers')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'prayers' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Prayer Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Appointments
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={(activeTab === 'prayers' ? prayerColumns : appointmentColumns) as any}
                    data={(activeTab === 'prayers' ? filteredRequests : filteredAppointments) as any}
                    isLoading={isLoading}
                />
            </div>


            {/* Response Modal */}
            <Modal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Pastoral Response"
                size="md"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">The Request</label>
                        <p className="text-gray-700 leading-relaxed italic">"{selectedRequest?.request}"</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Response & Encouragement</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[150px] outline-none transition-all"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your godly encouragement or response here..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePrayerResponse}
                            disabled={isSubmitting || !responseText.trim()}
                            className="px-8 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-100 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Response'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PastoralPage;
