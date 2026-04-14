import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';

import DataTable from '../../components/DataTable';
import { mediaApi } from '../../api/media';
import { toast } from 'react-toastify';
import { File, Video, Trash2, Upload, ExternalLink, Pencil } from 'lucide-react';

import Modal from '../../components/Modal';

const MediaPage: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newMedia, setNewMedia] = useState({
        title: '',
        type: 'IMAGE',
        file: ''
    });

    const [editingMedia, setEditingMedia] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewMedia({ ...newMedia, file: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = editingMedia
                ? await mediaApi.updateMedia(editingMedia.id, newMedia)
                : await mediaApi.uploadMedia(newMedia);

            if (response.success) {
                toast.success(editingMedia ? 'Asset updated successfully' : 'Asset uploaded successfully');
                setIsUploadModalOpen(false);
                setEditingMedia(null);
                fetchMedia();
                setNewMedia({ title: '', type: 'IMAGE', file: '' });
            }
        } catch (error) {
            toast.error(editingMedia ? 'Failed to update asset' : 'Failed to upload asset');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (media: any) => {
        setEditingMedia(media);
        setNewMedia({
            title: media.title || '',
            type: media.type,
            file: '' // Keep empty unless replacing
        });
        setIsUploadModalOpen(true);
    };

    const fetchMedia = async () => {
        try {
            setIsLoading(true);
            const response = await mediaApi.getAllMedia();
            if (response.success) {
                setMediaItems(response.data);
            }
        } catch (error) {
            toast.error('Failed to load media assets');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const columns = [
        {
            header: 'Asset',
            accessor: (m: any) => {
                const isImage = m.type?.startsWith('IMAGE');
                const isVideo = m.type?.startsWith('VIDEO');
                return (
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                            {isImage ? (
                                <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                            ) : isVideo ? (
                                <Video size={20} className="text-red-500" />
                            ) : (
                                <File size={20} className="text-blue-500" />
                            )}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{m.title || 'Untitled Asset'}</div>
                            <div className="text-xs text-gray-500 uppercase">{m.type}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'URL',
            accessor: (m: any) => (
                <a href={m.url} target="_blank" rel="noreferrer" className="text-red-600 hover:underline flex items-center text-xs">
                    View Asset <ExternalLink size={12} className="ml-1" />
                </a>
            )
        },
        {
            header: 'Created At',
            accessor: (m: any) => new Date(m.createdAt).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessor: (m: any) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => mediaApi.deleteMedia(m.id).then(() => fetchMedia())}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const filteredMedia = mediaItems.filter(item =>
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                    <p className="text-sm text-gray-500">Manage cloud-hosted images, videos, and church documents.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMedia(null);
                        setNewMedia({ title: '', type: 'IMAGE', file: '' });
                        setIsUploadModalOpen(true);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <Upload size={18} className="mr-2" /> Upload Asset
                </button>
            </div>

            <DataTable columns={columns} data={filteredMedia} isLoading={isLoading} />


            {/* Upload/Edit Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title={editingMedia ? "Edit Asset" : "Upload New Asset"}
            >
                <form onSubmit={handleUploadOrUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newMedia.title}
                            onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                            placeholder="e.g., Sunday Service Banner"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                        <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newMedia.type}
                            onChange={e => setNewMedia({ ...newMedia, type: e.target.value })}
                        >
                            <option value="IMAGE">Image</option>
                            <option value="VIDEO">Video</option>
                            <option value="DOCUMENT">Document</option>
                        </select>
                    </div>
                    {!editingMedia && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    required={!editingMedia}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept="image/*,video/*,application/pdf"
                                />
                                {newMedia.file ? (
                                    <div className="text-green-600 flex flex-col items-center">
                                        <File size={32} className="mb-2" />
                                        <span className="text-sm font-medium">File selected</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 flex flex-col items-center">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-sm">Click to upload or drag and drop</span>
                                        <span className="text-xs mt-1 text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-lg disabled:opacity-50"
                        >
                            {isSubmitting ? (editingMedia ? 'Updating...' : 'Uploading...') : (editingMedia ? 'Update Asset' : 'Upload Asset')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MediaPage;
