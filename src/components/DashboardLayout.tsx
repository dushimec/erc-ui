import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useSearch } from '../context/SearchContext';
import {
    Image,
    LayoutDashboard,
    Users,
    UserCircle,
    Calendar,
    Heart,
    DollarSign,
    Mic2,
    FileText,
    Bell,
    LogOut,
    Menu,
    CalendarPlus,
    Search
} from 'lucide-react';
import { authApi } from '../api/auth';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const user = authApi.getCurrentUser();

    const { searchTerm, setSearchTerm } = useSearch();

    // Clear search term when route changes
    useEffect(() => {
        setSearchTerm('');
    }, [location.pathname, setSearchTerm]);

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/dashboard/users', icon: UserCircle },
        { name: 'Members', path: '/dashboard/members', icon: Users },
        { name: 'Fellowships', path: '/dashboard/services', icon: Calendar },
        { name: 'Events', path: '/dashboard/community', icon: CalendarPlus },
        { name: 'Pastoral', path: '/dashboard/pastoral', icon: Heart },
        { name: 'Finance', path: '/dashboard/finance', icon: DollarSign },
        { name: 'Sermons', path: '/dashboard/sermons', icon: Mic2 },
        { name: 'Media', path: '/dashboard/media', icon: Image },
        { name: 'Manage Requests', path: '/dashboard/forms', icon: FileText },
        { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
        { name: 'About', path: '/dashboard/about-mgmt', icon: LayoutDashboard },
        { name: 'Contact', path: '/dashboard/contact-mgmt', icon: Bell },
    ];

    const handleLogout = () => {
        authApi.logout();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-68' : 'w-20'} glass-sidebar shadow-2xl transition-all duration-300 flex flex-col z-30`}>
                <div className="p-6 flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-red-900/40 cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    {isSidebarOpen && <span className="font-bold text-white text-lg tracking-tight">ERChurch</span>}
                </div>

                {/* Nav Items Section */}
                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-8">
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`nav-link group ${isActive ? 'nav-link-active' : ''}`}
                                >
                                    <Icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                                    {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section - Pinned to bottom with mt-auto to create the gap */}
                <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50 space-y-4">
                    {/* Profile Summary */}
                    <div className="flex items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0 text-sm uppercase">
                            {user?.firstName?.charAt(0) || 'U'}
                            {user?.lastName?.charAt(0) || ''}
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                            </div>
                        )}
                    </div>

                    {/* Sign Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-600/10 hover:text-red-500 transition-colors group"
                    >
                        <LogOut className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'} group-hover:translate-x-1 transition-transform`} />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-96 transition-colors focus-within:bg-slate-200 focus-within:ring-2 focus-within:ring-red-100">
                        <Search className="w-5 h-5 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search page content..."
                            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                        <div className="flex items-center space-x-3">
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wider">{user?.role}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* Mobile Toggle Overlay */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden absolute bottom-6 left-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl z-50 animate-bounce"
                    >
                        <Menu size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;
