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
    Filter,
    GraduationCap
} from 'lucide-react';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [coursePerformance, setCoursePerformance] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [demographics, setDemographics] = useState<any[]>([]);
    const [viewsData, setViewsData] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [statsRes, perfRes, activityRes, revenueRes, demoRes, viewsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/analytics/stats'),
                    fetch('http://localhost:5000/api/analytics/course-performance'),
                    fetch('http://localhost:5000/api/analytics/activity'),
                    fetch('http://localhost:5000/api/analytics/revenue'),
                    fetch('http://localhost:5000/api/analytics/demographics'),
                    fetch('http://localhost:5000/api/analytics/views')
                ]);

                const [statsData, perfData, activityData, revenueData, demoData, viewsDataRaw] = await Promise.all([
                    statsRes.json(),
                    perfRes.json(),
                    activityRes.json(),
                    revenueRes.json(),
                    demoRes.json(),
                    viewsRes.json()
                ]);

                // Map icons to stats
                const statIcons = [DollarSign, Users, BookOpen, GraduationCap];
                const bgColors = ['bg-green-50', 'bg-blue-50', 'bg-purple-50', 'bg-orange-50'];
                const iconColors = ['text-green-600', 'text-[#0ea5e9]', 'text-purple-600', 'text-orange-600'];
                const borderColors = ['border-green-200', 'border-blue-200', 'border-purple-200', 'border-orange-200'];

                setStats(statsData.map((s: any, i: number) => ({
                    ...s,
                    id: i + 1,
                    icon: statIcons[i],
                    bgColor: bgColors[i],
                    iconColor: iconColors[i],
                    borderColor: borderColors[i]
                })));

                setCoursePerformance(perfData);
                setRecentActivity(activityData);
                setMonthlyData(revenueData);
                setDemographics(demoData);
                setViewsData(viewsDataRaw);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#0ea5e9]/30 border-t-[#0ea5e9] rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Analytics...</p>
                </div>
            </div>
        );
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
                                        <p className="text-lg font-bold text-gray-900">
                                            {viewsData.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
                                        </p>
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
                                        <p className="text-lg font-bold text-gray-900">24 mins</p>
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
                                        <p className="text-lg font-bold text-gray-900">+18.2%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg">
                                        <Award className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Verified Mastery</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {recentActivity.filter(a => a.action === 'Completed' || a.action === 'Verified').length || 12}
                                        </p>
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
                                            <span className={`font-medium \${activity.action === 'Completed' ? 'text-green-600' :
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
                                {viewsData.map((data) => {
                                    const views = data.views;
                                    const enrollments = data.enrolments;
                                    const maxValue = 10000;

                                    return (
                                        <div key={data.name} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-gray-700 w-12">{data.name}</span>
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
                                {demographics.map((demo) => (
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
                                    { source: 'Course Sales', amount: 28500, percentage: 63, icon: '📚', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                                    { source: 'Subscriptions', amount: 12300, percentage: 27, icon: '⭐', color: 'text-purple-600', bgColor: 'bg-purple-50' },
                                    { source: 'Certifications', amount: 3200, percentage: 7, icon: '🏆', color: 'text-green-600', bgColor: 'bg-green-50' },
                                    { source: 'Other', amount: 1231, percentage: 3, icon: '💼', color: 'text-orange-600', bgColor: 'bg-orange-50' }
                                ].map((revenue) => (
                                    <div key={revenue.source} className={`flex items-center justify-between p-4 \${revenue.bgColor} rounded-xl border border-gray-100`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{revenue.icon}</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{revenue.source}</p>
                                                <p className="text-xs text-gray-500">{revenue.percentage}% of total</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold \${revenue.color}`}>$\${(revenue.amount / 1000).toFixed(1)}k</p>
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
                                    <p className="text-2xl font-bold text-gray-900">4.2h</p>
                                    <p className="text-xs text-gray-600 mt-1">Avg. Study Time</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <p className="text-2xl font-bold text-gray-900">87%</p>
                                    <p className="text-xs text-gray-600 mt-1">Quiz Pass Rate</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                    <div className="text-3xl mb-2">📈</div>
                                    <p className="text-2xl font-bold text-gray-900">+24%</p>
                                    <p className="text-xs text-gray-600 mt-1">Engagement Up</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                    <div className="text-3xl mb-2">💬</div>
                                    <p className="text-2xl font-bold text-gray-900">4.6</p>
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
