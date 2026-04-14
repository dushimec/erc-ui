import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { ChildDedicationData } from '../../types/forms';
import { toast } from 'react-toastify';

interface ChildDedicationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChildDedicationForm: React.FC<ChildDedicationFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<ChildDedicationData>({
        parentNames: '',
        childNames: '',
        dateOfBirth: '',
        parentPhone: '',
        parentEmail: '',
        dedicationDate: '',
        churchService: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await formsApi.submitChildDedication(formData);
            toast.success('Child dedication request submitted successfully!');
            onClose();
            setFormData({
                parentNames: '',
                childNames: '',
                dateOfBirth: '',
                parentPhone: '',
                parentEmail: '',
                dedicationDate: '',
                churchService: '',
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Child Dedication Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Names <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="parentNames"
                            value={formData.parentNames}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Child Names <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="childNames"
                            value={formData.childNames}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dedication Date <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="date"
                            name="dedicationDate"
                            value={formData.dedicationDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Church Service <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="churchService"
                            value={formData.churchService}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Sunday Morning Service"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
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

export default ChildDedicationForm;
