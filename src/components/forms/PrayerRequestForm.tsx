import React, { useState } from 'react';
import FormModal from './FormModal';
import { pastoralApi } from '../../api/pastoral';
import type { PrayerRequestData } from '../../types/forms';
import { toast } from 'react-toastify';

interface PrayerRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrayerRequestForm: React.FC<PrayerRequestFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<PrayerRequestData>({
        requesterName: '',
        requesterEmail: '',
        request: '',
        isPrivate: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await pastoralApi.createPrayerRequest(formData);
            if (response.success) {
                toast.success('Your prayer request has been submitted. We are praying for you!');
                setFormData({ requesterName: '', requesterEmail: '', request: '', isPrivate: false });
                onClose();
            }
        } catch (error) {
            toast.error('Failed to submit prayer request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Prayer Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="requesterName"
                        value={formData.requesterName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                        placeholder="Enter your name"
                    />
                </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
                    <textarea
                        name="request"
                        value={formData.request}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all min-h-[120px]"
                        placeholder="How can we pray for you?"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPrivate"
                        name="isPrivate"
                        checked={formData.isPrivate}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                        Keep this request private (Only for pastors)
                    </label>
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
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

export default PrayerRequestForm;
