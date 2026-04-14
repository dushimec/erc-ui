import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';

import DataTable from '../../components/DataTable';
import { financeApi } from '../../api/finance';
import type { Contribution } from '../../types/api';
import { toast } from 'react-toastify';
import { DollarSign, CheckCircle, XCircle, Filter, PlusCircle } from 'lucide-react';

import Modal from '../../components/Modal';
import { membersApi } from '../../api/members';
import type { Member } from '../../types/api';

const FinancePage: React.FC = () => {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchTerm } = useSearch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newContribution, setNewContribution] = useState({
        memberId: '',
        amount: '',
        contributionType: 'TITHE',
        paymentMethod: 'CASH',
        transactionId: '',
        notes: ''
    });

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [contRes, membRes] = await Promise.all([
                financeApi.getAllContributions(),
                membersApi.getAllMembers()
            ]);
            if (contRes.success) setContributions(contRes.data);
            if (membRes.success) setMembers(membRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleVerify = async (id: string) => {
        try {
            const response = await financeApi.verifyContribution(id);
            if (response.success) {
                toast.success('Contribution verified');
                fetchInitialData();
            }
        } catch (error) {
            toast.error('Failed to verify contribution');
        }
    };

    const handleRecordContribution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await financeApi.submitContribution({
                ...newContribution,
                amount: Number(newContribution.amount)
            });
            if (response.success) {
                toast.success('Contribution recorded successfully');
                setIsModalOpen(false);
                setNewContribution({
                    memberId: '', amount: '', contributionType: 'TITHE', paymentMethod: 'CASH', transactionId: '', notes: ''
                });
                fetchInitialData();
            }
        } catch (error) {
            toast.error('Failed to record contribution');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'Date',
            accessor: (c: Contribution) => new Date(c.date).toLocaleDateString()
        },
        {
            header: 'Type',
            accessor: (c: Contribution) => (
                <span className="font-medium text-gray-900">{c.contributionType}</span>
            )
        },
        {
            header: 'Amount',
            accessor: (c: Contribution) => (
                <span className="font-bold text-gray-900">${c.amount.toLocaleString()}</span>
            )
        },
        {
            header: 'Method',
            accessor: 'paymentMethod' as keyof Contribution
        },
        {
            header: 'Status',
            accessor: (c: Contribution) => (
                <div className="flex items-center">
                    {c.verified ? (
                        <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle size={14} className="mr-1" /> Verified
                        </span>
                    ) : (
                        <span className="flex items-center text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                            <XCircle size={14} className="mr-1" /> Pending
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (c: Contribution) => !c.verified && (
                <button
                    onClick={() => handleVerify(c.id)}
                    className="text-red-600 hover:underline text-sm font-medium transition-all"
                >
                    Verify
                </button>
            )
        }
    ];

    const filteredContributions = contributions.filter(c =>
        (c.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contributionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.amount.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
                    <p className="text-sm text-gray-500">Track and verify church contributions and tithes.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm"
                >
                    <DollarSign size={18} className="mr-2" /> Record Contribution
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <Filter size={18} className="mr-2 text-gray-500" /> Filter by Type
                </button>
            </div>

            <DataTable columns={columns} data={filteredContributions} isLoading={isLoading} />


            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title="Record New Contribution"
                size="lg"
            >
                <form onSubmit={handleRecordContribution} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                            <select
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newContribution.memberId}
                                onChange={e => setNewContribution({ ...newContribution, memberId: e.target.value })}
                            >
                                <option value="">Select a member...</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.names} ({m.phoneNumber || m.email})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RWF)</label>
                            <input
                                type="number"
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newContribution.amount}
                                onChange={e => setNewContribution({ ...newContribution, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Type</label>
                            <select
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newContribution.contributionType}
                                onChange={e => setNewContribution({ ...newContribution, contributionType: e.target.value })}
                            >
                                <option value="TITHE">Tithe</option>
                                <option value="OFFERING">Offering</option>
                                <option value="DONATION">Donation</option>
                                <option value="PLEDGE">Pledge</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newContribution.paymentMethod}
                                onChange={e => setNewContribution({ ...newContribution, paymentMethod: e.target.value })}
                            >
                                <option value="MOBILE_MONEY">Mobile Money</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="CASH">Cash</option>
                                <option value="CREDIT_CARD">Credit Card</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / Reference</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                                value={newContribution.transactionId}
                                onChange={e => setNewContribution({ ...newContribution, transactionId: e.target.value })}
                                placeholder="Ref or N/A"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none min-h-[80px]"
                                value={newContribution.notes}
                                onChange={e => setNewContribution({ ...newContribution, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-lg active:scale-95 disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? 'Recording...' : <><PlusCircle size={18} className="mr-2" /> Record Entry</>}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FinancePage;
