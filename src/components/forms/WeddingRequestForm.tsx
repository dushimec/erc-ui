import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { WeddingRequestData } from '../../types/forms';
import { toast } from 'react-toastify';

interface WeddingRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const WeddingRequestForm: React.FC<WeddingRequestFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<WeddingRequestData>({
        brideName: '',
        groomName: '',
        brideEmail: '',
        groomEmail: '',
        bridePhone: '',
        groomPhone: '',
        marenName: '',
        parenName: '',
        idCopies: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await formsApi.submitWeddingRequest(formData);
            toast.success('Wedding service request submitted successfully!');
            onClose();
            setFormData({
                brideName: '',
                groomName: '',
                brideEmail: '',
                groomEmail: '',
                bridePhone: '',
                groomPhone: '',
                marenName: '',
                parenName: '',
                idCopies: [],
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Wedding Service Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bride Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="brideName"
                            value={formData.brideName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Groom Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="groomName"
                            value={formData.groomName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bride Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="brideEmail"
                            value={formData.brideEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Groom Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="groomEmail"
                            value={formData.groomEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bride Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="bridePhone"
                            value={formData.bridePhone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Groom Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="groomPhone"
                            value={formData.groomPhone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mother Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="marenName"
                            value={formData.marenName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Father Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="parenName"
                            value={formData.parenName}
                            onChange={handleChange}
                            required
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

export default WeddingRequestForm;
