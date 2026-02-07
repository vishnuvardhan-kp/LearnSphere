import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    BookOpen,
    DollarSign,
    Eye,
    Clock,
    Award,
    ArrowUp,
    ArrowDown,
    Download,
    Filter
} from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [coursePerformance, setCoursePerformance] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/reports/analytics');
                const data = res.data;

                // Map Stats
                setStats([
                    {
                        id: 1,
                        title: 'Total Revenue',
                        value: `$${(data.stats?.revenue || 0).toLocaleString()}`,
                        change: '+12.5%', // Mock change for now
                        trend: 'up',
                        icon: DollarSign,
                        color: 'green',
                        bgColor: 'bg-green-50',
                        iconColor: 'text-green-600',
                        borderColor: 'border-green-200'
                    },
                    {
                        id: 2,
                        title: 'Active Students',
                        value: (data.stats?.students || 0).toLocaleString(),
                        change: '+8.2%',
                        trend: 'up',
                        icon: Users,
                        color: 'blue',
                        bgColor: 'bg-blue-50',
                        iconColor: 'text-[#0ea5e9]',
                        borderColor: 'border-blue-200'
                    },
                    {
                        id: 3,
                        title: 'Course Enrollments',
                        value: (data.stats?.enrollments || 0).toLocaleString(),
                        change: '+15.3%',
                        trend: 'up',
                        icon: BookOpen,
                        color: 'purple',
                        bgColor: 'bg-purple-50',
                        iconColor: 'text-purple-600',
                        borderColor: 'border-purple-200'
                    },
                    {
                        id: 4,
                        title: 'Completion Rate',
                        value: `${data.stats?.completionRate || 0}%`,
                        change: '-2.1%',
                        trend: 'down',
                        icon: Award,
                        color: 'orange',
                        bgColor: 'bg-orange-50',
                        iconColor: 'text-orange-600',
                        borderColor: 'border-orange-200'
                    }
                ]);

                // Map Monthly Data
                const mappedMonthly = (data.monthlyData || []).map((m: any) => ({
                    month: m.month,
                    revenue: parseFloat(m.revenue),
                    students: parseInt(m.students),
                    enrollments: parseInt(m.enrollments)
                }));
                // Fill if empty or just set
                setMonthlyData(mappedMonthly.length > 0 ? mappedMonthly : [
                    { month: 'Jan', revenue: 0, students: 0, enrollments: 0 } // Fallback
                ]);

                // Map Course Performance
                setCoursePerformance((data.coursePerformance || []).map((c: any, index: number) => ({
                    id: index + 1,
                    name: c.name,
                    students: parseInt(c.students),
                    revenue: `$${parseFloat(c.revenue).toLocaleString()}`,
                    completion: parseFloat(c.completion).toFixed(1),
                    rating: parseFloat(c.rating).toFixed(1)
                })));

                // Reuse activity logic or fetch from activity endpoint if not included in analytics
                // For now, let's just keep the state empty or mock it if needed, or better, fetch activity again
                // Since getAnalytics logic in backend didn't return recentActivity in my implementation (I commented it out), I should fetch it separately or update backend.
                // I'll fetch it separately here since I already have the endpoint.
                const activityRes = await api.get('/reports/activity');
                setRecentActivity((activityRes.data || []).map((item: any, index: number) => ({
                    id: index + 1,
                    user: item.user || 'Unknown User',
                    action: item.type === 'enrollment' ? 'Enrolled' : 'Completed',
                    course: item.course || 'Unknown Course',
                    time: item.time ? new Date(item.time).toLocaleDateString() : 'Just Now'
                })));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Track your performance and insights</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Time Range Filter */}
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                                {['7d', '30d', '90d', '1y'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                            ? 'bg-white text-[#0ea5e9] shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {range === '7d' && 'Last 7 Days'}
                                        {range === '30d' && 'Last 30 Days'}
                                        {range === '90d' && 'Last 90 Days'}
                                        {range === '1y' && 'Last Year'}
                                    </button>
                                ))}
                            </div>
                            <button className="px-4 py-2 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.id}
                                className={`bg-white rounded-xl border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.trend === 'up'
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-red-50 text-red-600'
                                        }`}>
                                        {stat.trend === 'up' ? (
                                            <ArrowUp className="w-3 h-3" />
                                        ) : (
                                            <ArrowDown className="w-3 h-3" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                                <p className="text-xs text-gray-500 mt-1">Monthly revenue trends</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Simple Bar Chart */}
                        <div className="space-y-4">
                            {monthlyData.map((data, index) => {
                                const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                                const percentage = (data.revenue / maxRevenue) * 100;

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-bold text-gray-700">{data.month}</span>
                                            <span className="font-bold text-[#0ea5e9]">${(data.revenue / 1000).toFixed(0)}k</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg">
                                        <Eye className="w-5 h-5 text-[#0ea5e9]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Total Views</p>
                                        <p className="text-lg font-bold text-gray-900">0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Avg. Watch Time</p>
                                        <p className="text-lg font-bold text-gray-900">0 mins</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Growth Rate</p>
                                        <p className="text-lg font-bold text-gray-900">0%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg">
                                        <Award className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Certificates</p>
                                        <p className="text-lg font-bold text-gray-900">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Performance & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Top Performing Courses */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Courses</h2>
                        <div className="space-y-4">
                            {coursePerformance.map((course, index) => (
                                <div
                                    key={course.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#0ea5e9] transition-all"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{course.name}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs text-gray-500">{course.students} students</span>
                                            <span className="text-xs text-green-600 font-bold">{course.revenue}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-sm font-bold text-gray-900">{course.completion}%</div>
                                        <div className="text-xs text-gray-500">completion</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {activity.user.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-bold">{activity.user}</span>
                                            {' '}
                                            <span className={`font-medium ${activity.action === 'Completed' ? 'text-green-600' :
                                                activity.action === 'Enrolled' ? 'text-blue-600' :
                                                    'text-purple-600'
                                                }`}>
                                                {activity.action}
                                            </span>
                                            {' '}
                                            <span className="text-gray-600">{activity.course}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Explore More Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Explore More</h2>
                            <p className="text-sm text-gray-500 mt-1">Detailed insights and analytics</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Views Analytics */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Views Analytics</h3>
                                    <p className="text-xs text-gray-500 mt-1">Platform traffic over the last week</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                                        <span className="text-gray-600">Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                        <span className="text-gray-600">Enrollments</span>
                                    </div>
                                </div>
                            </div>

                            {/* Simple Line Chart Visualization */}
                            <div className="space-y-3">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                                    const views = [3800, 3200, 9500, 3800, 2400, 3200, 4200][index];
                                    const enrollments = [2500, 1800, 3200, 4200, 2800, 4800, 3800][index];
                                    const maxValue = 10000;

                                    return (
                                        <div key={day} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-gray-700 w-12">{day}</span>
                                                <div className="flex gap-4">
                                                    <span className="text-[#0ea5e9] font-bold">{(views / 1000).toFixed(1)}k</span>
                                                    <span className="text-purple-600 font-bold">{(enrollments / 1000).toFixed(1)}k</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
                                                        style={{ width: `${(views / maxValue) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${(enrollments / maxValue) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Student Demographics */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Student Demographics</h3>
                            <div className="space-y-4">
                                {[
                                    { category: 'Beginners', count: 0, percentage: 0, color: 'bg-blue-500' },
                                    { category: 'Intermediate', count: 0, percentage: 0, color: 'bg-purple-500' },
                                    { category: 'Advanced', count: 0, percentage: 0, color: 'bg-green-500' },
                                    { category: 'Expert', count: 0, percentage: 0, color: 'bg-orange-500' }
                                ].map((demo) => (
                                    <div key={demo.category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${demo.color}`}></div>
                                                <span className="text-sm font-bold text-gray-700">{demo.category}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">{demo.count} students</span>
                                                <span className="text-sm font-bold text-gray-900">{demo.percentage}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full ${demo.color} rounded-full transition-all duration-500`}
                                                style={{ width: `${demo.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Breakdown</h3>
                            <div className="space-y-4">
                                {[
                                    { source: 'Course Sales', amount: 0, percentage: 0, icon: '📚', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                                    { source: 'Subscriptions', amount: 0, percentage: 0, icon: '⭐', color: 'text-purple-600', bgColor: 'bg-purple-50' },
                                    { source: 'Certifications', amount: 0, percentage: 0, icon: '🏆', color: 'text-green-600', bgColor: 'bg-green-50' },
                                    { source: 'Other', amount: 0, percentage: 0, icon: '💼', color: 'text-orange-600', bgColor: 'bg-orange-50' }
                                ].map((revenue) => (
                                    <div key={revenue.source} className={`flex items-center justify-between p-4 ${revenue.bgColor} rounded-xl border border-gray-100`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{revenue.icon}</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{revenue.source}</p>
                                                <p className="text-xs text-gray-500">{revenue.percentage}% of total</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${revenue.color}`}>${(revenue.amount / 1000).toFixed(1)}k</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Insights */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Insights</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                    <div className="text-3xl mb-2">⏱️</div>
                                    <p className="text-2xl font-bold text-gray-900">0h</p>
                                    <p className="text-xs text-gray-600 mt-1">Avg. Study Time</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <p className="text-2xl font-bold text-gray-900">0%</p>
                                    <p className="text-xs text-gray-600 mt-1">Quiz Pass Rate</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                    <div className="text-3xl mb-2">📈</div>
                                    <p className="text-2xl font-bold text-gray-900">0%</p>
                                    <p className="text-xs text-gray-600 mt-1">Engagement Up</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                    <div className="text-3xl mb-2">💬</div>
                                    <p className="text-2xl font-bold text-gray-900">0.0</p>
                                    <p className="text-xs text-gray-600 mt-1">Avg. Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
