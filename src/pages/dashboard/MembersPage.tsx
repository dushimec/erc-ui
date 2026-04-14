import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

import { UserPlus, Pencil, Trash2, PlusCircle } from 'lucide-react';

import { membersApi } from '../../api/members';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import type { Member } from '../../types/api';
import Modal from '../../components/Modal';

const MembersPage: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newMember, setNewMember] = useState({
        names: '',
        phoneNumber: '',
        email: '',
        idNumber: '',
        district: '',
        sector: '',
        cell: '',
        churchCell: '',
        village: '',
        isibo: '',
        dateJoined: new Date().toISOString().split('T')[0]
    });

    const handleAddOrEditMember = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^[0-9]{10,13}$/.test(newMember.phoneNumber)) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }
        if (!/^[0-9]{16}$/.test(newMember.idNumber)) {
            toast.error('National ID must be exactly 16 digits');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = editingMember
                ? await membersApi.updateMember(editingMember.id, newMember)
                : await membersApi.createMember(newMember);

            if (response.success) {
                toast.success(editingMember ? 'Member updated successfully' : 'Member added successfully');
                setIsModalOpen(false);
                setEditingMember(null);
                fetchMembers();
                setNewMember({
                    names: '', phoneNumber: '', email: '', idNumber: '', district: '', sector: '', cell: '', churchCell: '', village: '', isibo: '', dateJoined: new Date().toISOString().split('T')[0]
                });
            }
        } catch (error) {
            toast.error(editingMember ? 'Failed to update member' : 'Failed to add member');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;

        try {
            const response = await membersApi.deleteMember(id);
            if (response.success) {
                toast.success('Member deleted successfully', {
                    progressClassName: 'bg-red-600'
                });
                fetchMembers();
            }
        } catch (error) {
            toast.error('Failed to delete member');
        }
    };

    const openEditModal = (member: Member) => {
        setEditingMember(member);
        setNewMember({
            names: member.names,
            phoneNumber: member.phoneNumber || '',
            email: member.email || '',
            idNumber: member.idNumber || '',
            district: member.district || '',
            sector: member.sector || '',
            cell: member.cell || '',
            churchCell: member.churchCell || '',
            village: '', // Adjust if village exists in Member type
            isibo: '',   // Adjust if isibo exists in Member type
            dateJoined: new Date(member.dateJoined).toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await membersApi.getAllMembers();
            if (response.success) {
                setMembers(response.data);
            }
        } catch (error) {
            toast.error('Failed to load members');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member =>
        member.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Name',
            accessor: 'names' as any
        },
        {
            header: 'Email',
            accessor: 'email' as any
        },
        {
            header: 'Phone',
            accessor: 'phoneNumber' as any
        },
        {
            header: 'National ID',
            accessor: 'idNumber' as any
        },
        {
            header: 'District',
            accessor: 'district' as any
        },
        {
            header: 'Church Cell',
            accessor: 'churchCell' as any
        },

        {
            header: 'Actions',
            accessor: (member: Member) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(member)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
                    <p className="text-sm text-gray-500">View and manage the church membership database.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <UserPlus size={18} className="mr-2" /> Add New Member
                </button>
            </div>



            <DataTable columns={columns} data={filteredMembers} isLoading={isLoading} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setEditingMember(null);
                        setNewMember({
                            names: '', phoneNumber: '', email: '', idNumber: '', district: '', sector: '', cell: '', churchCell: '', village: '', isibo: '', dateJoined: new Date().toISOString().split('T')[0]
                        });
                    }
                }}
                title={editingMember ? "Edit Church Member" : "Register New Church Member"}
                size="lg"
            >
                <form onSubmit={handleAddOrEditMember} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Names</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.names}
                                onChange={e => setNewMember({ ...newMember, names: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                minLength={10}
                                maxLength={13}
                                pattern="[0-9]{10,13}"
                                title="Phone number must be between 10 and 13 digits"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.phoneNumber}
                                onChange={e => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.email}
                                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID/Passport Number</label>
                            <input
                                type="text"
                                required
                                minLength={16}
                                maxLength={16}
                                pattern="[0-9]{16}"
                                title="National ID must be exactly 16 digits"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.idNumber}
                                onChange={e => setNewMember({ ...newMember, idNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.district}
                                onChange={e => setNewMember({ ...newMember, district: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.sector}
                                onChange={e => setNewMember({ ...newMember, sector: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Church Cell</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newMember.churchCell}
                                onChange={e => setNewMember({ ...newMember, churchCell: e.target.value })}
                            />
                        </div>
                    </div>


                    <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingMember(null);
                                setNewMember({
                                    names: '', phoneNumber: '', email: '', idNumber: '', district: '', sector: '', cell: '', churchCell: '', village: '', isibo: '', dateJoined: new Date().toISOString().split('T')[0]

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
                            {isSubmitting ? (editingMember ? 'Updating...' : 'Registering...') : (
                                <>{editingMember ? <Pencil size={18} className="mr-2" /> : <PlusCircle size={18} className="mr-2" />}
                                    {editingMember ? 'Update Member' : 'Register Member'}</>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default MembersPage;

