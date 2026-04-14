import React from 'react';
import Skeleton from './Skeleton';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
}

function DataTable<T>({ columns, data, onRowClick, isLoading }: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {columns.map((column, idx) => (
                                <th key={idx} className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {[1, 2, 3, 4, 5].map((rowIdx) => (
                            <tr key={rowIdx}>
                                {columns.map((_, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton variant="text" width="80%" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No records found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                    <tr>
                        {columns.map((column, idx) => (
                            <th
                                key={idx}
                                scope="col"
                                className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                    {data.map((item, rowIdx) => (
                        <tr
                            key={rowIdx}
                            onClick={() => onRowClick?.(item)}
                            className={`group transition-all duration-200 ${onRowClick ? 'hover:bg-slate-50/80 cursor-pointer' : 'hover:bg-slate-50/50'}`}
                        >
                            {columns.map((column, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium group-hover:text-slate-900">
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : (item[column.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
