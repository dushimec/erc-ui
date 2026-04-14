import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

import { Calendar, Clock, UserCheck, Plus, PlusCircle, CheckCircle, Image as ImageIcon, X } from 'lucide-react';

import { servicesApi } from '../../api/services';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import type { Service } from '../../types/api';
import Modal from '../../components/Modal';

const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newService, setNewService] = useState({
        title: '',
        serviceType: 'SUNDAY_SERVICE',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '10:00',
        location: 'Church Sanctuary',
        description: '',
        imageUrl: ''
    });


    const handleAddOrEditService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            // Format dates and times for backend (ISO8601)
            const payload = {
                ...newService,
                date: new Date(newService.date).toISOString(),
                startTime: new Date(`${newService.date}T${newService.startTime}`).toISOString(),
                endTime: new Date(`${newService.date}T${newService.endTime}`).toISOString()
            };

            const response = editingService
                ? await servicesApi.updateService(editingService.id, payload)
                : await servicesApi.createService(payload);

            if (response.success) {
                toast.success(editingService ? 'Fellowship updated successfully' : 'Fellowship scheduled successfully');
                setIsModalOpen(false);
                setEditingService(null);
                fetchServices();
                setNewService({
                    title: '', serviceType: 'SUNDAY_SERVICE', date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '10:00', location: 'Church Sanctuary', description: '', imageUrl: ''
                });

            }
        } catch (error) {
            toast.error(editingService ? 'Failed to update fellowship' : 'Failed to schedule fellowship');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this fellowship?')) return;
        try {
            const response = await servicesApi.deleteService(id);
            if (response.success) {
                toast.success('Fellowship deleted successfully', {
                    progressClassName: 'bg-red-600'
                });
                fetchServices();
            }
        } catch (error) {
            toast.error('Failed to delete fellowship');
        }
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setNewService({
            title: service.title,
            serviceType: service.serviceType,
            date: new Date(service.date).toISOString().split('T')[0],
            startTime: service.startTime,
            endTime: service.endTime,
            location: service.location || 'Church Sanctuary',
            description: service.description || '',
            imageUrl: service.imageUrl || ''
        });

        setIsModalOpen(true);
    };

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const response = await servicesApi.getAllServices();
            if (response.success) {
                setServices(response.data);
            }
        } catch (error) {
            toast.error('Failed to load fellowships');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const columns = [
        {
            header: 'Fellowship Title',
            accessor: (s: Service) => (
                <div className="flex items-center">
                    {s.imageUrl && (
                        <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-gray-100 shrink-0">
                            <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-gray-900">{s.title}</div>
                        <div className="text-xs text-gray-500">{s.serviceType}</div>
                    </div>
                </div>

            )
        },
        {
            header: 'Schedule',
            accessor: (s: Service) => (
                <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1" /> {new Date(s.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1">
                        <Clock size={14} className="mr-1" /> {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )
        },
        {
            header: 'Attendance',
            accessor: (s: Service) => (
                <div className="flex items-center text-sm">
                    <UserCheck size={16} className="text-green-600 mr-2" />
                    <span className="font-semibold">{s.attendanceCount}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (s: Service) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(s)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteService(s.id)}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.location && service.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fellowships & Attendance</h1>
                    <p className="text-sm text-gray-500">Manage church fellowships and track member attendance.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <Plus size={18} className="mr-2" /> Schedule Fellowship
                </button>
            </div>

            <DataTable columns={columns} data={filteredServices} isLoading={isLoading} />


            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setEditingService(null);
                        setNewService({
                            title: '', serviceType: 'SUNDAY_SERVICE', date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '10:00', location: 'Church Sanctuary', description: '', imageUrl: ''
                        });
                    }
                }}

                title={editingService ? "Edit Fellowship" : "Schedule New Fellowship"}
                size="md"
            >
                <form onSubmit={handleAddOrEditService} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            placeholder="e.g., Morning Glory"
                            value={newService.title}
                            onChange={e => setNewService({ ...newService, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Type</label>
                        <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newService.serviceType}
                            onChange={e => setNewService({ ...newService, serviceType: e.target.value })}
                        >
                            <option value="SUNDAY_SERVICE">Sunday Fellowship</option>
                            <option value="BIBLE_STUDY">Bible Study</option>
                            <option value="CHOIR_PRACTICE">Choir Practice</option>
                            <option value="PRAYER_MEETING">Prayer Meeting</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            placeholder="e.g., Church Sanctuary"
                            value={newService.location}
                            onChange={e => setNewService({ ...newService, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Date</label>
                        <input
                            type="date"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newService.date}
                            onChange={e => setNewService({ ...newService, date: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newService.startTime}
                                onChange={e => setNewService({ ...newService, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newService.endTime}
                                onChange={e => setNewService({ ...newService, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {newService.imageUrl ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-red-100 group">
                                    <img src={newService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setNewService({ ...newService, imageUrl: '' })}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-red-300 hover:bg-red-50 transition-all text-gray-400 hover:text-red-500">
                                    <ImageIcon size={24} className="mb-1" />
                                    <span className="text-[10px] font-medium uppercase">Upload</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewService({ ...newService, imageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                            <div className="text-xs text-gray-500">
                                <p>Upload a custom photo for this fellowship.</p>
                                <p className="mt-1">Recommended: 800x600px</p>
                            </div>
                        </div>
                    </div>


                    <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingService(null);
                                setNewService({
                                    title: '', serviceType: 'SUNDAY_SERVICE', date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '10:00', location: 'Church Sanctuary', description: '', imageUrl: ''
                                });

                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-lg active:scale-95 disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? (editingService ? 'Updating...' : 'Scheduling...') : (
                                <>{editingService ? <CheckCircle size={18} className="mr-2" /> : <PlusCircle size={18} className="mr-2" />}
                                    {editingService ? 'Update Fellowship' : 'Schedule Fellowship'}</>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServicesPage;
