import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Search, Calendar, Video, Loader2, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { communityApi } from '../api/community';
import { sermonsApi } from '../api/sermons';
import { membersApi } from '../api/members';
import { usersApi } from '../api/users';
import type { Event, Sermon, Member, User } from '../types/api';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, isAdmin = false }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Data States
    const [events, setEvents] = useState<Event[]>([]);
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Filtered States
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const navigate = useNavigate();

    // Fetch data once when modal opens to ensure we have fresh content
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const promises: Promise<any>[] = [
                        communityApi.getAllEvents(),
                        sermonsApi.getAllSermons()
                    ];

                    if (isAdmin) {
                        promises.push(membersApi.getAllMembers());
                        promises.push(usersApi.getAllUsers());
                    }

                    const results = await Promise.all(promises);

                    // Events & Sermons are always index 0 & 1
                    if (results[0].success) setEvents(results[0].data);
                    if (results[1].success) setSermons(results[1].data);

                    // If admin, Members is 2, Users is 3
                    if (isAdmin) {
                        if (results[2]?.success) setMembers(results[2].data);
                        if (results[3]?.success) setUsers(results[3].data);
                    }

                } catch (error) {
                    console.error("Failed to load search data", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
            // Reset search when opening
            setSearchTerm('');
        }
    }, [isOpen, isAdmin]);

    // Filter results when search term changes
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEvents([]);
            setFilteredSermons([]);
            setFilteredMembers([]);
            setFilteredUsers([]);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();

        // Filter Events
        setFilteredEvents(events.filter(e =>
            e.title.toLowerCase().includes(lowerTerm) ||
            (e.description && e.description.toLowerCase().includes(lowerTerm)) ||
            e.location.toLowerCase().includes(lowerTerm)
        ).slice(0, 5));

        // Filter Sermons
        setFilteredSermons(sermons.filter(s =>
            s.title.toLowerCase().includes(lowerTerm) ||
            (s.theme && s.theme.toLowerCase().includes(lowerTerm))
        ).slice(0, 5));

        // Filter Members (Admin Only)
        if (isAdmin) {
            setFilteredMembers(members.filter(m =>
                m.names.toLowerCase().includes(lowerTerm) ||
                (m.email && m.email.toLowerCase().includes(lowerTerm)) ||
                (m.phoneNumber && m.phoneNumber.includes(searchTerm))
            ).slice(0, 5));

            setFilteredUsers(users.filter(u =>
                (u.firstName + ' ' + u.lastName).toLowerCase().includes(lowerTerm) ||
                u.email.toLowerCase().includes(lowerTerm)
            ).slice(0, 5));
        }

    }, [searchTerm, events, sermons, members, users, isAdmin]);

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) return null;

    const hasResults = filteredEvents.length > 0 || filteredSermons.length > 0 || filteredMembers.length > 0 || filteredUsers.length > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                {/* Search Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <Search className="text-gray-400" size={24} />
                    <input
                        type="text"
                        autoFocus
                        placeholder={isAdmin ? t('search.adminPlaceholder') : t('search.placeholder')}
                        className="flex-1 text-lg outline-none placeholder:text-gray-400 text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto bg-gray-50/50">
                    {isLoading ? (
                        <div className="py-12 flex justify-center text-gray-500">
                            <Loader2 className="animate-spin mr-2" /> {t('search.loading')}
                        </div>
                    ) : searchTerm.trim() === '' ? (
                        <div className="py-16 text-center text-gray-400">
                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                            <p>{isAdmin ? t('search.startTypingAdmin') : t('search.startTyping')}</p>
                        </div>
                    ) : !hasResults ? (
                        <div className="py-12 text-center text-gray-500">
                            No results found for "{searchTerm}"
                        </div>
                    ) : (
                        <div className="p-4 space-y-6">
                            {/* Members Section (Admin) */}
                            {filteredMembers.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                        <Users className="w-3 h-3" /> {t('search.members')}
                                    </h3>
                                    <div className="space-y-2">
                                        {filteredMembers.map(member => (
                                            <div
                                                key={member.id}
                                                // Assuming we can navigate to member details or just members page for now
                                                onClick={() => handleNavigate('/dashboard/members')}
                                                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                                    {member.names.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                                        {member.names}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {member.email} • {member.phoneNumber}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Users Section (Admin) */}
                            {filteredUsers.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-gray-400" /> {t('search.systemUsers')}
                                    </h3>
                                    <div className="space-y-2">
                                        {filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleNavigate('/dashboard/users')}
                                                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs flex-shrink-0">
                                                    {user.firstName.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                                        {user.firstName} {user.lastName}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user.email} • {user.role}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Events Section */}
                            {filteredEvents.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                        <Calendar size={14} /> {t('common.events')}
                                    </h3>
                                    <div className="space-y-2">
                                        {filteredEvents.map(event => (
                                            <div
                                                key={event.id}
                                                // If admin, maybe go to edit page? For now standard page or dashboard/community
                                                onClick={() => handleNavigate(isAdmin ? '/dashboard/community' : '/events')}
                                                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0">
                                                    {new Date(event.date).getDate()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                                        {event.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {event.location} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sermons Section */}
                            {filteredSermons.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                        <Video size={14} /> {t('sermons.title')}
                                    </h3>
                                    <div className="space-y-2">
                                        {filteredSermons.map(sermon => (
                                            <div
                                                key={sermon.id}
                                                onClick={() => handleNavigate(isAdmin ? '/dashboard/sermons' : '/sermons')}
                                                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="w-16 h-10 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative">
                                                    {/* Placeholder thumbnail */}
                                                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white/50">
                                                        <Video size={16} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                                        {sermon.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {sermon.theme || t('sermons.sermonSeries')}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-center text-gray-400">
                    {t('search.pressEsc')}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
