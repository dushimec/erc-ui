import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';
import { pastoralApi } from '../../api/pastoral';
import { usersApi } from '../../api/users';
import type { AppointmentRequestData } from '../../types/forms';
import type { User } from '../../types/api';
import { toast } from 'react-toastify';

interface AppointmentFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<AppointmentRequestData>({
        requesterName: '',
        requesterEmail: '',
        requesterPhone: '',
        preferredDate: '',
        preferredTime: '',
        reason: '',
        pastorId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pastors, setPastors] = useState<User[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchPastors();
        }
    }, [isOpen]);

    const fetchPastors = async () => {
        try {
            const response = await usersApi.getAllUsers({ role: 'PASTOR' });
            if (response.success && response.data) {
                setPastors(response.data);
            } else {

                // Fallback if structure is different
                setPastors([]);
            }
        } catch (error) {
            console.error('Failed to fetch pastors', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^[0-9]{10,13}$/.test(formData.requesterPhone)) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }

        try {
            if (!formData.pastorId) {
                toast.error('Please select a pastor');
                return;
            }

            setIsSubmitting(true);

            // Format data for backend
            const appointmentDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`);

            const payload = {
                purpose: formData.reason,
                duration: 60, // Default duration
                date: appointmentDate.toISOString(),
                pastorId: formData.pastorId,
                requesterName: formData.requesterName,
                requesterEmail: formData.requesterEmail,
                requesterPhone: formData.requesterPhone,
                preferredTime: formData.preferredTime,
                preferredDate: formData.preferredDate
            };

            const response = await pastoralApi.scheduleAppointment(payload);
            if (response.success) {
                toast.success('Your appointment request has been sent. We will contact you soon!');
                setFormData({
                    requesterName: '',
                    requesterEmail: '',
                    requesterPhone: '',
                    preferredDate: '',
                    preferredTime: '',
                    reason: '',
                    pastorId: '',
                });
                onClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to schedule appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Schedule Appointment with Pastor">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="requesterName"
                            value={formData.requesterName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="requesterPhone"
                            value={formData.requesterPhone}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={13}
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                            placeholder="07XX XXX XXX"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="requesterEmail"
                            value={formData.requesterEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Pastor</label>
                        <select
                            name="pastorId"
                            value={formData.pastorId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white"
                        >
                            <option value="">Choose a pastor...</option>
                            {pastors.map(pastor => (
                                <option key={pastor.id} value={pastor.id}>
                                    {pastor.firstName} {pastor.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input
                            type="time"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for appointment</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all min-h-[100px]"
                        placeholder="Briefly describe the purpose of your meeting"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Scheduling...' : 'Send Request'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

export default AppointmentForm;
