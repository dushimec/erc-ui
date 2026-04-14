import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { MarriageCertificateData } from '../../types/forms';
import { toast } from 'react-toastify';

interface MarriageCertificateFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const MarriageCertificateForm: React.FC<MarriageCertificateFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<MarriageCertificateData>({
        brideName: '',
        groomName: '',
        brideEmail: '',
        groomEmail: '',
        bridePhone: '',
        groomPhone: '',
        brideAddress: '',
        groomAddress: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await formsApi.submitMarriageCertificate(formData);
            toast.success('Marriage certificate submitted successfully!');
            onClose();
            setFormData({
                brideName: '',
                groomName: '',
                brideEmail: '',
                groomEmail: '',
                bridePhone: '',
                groomPhone: '',
                brideAddress: '',
                groomAddress: '',
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Marriage Certificate">
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
                            Bride Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="brideAddress"
                            value={formData.brideAddress}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Groom Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="groomAddress"
                            value={formData.groomAddress}
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
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                </div>
            </form>
        </FormModal >
    );
};

export default MarriageCertificateForm;
