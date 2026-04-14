import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { certificationApi } from '../../api/certifications';
import type { BaptismRequestData } from '../../types/forms';
import { toast } from 'react-toastify';

interface BaptismRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const BaptismRequestForm: React.FC<BaptismRequestFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<BaptismRequestData>({
        childName: '',
        dateOfBirth: '',
        requesterEmail: '',
        requesterPhone: '',
        requesterId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!/^[0-9]{10,13}$/.test(formData.requesterPhone || '')) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }

        setIsSubmitting(true);
        try {
            await certificationApi.submitBaptismRequest(formData);
            toast.success('Baptism request submitted successfully!');
            onClose();
            setFormData({ childName: '', dateOfBirth: '', requesterEmail: '', requesterPhone: '', requesterId: '' });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '';
            if (errorMessage.includes("relation 'Requester'")) {
                toast.error('the Requester ID was not found. Please ensure you are logged in or provide a valid ID.');
            } else {
                toast.error(errorMessage || 'Failed to submit request');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Baptism Certification Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-600">*</span>
                    </label>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email (for notification) <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="email"
                        name="requesterEmail"
                        value={formData.requesterEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

export default BaptismRequestForm;
