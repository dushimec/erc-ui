import React, { useState } from 'react';
import { UserPlus, Mail, Phone, User, MapPin, Hash, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { membersApi } from '../api/members';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [memberData, setMemberData] = useState({
        names: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        district: '',
        churchCell: ''
    });

    const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMemberData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Manual validation check
        if (!/^[0-9]{10,13}$/.test(memberData.phoneNumber)) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }
        if (!/^[0-9]{16}$/.test(memberData.idNumber)) {
            toast.error('National ID must be exactly 16 digits');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await membersApi.createMember(memberData);
            if (response.success) {
                toast.success('Member registered successfully!');
                onClose();
                setMemberData({
                    names: '',
                    email: '',
                    phoneNumber: '',
                    idNumber: '',
                    district: '',
                    churchCell: ''
                });
            } else {
                toast.error(response.message || 'Member registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Church Registration" size="sm">
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="text-red-600" size={32} />
                </div>

                <div className="bg-red-50 p-4 rounded-xl mb-6 w-full text-center">
                    <p className="text-red-800 font-medium text-sm">
                        Register as a member in our church database.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Names</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></span>
                        <input
                            type="text" name="names" value={memberData.names} onChange={handleMemberChange} required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Full legal name"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></span>
                            <input
                                type="email" name="email" value={memberData.email} onChange={handleMemberChange} required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Email (optional)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></span>
                            <input
                                type="tel" name="phoneNumber" value={memberData.phoneNumber} onChange={handleMemberChange} required
                                minLength={10}
                                maxLength={13}
                                pattern="[0-9]{10,13}"
                                title="Phone number must be between 10 and 13 digits"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="250..."
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">ID/Passport Number</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Hash size={18} /></span>
                        <input
                            type="text" name="idNumber" value={memberData.idNumber} onChange={handleMemberChange} required
                            minLength={16}
                            maxLength={16}
                            pattern="[0-9]{16}"
                            title="National ID must be exactly 16 digits"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="National ID"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">District</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={18} /></span>
                            <input
                                type="text" name="district" value={memberData.district} onChange={handleMemberChange} required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="District"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Sector</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Home size={18} /></span>
                            <input
                                type="text" name="churchCell" value={memberData.churchCell} onChange={handleMemberChange} required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Sector"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                    {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                    ) : (
                        'Register as Member'
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default RegistrationModal;
