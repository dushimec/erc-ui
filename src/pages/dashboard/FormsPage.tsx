import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';

import DataTable from '../../components/DataTable';
import { formsApi } from '../../api/forms';
import { certificationApi } from '../../api/certifications';
import { toast } from 'react-toastify';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../../components/Modal';

type FormType = 'MARRIAGE_REQUEST' | 'BAPTISM_REQUEST' | 'YOUTH' | 'CELL' | 'CHURCH' | 'BAPTISM_CERT' | 'MARRIAGE_CERT' | 'WEDDING' | 'DEDICATION';

const FormsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FormType>('MARRIAGE_REQUEST');
    const { searchTerm } = useSearch();
    const [formData, setFormData] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchFormData = async (type: FormType) => {
        try {
            setIsLoading(true);
            let response: any;
            switch (type) {
                case 'MARRIAGE_REQUEST':
                    response = await certificationApi.getAllMarriageRequests();
                    break;
                case 'BAPTISM_REQUEST':
                    response = await certificationApi.getAllBaptismRequests();
                    break;
                case 'YOUTH':
                    response = await formsApi.getAllYouthForms();
                    break;
                case 'CELL':
                    response = await formsApi.getAllCellRecommendations();
                    break;
                case 'CHURCH':
                    response = await formsApi.getAllChurchRecommendations();
                    break;
                case 'BAPTISM_CERT':
                    response = await formsApi.getAllBaptismCertifications();
                    break;
                case 'MARRIAGE_CERT':
                    response = await formsApi.getAllMarriageCertificates();
                    break;
                case 'WEDDING':
                    response = await formsApi.getAllWeddingServiceRequests();
                    break;
                case 'DEDICATION':
                    response = await formsApi.getAllChildDedicationRequests();
                    break;
            }
            if (response?.success) {
                // Handle paginated response
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                setFormData(data);
            } else {
                setFormData([]);
            }
        } catch (error) {
            toast.error(`Failed to load ${type.toLowerCase().replace('_', ' ')} forms`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFormData(activeTab);
    }, [activeTab]);

    const handleConfirm = async (item: any) => {
        try {
            setProcessingId(item.id);
            let response;
            if (activeTab === 'MARRIAGE_REQUEST') {
                response = await certificationApi.confirmMarriageRequest(item.id);
            } else if (activeTab === 'BAPTISM_REQUEST') {
                response = await certificationApi.confirmBaptismRequest(item.id);
            } else {
                const formTypeMap: Record<string, string> = {
                    'YOUTH': 'youth',
                    'CELL': 'cell-recommendation',
                    'CHURCH': 'church-recommendation',
                    'BAPTISM_CERT': 'baptism-certification',
                    'MARRIAGE_CERT': 'marriage-certificate',
                    'WEDDING': 'wedding-request',
                    'DEDICATION': 'child-dedication',
                };
                response = await formsApi.confirmForm(formTypeMap[activeTab], item.id);
            }

            if (response?.success) {
                toast.success('Request confirmed successfully! Email notification sent.');
                fetchFormData(activeTab);
                if (selectedItem?.id === item.id) {
                    setSelectedItem(null);
                }
            }
        } catch (error: any) {
            console.error('Error confirming request:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm request';
            toast.error(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!selectedItem) return;

        try {
            setIsRejecting(true);
            let response;
            if (activeTab === 'MARRIAGE_REQUEST') {
                response = await certificationApi.rejectMarriageRequest(selectedItem.id, rejectionReason);
            } else if (activeTab === 'BAPTISM_REQUEST') {
                response = await certificationApi.rejectBaptismRequest(selectedItem.id, rejectionReason);
            } else {
                const formTypeMap: Record<string, string> = {
                    'YOUTH': 'youth',
                    'CELL': 'cell-recommendation',
                    'CHURCH': 'church-recommendation',
                    'BAPTISM_CERT': 'baptism-certification',
                    'MARRIAGE_CERT': 'marriage-certificate',
                    'WEDDING': 'wedding-request',
                    'DEDICATION': 'child-dedication',
                };
                response = await formsApi.rejectForm(formTypeMap[activeTab], selectedItem.id, rejectionReason);
            }

            if (response?.success) {
                toast.success('Request rejected successfully! Email notification sent.');
                setIsModalOpen(false);
                setRejectionReason('');
                setSelectedItem(null);
                fetchFormData(activeTab);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        } finally {
            setIsRejecting(false);
        }
    };

    const openRejectModal = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'APPROVED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors['PENDING']}`}>
                {status || 'PENDING'}
            </span>
        );
    };

    const getColumns = () => {
        const baseColumns = [
            {
                header: 'Status',
                accessor: (item: any) => getStatusBadge(item.status || 'PENDING')
            },
            {
                header: 'Actions',
                accessor: (item: any) => {
                    const isPending = !item.status || item.status === 'PENDING';
                    const isProcessing = processingId === item.id;

                    return (
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="View Details"
                                disabled={isProcessing}
                            >
                                <Eye size={16} />
                            </button>
                            {isPending && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirm(item);
                                        }}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                                        title="Confirm"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                                        ) : (
                                            <CheckCircle size={16} />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openRejectModal(item);
                                        }}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                        title="Reject"
                                        disabled={isProcessing}
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    );
                }
            }
        ];

        switch (activeTab) {
            case 'MARRIAGE_REQUEST':
                return [
                    { header: 'Bride Name', accessor: 'brideName' },
                    { header: 'Groom Name', accessor: 'groomName' },
                    { header: 'Bride National ID', accessor: 'brideNationalId' },
                    { header: 'Groom National ID', accessor: 'groomNationalId' },
                    { header: 'Bride Email', accessor: 'brideEmail' },
                    { header: 'Groom Email', accessor: 'groomEmail' },
                    { header: 'Wedding Date', accessor: 'weddingDate' },
                    ...baseColumns
                ];
            case 'BAPTISM_REQUEST':
                return [
                    { header: 'Child Name', accessor: 'childName' },
                    { header: 'Requester Email', accessor: 'requesterEmail' },
                    { header: 'Date of Birth', accessor: 'dateOfBirth' },
                    ...baseColumns
                ];
            case 'YOUTH':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'ID Number', accessor: 'idNumber' },
                    { header: 'Phone', accessor: 'phone' },
                    { header: 'District', accessor: 'district' },
                    ...baseColumns
                ];
            case 'CELL':
                return [
                    { header: 'Names', accessor: 'names' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'ID Number', accessor: 'idNumber' },
                    { header: 'Phone', accessor: 'phone' },
                    { header: 'District', accessor: 'district' },
                    ...baseColumns
                ];
            case 'CHURCH':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'ID Number', accessor: 'idNumber' },
                    { header: 'Phone', accessor: 'phone' },
                    { header: 'Type', accessor: 'type' },
                    ...baseColumns
                ];
            case 'BAPTISM_CERT':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'Phone', accessor: 'phone' },
                    { header: 'Baptism Date', accessor: 'baptismDate' },
                    ...baseColumns
                ];
            case 'MARRIAGE_CERT':
                return [
                    { header: 'Bride Name', accessor: 'brideName' },
                    { header: 'Groom Name', accessor: 'groomName' },
                    { header: 'Bride Email', accessor: 'brideEmail' },
                    { header: 'Groom Email', accessor: 'groomEmail' },
                    ...baseColumns
                ];
            case 'WEDDING':
                return [
                    { header: 'Bride Name', accessor: 'brideName' },
                    { header: 'Groom Name', accessor: 'groomName' },
                    { header: 'Bride Email', accessor: 'brideEmail' },
                    { header: 'Groom Email', accessor: 'groomEmail' },
                    ...baseColumns
                ];
            case 'DEDICATION':
                return [
                    { header: 'Parent Names', accessor: 'parentNames' },
                    { header: 'Child Names', accessor: 'childNames' },
                    { header: 'Parent Email', accessor: 'parentEmail' },
                    { header: 'Parent Phone', accessor: 'parentPhone' },
                    { header: 'Dedication Date', accessor: 'dedicationDate' },
                    ...baseColumns
                ];
            default:
                return [
                    { header: 'Detail', accessor: (item: any) => item.name || item.names || item.brideName || item.parentNames || 'Form Submission' },
                    { header: 'Email', accessor: (item: any) => item.email || item.brideEmail || item.requesterEmail || item.parentEmail || 'N/A' },
                    ...baseColumns
                ];
        }
    };

    const tabs: { type: FormType, label: string }[] = [
        { type: 'MARRIAGE_REQUEST', label: 'Marriage Request' },
        { type: 'BAPTISM_REQUEST', label: 'Baptism Request' },
        { type: 'YOUTH', label: 'Youth' },
        { type: 'CELL', label: 'Cell Recommendation' },
        { type: 'CHURCH', label: 'Church Recommendation' },
        { type: 'BAPTISM_CERT', label: 'Baptism Certificate' },
        { type: 'MARRIAGE_CERT', label: 'Marriage Certificate' },
        { type: 'WEDDING', label: 'Wedding Service' },
        { type: 'DEDICATION', label: 'Child Dedication' },
    ];

    const filteredFormData = formData.filter(item =>
        Object.values(item).some(val =>
            val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Request Submissions</h1>
                <p className="text-sm text-gray-500">Review and manage all church requests. Confirm or reject requests to send email notifications.</p>
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab.type)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.type
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <DataTable columns={getColumns()} data={filteredFormData} isLoading={isLoading} />


            {/* Rejection Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setRejectionReason('');
                    setSelectedItem(null);
                }}
                title="Reject Request"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to reject this request? An email notification will be sent to the requester.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason (Optional)
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            placeholder="Provide a reason for rejection..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setRejectionReason('');
                                setSelectedItem(null);
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isRejecting}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject Request'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Details Modal */}
            {selectedItem && !isModalOpen && (
                <Modal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    title="Request Details"
                >
                    <div className="space-y-3">
                        {Object.entries(selectedItem).map(([key, value]) => {
                            // Fields to hide
                            if (['id', 'createdAt', 'updatedAt', 'requesterId', 'brideId', 'groomId', 'approvedById', 'brideIdDocumentUrl', 'groomIdDocumentUrl', 'requesterEmail', 'documentsSubmitted', 'requester'].includes(key)) return null;
                            if (key === 'rejectionReason' && !value) return null;
                            if (value === null || value === undefined || value === '') return null;

                            // Helper to format keys
                            const formatKey = (key: string) => {
                                return key.replace(/([A-Z])/g, ' $1').trim();
                            };

                            // Helper to format values
                            const formatValue = (key: string, value: any) => {
                                if (key.toLowerCase().includes('date') || key.includes('At')) {
                                    try {
                                        return new Date(value).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });
                                    } catch (e) {
                                        return String(value);
                                    }
                                }
                                if (typeof value === 'object' && value !== null) {
                                    if (key === 'requester') {
                                        return `${value.firstName || ''} ${value.lastName || ''} (${value.email || 'No Email'})`.trim();
                                    }
                                    return JSON.stringify(value); // Fallback for other objects
                                }
                                return String(value);
                            };

                            return (
                                <div key={key} className="flex border-b border-gray-100 pb-2 last:border-0">
                                    <span className="font-medium text-gray-700 w-1/3 capitalize">
                                        {formatKey(key)}:
                                    </span>
                                    <span className="text-gray-600 flex-1 break-words">
                                        {formatValue(key, value)}
                                    </span>
                                </div>
                            );
                        })}
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            {(!selectedItem.status || selectedItem.status === 'PENDING') && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleConfirm(selectedItem);
                                            // setSelectedItem(null); // Managed in handleConfirm success
                                        }}
                                        disabled={processingId === selectedItem.id}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {processingId === selectedItem.id ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                                Confirming...
                                            </>
                                        ) : 'Confirm'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true);
                                        }}
                                        disabled={processingId === selectedItem.id}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FormsPage;
