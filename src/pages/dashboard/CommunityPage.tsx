import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

import { MapPin, Calendar, Clock, Plus, CalendarPlus, Image as ImageIcon, X } from 'lucide-react';

import { communityApi } from '../../api/community';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import type { Event } from '../../types/api';
import Modal from '../../components/Modal';

const CommunityPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        eventType: 'CONFERENCE',
        date: new Date().toISOString().slice(0, 16),
        location: '',
        description: '',
        imageUrl: ''
    });


    const handleAddOrEditEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            // Frontend validation: Backend requires date to be in the future
            if (new Date(newEvent.date) < new Date()) {
                toast.error("Event date must be in the future");
                setIsSubmitting(false);
                return;
            }

            // Format date for backend (ISO8601)
            const payload = {
                ...newEvent,
                date: new Date(newEvent.date).toISOString()
            };

            const response = editingEvent
                ? await communityApi.updateEvent(editingEvent.id, payload)
                : await communityApi.createEvent(payload);

            if (response.success) {
                toast.success(editingEvent ? 'Event updated successfully' : 'Event scheduled successfully');
                setIsModalOpen(false);
                setEditingEvent(null);
                fetchEvents();
                setNewEvent({
                    title: '', eventType: 'CONFERENCE', date: new Date().toISOString().slice(0, 16), location: '', description: '', imageUrl: ''
                });

            }
        } catch (error) {
            toast.error(editingEvent ? 'Failed to update event' : 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            const response = await communityApi.deleteEvent(id);
            if (response.success) {
                toast.success('Event deleted successfully', {
                    progressClassName: 'bg-red-600'
                });
                fetchEvents();
            }
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setNewEvent({
            title: event.title,
            eventType: event.eventType,
            date: new Date(event.date).toISOString().split('T').length > 1
                ? new Date(event.date).toISOString().slice(0, 16)
                : new Date(event.date).toISOString().split('T')[0] + 'T00:00',
            location: event.location,
            description: event.description || '',
            imageUrl: event.imageUrl || ''
        });

        setIsModalOpen(true);
    };

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await communityApi.getAllEvents();
            if (response.success) {
                setEvents(response.data);
            }
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const columns = [
        {
            header: 'Event Name',
            accessor: (e: Event) => (
                <div className="flex items-center">
                    {e.imageUrl && (
                        <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-gray-100 shrink-0">
                            <img src={e.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-gray-900">{e.title}</div>
                        <div className="text-xs text-gray-500">{e.eventType}</div>
                    </div>
                </div>

            )
        },
        {
            header: 'Date & Time',
            accessor: (e: Event) => (
                <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {new Date(e.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1">
                        <Clock size={14} className="mr-2" />
                        {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: (e: Event) => (
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-red-500" />
                    {e.location}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (e: Event) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(e)}
                        className="text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors text-xs font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors text-xs font-medium"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Community & Events</h1>
                    <p className="text-sm text-gray-500">Organize and manage church events and registrations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <Plus size={18} className="mr-2" /> Create New Event
                </button>
            </div>

            <DataTable columns={columns} data={filteredEvents} isLoading={isLoading} />


            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setEditingEvent(null);
                        setNewEvent({
                            title: '', eventType: 'CONFERENCE', date: new Date().toISOString().slice(0, 16), location: '', description: '', imageUrl: ''
                        });
                    }
                }}

                title={editingEvent ? "Edit Community Event" : "Schedule New Community Event"}
                size="md"
            >
                <form onSubmit={handleAddOrEditEvent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newEvent.title}
                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                        <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newEvent.eventType}
                            onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })}
                        >
                            <option value="WEDDING">Wedding</option>
                            <option value="BAPTISM">Baptism</option>
                            <option value="CONFERENCE">Conference</option>
                            <option value="RETREAT">Retreat</option>
                            <option value="SEMINAR">Seminar</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newEvent.date}
                            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newEvent.location}
                            onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none h-24"
                            value={newEvent.description}
                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Photo</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {newEvent.imageUrl ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-red-100 group">
                                    <img src={newEvent.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setNewEvent({ ...newEvent, imageUrl: '' })}
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
                                                    setNewEvent({ ...newEvent, imageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                            <div className="text-xs text-gray-500">
                                <p>This photo will be visible to public users.</p>
                                <p className="mt-1">Recommended size: 1200x800px</p>
                            </div>
                        </div>
                    </div>


                    <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingEvent(null);
                                setNewEvent({
                                    title: '', eventType: 'CONFERENCE', date: new Date().toISOString().slice(0, 16), location: '', description: '', imageUrl: ''
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
                            {isSubmitting ? (editingEvent ? 'Updating...' : 'Creating...') : (
                                <>{editingEvent ? <CalendarPlus size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                                    {editingEvent ? 'Update Event' : 'Schedule Event'}</>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CommunityPage;
