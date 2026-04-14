import React from 'react';
import { UserCircle, Users, DollarSign, Calendar } from 'lucide-react';
import { usersApi } from '../../api/users';
import { membersApi } from '../../api/members';
import { servicesApi } from '../../api/services';
import { financeApi } from '../../api/finance';
import { communityApi } from '../../api/community';
import { sermonsApi } from '../../api/sermons';
import { overviewApi } from '../../api/overview';
import { Mic2, Heart, ShieldCheck, FileText, CheckCircle, XCircle, Image as ImageIcon, Bell } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const Overview: React.FC = () => {
    const [stats, setStats] = React.useState<any[]>([
        { name: 'Total Users', value: <Skeleton width={40} />, icon: UserCircle, color: 'bg-blue-500' },
        { name: 'Active Members', value: <Skeleton width={40} />, icon: Users, color: 'bg-green-500' },
        { name: 'Total Collections', value: <Skeleton width={60} />, icon: DollarSign, color: 'bg-red-500' },
        { name: 'Upcoming Events', value: <Skeleton width={40} />, icon: Calendar, color: 'bg-purple-500' },
    ]);
    const [recentActivities, setRecentActivities] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchOverviewData = async () => {
        try {
            setIsLoading(true);

            // Fetch stats independently to handle partial failures (e.g. 403 Forbidden for some roles)
            const [usersRes, membersRes, financeRes, eventsRes, sermonsRes, servicesRes, overviewStatsRes] = await Promise.all([
                usersApi.getAllUsers().catch(() => ({ success: false, data: [] })),
                membersApi.getAllMembers().catch(() => ({ success: false, data: [] })),
                financeApi.getAllContributions().catch(() => ({ success: false, data: [] })),
                communityApi.getAllEvents().catch(() => ({ success: false, data: [] })),
                sermonsApi.getAllSermons().catch(() => ({ success: false, data: [] })),
                servicesApi.getAllServices().catch(() => ({ success: false, data: [] })),
                overviewApi.getStats().catch(() => ({ success: false, data: null }))
            ]);

            const getList = (res: any, key: string) => {
                if (!res || !res.success) return null;
                return Array.isArray(res.data) ? res.data : (Array.isArray(res[key]) ? res[key] : []);
            };

            const usersList = getList(usersRes, 'users');
            const membersList = getList(membersRes, 'members');
            const financeList = getList(financeRes, 'contributions');
            const eventsList = getList(eventsRes, 'events');
            const sermonsList = getList(sermonsRes, 'sermons');
            const servicesList = getList(servicesRes, 'services');
            const overviewStats = overviewStatsRes && overviewStatsRes.success ? overviewStatsRes.data : null;

            const totalAmount = financeList
                ? financeList.reduce((sum: number, c: any) => sum + (c.amount || 0), 0)
                : 0;

            const upcomingEventsCount = eventsList
                ? eventsList.filter((e: any) => new Date(e.date) > new Date()).length
                : 0;

            const baptizedCount = membersList
                ? membersList.filter((m: any) => m.baptismDate).length
                : 0;

            const marriedCount = membersList
                ? membersList.filter((m: any) => m.maritalStatus === 'MARRIED').length
                : 0;

            setStats([
                {
                    name: 'Church Services',
                    value: servicesList ? servicesList.length.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: Calendar,
                    color: 'bg-indigo-500'
                },
                {
                    name: 'Total Users',
                    value: usersList ? usersList.length.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: UserCircle,
                    color: 'bg-slate-500'
                },
                {
                    name: 'Active Members',
                    value: membersList ? membersList.length.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: Users,
                    color: 'bg-emerald-500'
                },
                {
                    name: 'Sermons Library',
                    value: sermonsList ? sermonsList.length.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: Mic2,
                    color: 'bg-amber-500'
                },
                {
                    name: 'Service Requests',
                    value: overviewStats ? overviewStats.totalRequests.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: FileText,
                    color: 'bg-blue-400'
                },
                {
                    name: 'Confirmed Requests',
                    value: overviewStats ? overviewStats.totalApproved.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: CheckCircle,
                    color: 'bg-green-400'
                },
                {
                    name: 'Rejected Requests',
                    value: overviewStats ? overviewStats.totalRejected.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: XCircle,
                    color: 'bg-red-400'
                },
                {
                    name: 'Total Media Assets',
                    value: overviewStats ? overviewStats.totalMedia.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: ImageIcon,
                    color: 'bg-orange-500'
                },
                {
                    name: 'Unread Messages',
                    value: overviewStats ? overviewStats.unreadMessages.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: Bell,
                    color: 'bg-rose-600'
                },
                {
                    name: 'Pending Prayer Requests',
                    value: overviewStats ? overviewStats.pendingPrayerRequests.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: Heart,
                    color: 'bg-purple-500'
                },
                {
                    name: 'Pending Appointments',
                    value: overviewStats ? overviewStats.pendingAppointments.toString() : (isLoading ? <Skeleton width={40} /> : '...'),
                    icon: Calendar,
                    color: 'bg-orange-600'
                },
                {
                    name: 'Upcoming Events',
                    value: eventsList ? upcomingEventsCount.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: Calendar,
                    color: 'bg-rose-500'
                },
                {
                    name: 'Total Collections',
                    value: financeList ? `RWF ${totalAmount.toLocaleString()}` : (isLoading ? <Skeleton width={80} /> : 'Restricted'),
                    icon: DollarSign,
                    color: 'bg-blue-500'
                },
                {
                    name: 'Baptized Members',
                    value: membersList ? baptizedCount.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: ShieldCheck,
                    color: 'bg-sky-500'
                },
                {
                    name: 'Married Couples',
                    value: membersList ? marriedCount.toString() : (isLoading ? <Skeleton width={40} /> : 'Restricted'),
                    icon: Heart,
                    color: 'bg-pink-500'
                },
            ]);

            // Mocking recent activities
            if (usersList) {
                const activities = usersList.slice(0, 5).map((u: any) => ({
                    id: u.id,
                    type: 'New user registered',
                    detail: `${u.firstName} ${u.lastName}`,
                    time: 'Recently'
                }));
                setRecentActivities(activities);
            } else if (membersList) {
                const activities = membersList.slice(0, 5).map((m: any) => ({
                    id: m.id,
                    type: 'New member added',
                    detail: m.names,
                    time: 'Recently'
                }));
                setRecentActivities(activities);
            }

        } catch (error) {
            console.error('Overview error:', error);
            // We don't toast error here because we handle partial successes
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOverviewData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="glass-card p-6 rounded-2xl flex items-center transition-all duration-300 hover:shadow-xl">
                            <div className={`${stat.color} p-4 rounded-xl text-white mr-4 shadow-lg`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.name}</div>
                                <div className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Financial Growth</h2>
                            <p className="text-sm text-slate-500">Revenue performance over the last 12 months</p>
                        </div>
                        <div className="flex space-x-2">
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+12.5%</span>
                        </div>
                    </div>
                    <div className="h-72 flex items-end justify-between space-x-3 px-2">
                        {[40, 70, 45, 90, 65, 80, 55, 60, 85, 95, 75, 100].map((h, i) => (
                            <div key={i} className="group relative flex-1 flex flex-col justify-end">
                                <div
                                    className="bg-red-600/90 hover:bg-red-600 rounded-t-lg w-full transition-all duration-500 cursor-pointer relative overflow-hidden group"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(h * 1000).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activities</h2>
                    <div className="flex-1 space-y-6">
                        {isLoading ? (
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map(_ => (
                                    <div key={_} className="flex items-center space-x-4">
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton variant="text" width="60%" />
                                            <Skeleton variant="text" width="40%" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="relative pl-8 pb-4 group last:pb-0">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100 group-last:hidden"></div>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-red-500 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">{activity.type}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{activity.detail} • {activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Users className="text-slate-300" size={32} />
                                </div>
                                <p className="text-slate-400 text-sm italic font-medium">No recent activities found.</p>
                            </div>
                        )}
                    </div>
                    <button className="mt-8 w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                        View All Activities
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
