import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';

import DataTable from '../../components/DataTable';
import { usersApi } from '../../api/users';
import type { User } from '../../types/api';
import { toast } from 'react-toastify';
import { UserPlus, Pencil, Trash2, Mail, Phone, Shield } from 'lucide-react';
import Modal from '../../components/Modal';
import type { Role } from '../../types/api';
import VerificationModal from '../../components/VerificationModal';
import { CheckCircle } from 'lucide-react';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState<Role>('MEMBER');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'MEMBER' as Role
    });

    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [userToVerify, setUserToVerify] = useState<User | null>(null);



    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await usersApi.createUser(newUser);
            if (response.success) {
                toast.success('System user created successfully');
                setIsAddUserModalOpen(false);
                fetchUsers();
                setNewUser({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'MEMBER' });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await usersApi.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        try {
            setIsSubmitting(true);
            const response = await usersApi.updateRole(selectedUser.id, newRole);
            if (response.success) {
                toast.success('User role updated successfully');
                setIsRoleModalOpen(false);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update user role');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This will perform a soft delete.')) return;
        try {
            const response = await usersApi.deleteUser(id);
            if (response.success) {
                toast.success('User deleted successfully', {
                    progressClassName: 'bg-red-600'
                });
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const columns = [
        {
            header: 'User',
            accessor: (user: User) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200 shadow-sm flex items-center justify-center bg-red-50 text-red-600 font-bold text-xs uppercase">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: (user: User) => (
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                        <Mail className="w-3 h-3 mr-1" /> {user.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <Phone className="w-3 h-3 mr-1" /> {user.phone}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (user: User) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (user: User) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setIsRoleModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Role"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                    >
                        <Trash2 size={16} />
                    </button>
                    {!user.isVerified && (
                        <button
                            onClick={async () => {
                                try {
                                    toast.info(`Sending verification code to ${user.email}...`);
                                    await usersApi.resendVerification(user.id);
                                    setUserToVerify(user);
                                    setIsVerifyModalOpen(true);
                                } catch (error) {
                                    toast.error('Failed to send verification code');
                                }
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Verify User"
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500">Manage all registered users and their roles.</p>
                </div>
                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <UserPlus size={18} className="mr-2" /> Add New User
                </button>
            </div>

            <DataTable columns={columns} data={filteredUsers} isLoading={isLoading} />


            {/* Role Update Modal */}
            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Update User Role"
            >
                <div className="space-y-4">
                    <div className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <Shield size={18} className="mr-2" />
                        Changing role for <strong className="mx-1">{selectedUser?.firstName} {selectedUser?.lastName}</strong>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select New Role</label>
                        <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as Role)}
                        >
                            <option value="MEMBER">Member</option>
                            <option value="PASTOR">Pastor</option>
                            <option value="ADMIN">Admin</option>
                            <option value="CHOIR_LEADER">Choir Leader</option>
                            <option value="DEACON">Deacon</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setIsRoleModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateRole}
                            disabled={isSubmitting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Role'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Create System User"
            >
                <form onSubmit={handleAddUser} className="space-y-4">

                    <p className="text-center text-sm text-gray-500 mb-4">Create a system account with login credentials.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                                <input
                                    type="text"
                                    required
                                    placeholder="John"
                                    className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                    value={newUser.firstName}
                                    onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Doe"
                                    className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                    value={newUser.lastName}
                                    onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                required
                                placeholder="john@example.com"
                                className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="250..."
                                className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newUser.phone}
                                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                        >
                            <option value="MEMBER">Member</option>
                            <option value="PASTOR">Pastor</option>
                            <option value="ADMIN">Admin</option>
                            <option value="CHOIR_LEADER">Choir Leader</option>
                            <option value="DEACON">Deacon</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsAddUserModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-lg disabled:opacity-50 w-full"
                        >
                            {isSubmitting ? 'Creating...' : 'Create System Account'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Manual Verification Modal */}
            {userToVerify && (
                <VerificationModal
                    isOpen={isVerifyModalOpen}
                    onClose={() => {
                        setIsVerifyModalOpen(false);
                        setUserToVerify(null);
                    }}
                    email={userToVerify.email}
                    type="email"
                    onResend={async () => {
                        try {
                            const response = await usersApi.resendVerification(userToVerify.id);
                            if (response.success) {
                                toast.success('A new verification code has been sent!');
                            }
                        } catch (error) {
                            toast.error('Failed to resend verification code');
                        }
                    }}
                    onSuccess={() => {
                        fetchUsers();
                        toast.success(`User ${userToVerify.firstName} has been verified!`);
                    }}
                />
            )}
        </div>
    );
};

export default UsersPage;
