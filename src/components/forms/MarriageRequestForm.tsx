import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { certificationApi } from '../../api/certifications';
import type { MarriageRequestData } from '../../types/forms';
import { toast } from 'react-toastify';

interface MarriageRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const MarriageRequestForm: React.FC<MarriageRequestFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<MarriageRequestData>({
        brideId: '',
        groomId: '',
        brideName: '',
        bridePhone: '',
        brideEmail: '',
        brideNationalId: '',
        groomName: '',
        groomPhone: '',
        groomEmail: '',
        groomNationalId: '',
        requesterEmail: '',
        weddingDate: '',
        location: '',
        witness1Name: '',
        witness1Phone: '',
        witness2Name: '',
        witness2Phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const phoneFields = [
            { name: 'Bride Phone', value: formData.bridePhone },
            { name: 'Groom Phone', value: formData.groomPhone },
            { name: 'Witness 1 Phone', value: formData.witness1Phone },
            { name: 'Witness 2 Phone', value: formData.witness2Phone },
        ];

        for (const field of phoneFields) {
            if (!/^[0-9]{10,13}$/.test(field.value)) {
                toast.error(`${field.name} must be between 10 and 13 digits`);
                return;
            }
        }

        const idFields = [
            { name: 'Bride National ID', value: formData.brideNationalId },
            { name: 'Groom National ID', value: formData.groomNationalId },
        ];

        for (const field of idFields) {
            if (!/^[0-9]{16}$/.test(field.value)) {
                toast.error(`${field.name} must be exactly 16 digits`);
                return;
            }
        }

        setIsSubmitting(true);

        // Sanitize payload: remove empty strings for optional IDs
        const payload = {
            ...formData,
            brideId: formData.brideId?.trim() || undefined,
            groomId: formData.groomId?.trim() || undefined,
        };

        try {
            await certificationApi.submitMarriageRequest(payload);
            toast.success('Marriage request submitted successfully!');
            onClose();
            // Reset form
            setFormData({
                brideId: '',
                groomId: '',
                brideName: '',
                bridePhone: '',
                brideEmail: '',
                brideNationalId: '',
                groomName: '',
                groomPhone: '',
                groomEmail: '',
                groomNationalId: '',
                requesterEmail: '',
                weddingDate: '',
                location: '',
                witness1Name: '',
                witness1Phone: '',
                witness2Name: '',
                witness2Phone: '',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '';
            if (errorMessage.includes("relation 'Bride'")) {
                toast.error('The provided Bride ID was not found in our records. Please verify and try again.');
            } else if (errorMessage.includes("relation 'Groom'")) {
                toast.error('The provided Groom ID was not found in our records. Please verify and try again.');
            } else {
                toast.error(errorMessage || 'Failed to submit request');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Marriage Certification Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            Bride Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="bridePhone"
                            value={formData.bridePhone}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={13}
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bride National ID <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="brideNationalId"
                            value={formData.brideNationalId}
                            onChange={handleChange}
                            required
                            minLength={16}
                            maxLength={16}
                            pattern="[0-9]{16}"
                            title="National ID must be exactly 16 digits"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            minLength={10}
                            maxLength={13}
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Groom National ID <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="groomNationalId"
                            value={formData.groomNationalId}
                            onChange={handleChange}
                            required
                            minLength={16}
                            maxLength={16}
                            pattern="[0-9]{16}"
                            title="National ID must be exactly 16 digits"
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
                            Wedding Date <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="date"
                            name="weddingDate"
                            value={formData.weddingDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                    <div>
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
                </div>



                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Witness 1 Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="witness1Name"
                            value={formData.witness1Name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Witness 1 Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="witness1Phone"
                            value={formData.witness1Phone}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={13}
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Witness 2 Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="witness2Name"
                            value={formData.witness2Name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Witness 2 Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="witness2Phone"
                            value={formData.witness2Phone}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={13}
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
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

export default MarriageRequestForm;
