import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Award, BookOpen, Download } from 'lucide-react';

// Types
interface Student {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'offline';
    courses_enrolled: number;
    completed_courses: number;
    join_date: string;
    location: string;
}

const Learners = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'offline'>('all');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/participants');
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                }
            } catch (error) {
                console.error('Error fetching learners:', error);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Learners</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage learner profiles and progress</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-[#0ea5e9]" />
                                <input
                                    type="text"
                                    placeholder="Search learners..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-64 transition-all"
                                />
                            </div>
                            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Learners</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{students.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-[#0ea5e9] rounded-lg">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                            <span>+12%</span>
                            <span className="text-gray-500">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Learners</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">
                                    {students.filter(s => s.status === 'active' || s.status === 'offline').length}
                                </h3>
                            </div>
                            <div className="p-2 bg-indigo-50 text-[#6366f1] rounded-lg">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                            <span>+5%</span>
                            <span className="text-gray-500">vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {['All', 'Active', 'Offline', 'Inactive'].map((filter) => {
                        const val = filter.toLowerCase();
                        const isActive = statusFilter === val;
                        return (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(val as any)}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${isActive
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {filter}
                            </button>
                        );
                    })}
                    <button className="ml-auto text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-900">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Advanced Filters</span>
                    </button>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Learner Name</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Status</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Contact Info</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Progress</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Joined</th>
                                    <th className="text-right py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#6366f1] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm group-hover:text-[#0ea5e9] transition-colors">{student.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3" />
                                                        {student.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${student.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                student.status === 'offline' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                    'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-green-500' :
                                                    student.status === 'offline' ? 'bg-gray-500' :
                                                        'bg-red-500'
                                                    }`}></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    {student.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    +1 (555) 000-0000
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-semibold text-gray-600">{student.completed_courses}/{student.courses_enrolled} Courses</span>
                                                    <span className="font-bold text-[#0ea5e9]">{student.courses_enrolled > 0 ? Math.round((student.completed_courses / student.courses_enrolled) * 100) : 0}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-[#0ea5e9] h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${student.courses_enrolled > 0 ? (student.completed_courses / student.courses_enrolled) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(student.join_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learners;
