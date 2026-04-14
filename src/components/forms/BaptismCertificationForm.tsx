import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { BaptismCertificationData } from '../../types/forms';
import { toast } from 'react-toastify';

interface BaptismCertificationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const BaptismCertificationForm: React.FC<BaptismCertificationFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<BaptismCertificationData>({
        name: '',
        email: '',
        phone: '',
        baptismDate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await formsApi.submitBaptismCertification(formData);
            toast.success('Baptism certification submitted successfully!');
            onClose();
            setFormData({ name: '', email: '', phone: '', baptismDate: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Baptism Certification">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baptism Date <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        name="baptismDate"
                        value={formData.baptismDate}
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
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

export default BaptismCertificationForm;
