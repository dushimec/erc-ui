import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { communicationApi } from '../../api/communication';
import { toast } from 'react-toastify';
import { Bell, MessageSquare, Send, Check } from 'lucide-react';

const CommunicationPage: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await communicationApi.getNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const columns = [
        {
            header: 'Notification',
            accessor: (n: any) => (
                <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${n.read ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-600'}`}>
                        <Bell size={18} />
                    </div>
                    <div>
                        <div className={`font-medium ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{n.message}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Sent At',
            accessor: (n: any) => new Date(n.sentAt).toLocaleString()
        },
        {
            header: 'Actions',
            accessor: (n: any) => !n.read && (
                <button
                    onClick={() => communicationApi.markRead(n.id).then(() => fetchNotifications())}
                    className="text-red-600 hover:underline text-xs font-medium flex items-center"
                >
                    <Check size={14} className="mr-1" /> Mark Read
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Communication Hub</h1>
                    <p className="text-sm text-gray-500">Manage system notifications and direct messages.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm flex items-center">
                        <MessageSquare size={18} className="mr-2" /> View Messages
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm">
                        <Send size={18} className="mr-2" /> Broadcast Message
                    </button>
                </div>
            </div>

            <DataTable columns={columns} data={notifications} isLoading={isLoading} />
        </div>
    );
};

export default CommunicationPage;
