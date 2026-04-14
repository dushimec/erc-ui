import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { YouthFormData } from '../../types/forms';
import { toast } from 'react-toastify';

interface YouthFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const YouthForm: React.FC<YouthFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<YouthFormData>({
        name: '',
        idNumber: '',
        phone: '',
        email: '',
        district: '',
        sector: '',
        churchCell: '',
        youthFamily: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!/^[0-9]{16}$/.test(formData.idNumber)) {
            toast.error('ID Number must be exactly 16 digits');
            return;
        }
        if (!/^[0-9]{10,13}$/.test(formData.phone)) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }

        setIsSubmitting(true);

        try {
            await formsApi.submitYouthForm(formData);
            toast.success('Youth form submitted successfully!');
            onClose();
            setFormData({ name: '', idNumber: '', phone: '', email: '', district: '', sector: '', churchCell: '', youthFamily: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Youth Form">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID Number <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            required
                            minLength={16}
                            maxLength={16}
                            pattern="[0-9]{16}"
                            title="ID Number must be exactly 16 digits"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
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
                        minLength={10}
                        maxLength={13}
                        pattern="[0-9]{10,13}"
                        title="Phone number must be between 10 and 13 digits"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            District <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sector <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Church Cell <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="churchCell"
                            value={formData.churchCell}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Youth Family <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="youthFamily"
                            value={formData.youthFamily}
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
        </FormModal>
    );
};

export default YouthForm;
