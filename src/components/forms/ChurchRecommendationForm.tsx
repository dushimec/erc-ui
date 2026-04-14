import React, { useState, type FormEvent } from 'react';
import FormModal from './FormModal';
import { formsApi } from '../../api/forms';
import type { ChurchRecommendationData } from '../../types/forms';
import { toast } from 'react-toastify';

interface ChurchRecommendationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChurchRecommendationForm: React.FC<ChurchRecommendationFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<ChurchRecommendationData>({
        type: 'YOUTH',
        idNumber: '',
        name: '',
        email: '',
        phone: '',
        district: '',
        sector: '',
        cellRecommendation: '',
        youthRecommendation: '',
        passportPhoto: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cell' | 'youth' | 'passport') => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Convert file to base64
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    const base64String = reader.result as string;

                    if (fileType === 'cell') {
                        setFormData(prev => ({ ...prev, cellRecommendation: base64String }));
                    } else if (fileType === 'youth') {
                        setFormData(prev => ({ ...prev, youthRecommendation: base64String }));
                    } else if (fileType === 'passport') {
                        setFormData(prev => ({ ...prev, passportPhoto: base64String }));
                    }

                };
            } catch (error) {
                console.error('Error converting file:', error);
                toast.error('Error processing file');
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!/^[0-9]{16}$/.test(formData.idNumber)) {
            toast.error('ID Number must be exactly 16 digits');
            return;
        }
        if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone)) {
            toast.error('Phone number must be between 10 and 13 digits');
            return;
        }

        setIsSubmitting(true);

        try {
            await formsApi.submitChurchRecommendation(formData);
            toast.success('Church recommendation submitted successfully!');
            onClose();
            setFormData({
                type: 'YOUTH',
                idNumber: '',
                name: '',
                email: '',
                phone: '',
                district: '',
                sector: '',
                cellRecommendation: '',
                youthRecommendation: '',
                passportPhoto: ''
            });

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Church Recommendation Form">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    >
                        <option value="YOUTH">Youth</option>
                        <option value="OLD">Old</option>
                    </select>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cell Recommendation <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileChange(e, 'cell')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                </div>

                {formData.type === 'YOUTH' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Youth Recommendation
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={(e) => handleFileChange(e, 'youth')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Passport Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'passport')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                            />
                        </div>
                    </>
                )}

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

export default ChurchRecommendationForm;
