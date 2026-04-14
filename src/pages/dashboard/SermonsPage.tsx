import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

import { Mic2, Pencil, Trash2, Calendar, FileText, UploadCloud, Volume2, Video } from 'lucide-react';
import Modal from '../../components/Modal';
import { sermonsApi } from '../../api/sermons';
import { toast } from 'react-toastify';
import type { Sermon } from '../../types/api';

import DataTable from '../../components/DataTable';

const SermonsPage: React.FC = () => {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { searchTerm } = useSearch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeMedia, setActiveMedia] = useState<{ type: 'audio' | 'video' | 'text', url?: string, content?: string, title: string } | null>(null);
    const [newSermon, setNewSermon] = useState({
        title: '',
        theme: '',
        preacherId: '',
        date: new Date().toISOString().split('T')[0],
        audioUrl: '',
        videoUrl: '',
        text: ''
    });

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    const handleAddOrEditSermon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = editingSermon
                ? await sermonsApi.updateSermon(editingSermon.id, newSermon)
                : await sermonsApi.createSermon(newSermon);

            if (response.success) {
                toast.success(editingSermon ? 'Sermon updated successfully' : 'Sermon added to library');
                setIsModalOpen(false);
                setEditingSermon(null);
                fetchInitialData();
                setNewSermon({
                    title: '', theme: '', preacherId: '', date: new Date().toISOString().split('T')[0], audioUrl: '', videoUrl: '', text: ''
                });
            }
        } catch (error) {
            toast.error(editingSermon ? 'Failed to update sermon' : 'Failed to upload sermon');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSermon = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this sermon?')) return;
        try {
            const response = await sermonsApi.deleteSermon(id);
            if (response.success) {
                toast.success('Sermon deleted successfully', {
                    progressClassName: 'bg-red-600'
                });
                fetchInitialData();
            }
        } catch (error) {
            toast.error('Failed to delete sermon');
        }
    };

    const openEditModal = (sermon: Sermon) => {
        setEditingSermon(sermon);
        setNewSermon({
            title: sermon.title,
            theme: sermon.theme || '',
            preacherId: sermon.preacherId,
            date: new Date(sermon.date).toISOString().split('T')[0],
            audioUrl: sermon.audioUrl || '',
            videoUrl: sermon.videoUrl || '',
            text: sermon.text || ''
        });
        setIsModalOpen(true);
    };

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const response = await sermonsApi.getAllSermons();
            if (response.success) setSermons(response.data);
        } catch (error) {
            toast.error('Failed to load sermon data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);



    const columns = [
        {
            header: 'Sermon Details',
            accessor: (s: Sermon) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-4 text-red-600">
                        <Mic2 size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{s.title}</div>
                        <div className="text-xs text-gray-500">{s.theme || 'No theme specified'}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Date',
            accessor: (s: Sermon) => (
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    {new Date(s.date).toLocaleDateString()}
                </div>
            )
        },
        {
            header: 'Media',
            accessor: (s: Sermon) => (
                <div className="flex space-x-2">
                    {s.audioUrl && (
                        <button
                            onClick={() => setActiveMedia({ type: 'audio', url: s.audioUrl!, title: s.title })}
                            className="p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Play Audio"
                        >
                            <Volume2 size={16} className="text-blue-600" />
                        </button>
                    )}
                    {s.videoUrl && (
                        <button
                            onClick={() => setActiveMedia({ type: 'video', url: s.videoUrl!, title: s.title })}
                            className="p-1 hover:bg-green-50 rounded transition-colors"
                            title="Watch Video"
                        >
                            <Video size={16} className="text-green-600" />
                        </button>
                    )}
                    {s.text && (
                        <button
                            onClick={() => setActiveMedia({ type: 'text', content: s.text!, title: s.title })}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Read Transcript"
                        >
                            <FileText size={16} className="text-gray-400" />
                        </button>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (s: Sermon) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteSermon(s.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const filteredSermons = sermons.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.theme && sermon.theme.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sermon Library</h1>
                    <p className="text-sm text-gray-500">Manage church teachings, transcripts, and media assets.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <Mic2 size={18} className="mr-2" /> Upload New Sermon
                </button>
            </div>

            <DataTable columns={columns} data={filteredSermons} isLoading={isLoading} />


            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setEditingSermon(null);
                        setNewSermon({
                            title: '', theme: '', preacherId: '', date: new Date().toISOString().split('T')[0], audioUrl: '', videoUrl: '', text: ''
                        });
                    }
                }}
                title={editingSermon ? "Edit Sermon Details" : "Add New Sermon to Library"}
                size="lg"
            >
                <form onSubmit={handleAddOrEditSermon} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sermon Title</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newSermon.title}
                                onChange={e => setNewSermon({ ...newSermon, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Theme / Series</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newSermon.theme}
                                onChange={e => setNewSermon({ ...newSermon, theme: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Delivered</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newSermon.date}
                                onChange={e => setNewSermon({ ...newSermon, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL (Optional)</label>
                            <input
                                type="url"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newSermon.audioUrl}
                                onChange={e => setNewSermon({ ...newSermon, audioUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
                            <input
                                type="url"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newSermon.videoUrl}
                                onChange={e => setNewSermon({ ...newSermon, videoUrl: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Summary / Transcript (Optional)</label>
                            <textarea
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none h-32"
                                value={newSermon.text}
                                onChange={e => setNewSermon({ ...newSermon, text: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingSermon(null);
                                setNewSermon({
                                    title: '', theme: '', preacherId: '', date: new Date().toISOString().split('T')[0], audioUrl: '', videoUrl: '', text: ''
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
                            {isSubmitting ? (editingSermon ? 'Updating...' : 'Uploading...') : (
                                <>{editingSermon ? <Pencil size={18} className="mr-2" /> : <UploadCloud size={18} className="mr-2" />}
                                    {editingSermon ? 'Update Sermon' : 'Upload Sermon'}</>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Media Player Modal */}
            <Modal
                isOpen={!!activeMedia}
                onClose={() => setActiveMedia(null)}
                title={activeMedia?.title || 'Media Player'}
                size={activeMedia?.type === 'text' ? 'lg' : 'xl'}
            >
                <div className="flex flex-col items-center justify-center p-4">
                    {activeMedia?.type === 'audio' && (
                        <div className="w-full space-y-4">
                            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <Mic2 size={64} className="animate-pulse text-red-500" />
                            </div>
                            <audio controls className="w-full">
                                <source src={activeMedia.url} />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {activeMedia?.type === 'video' && (
                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                            <iframe
                                src={getEmbedUrl(activeMedia.url!)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {activeMedia?.type === 'text' && (
                        <div className="w-full bg-slate-50 p-6 rounded-xl border border-gray-200 max-h-[60vh] overflow-y-auto">
                            <div className="prose prose-slate max-w-none">
                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed font-inter">
                                    {activeMedia.content}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => setActiveMedia(null)}
                        className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SermonsPage;
