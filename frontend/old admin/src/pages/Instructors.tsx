import { useState } from 'react';
import { Search, Plus, Mail, Trash2, Edit, Check, X, User } from 'lucide-react';

// Types
interface Instructor {
    id: number;
    name: string;
    email: string;
    role: string;
    specialization: string;
    courses: number;
    students: number;
    rating: number;
    status: 'active' | 'inactive';
    joinDate: string;
}

// Mock Data
const mockInstructors: Instructor[] = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        email: 'sarah.j@learnsphere.com',
        role: 'Senior Instructor',
        specialization: 'Frontend Development',
        courses: 12,
        students: 4500,
        rating: 4.9,
        status: 'active',
        joinDate: 'Jan 15, 2023'
    },
    {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.c@learnsphere.com',
        role: 'Instructor',
        specialization: 'Backend & Cloud',
        courses: 8,
        students: 3200,
        rating: 4.8,
        status: 'active',
        joinDate: 'Mar 22, 2023'
    },
    {
        id: 3,
        name: 'Jessica Lee',
        email: 'jessica.l@learnsphere.com',
        role: 'Instructor',
        specialization: 'UI/UX Design',
        courses: 5,
        students: 2100,
        rating: 4.7,
        status: 'inactive',
        joinDate: 'Jun 10, 2023'
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.k@learnsphere.com',
        role: 'Lead Instructor',
        specialization: 'Data Science',
        courses: 15,
        students: 5600,
        rating: 4.9,
        status: 'active',
        joinDate: 'Nov 05, 2022'
    }
];

const Instructors = () => {
    const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Add Instructor Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newInstructor, setNewInstructor] = useState({
        name: '',
        email: '',
        specialization: '',
        role: 'Instructor',
        password: '',
        confirmPassword: ''
    });

    const filteredInstructors = instructors.filter((instructor) => {
        const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || instructor.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddInstructor = () => {
        if (!newInstructor.name || !newInstructor.email || !newInstructor.password || !newInstructor.confirmPassword) return;

        if (newInstructor.password !== newInstructor.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const instructor: Instructor = {
            id: instructors.length + 1,
            name: newInstructor.name,
            email: newInstructor.email,
            role: newInstructor.role,
            specialization: newInstructor.specialization || 'General',
            courses: 0,
            students: 0,
            rating: 0,
            status: 'active',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };

        setInstructors([instructor, ...instructors]);
        setNewInstructor({ name: '', email: '', specialization: '', role: 'Instructor', password: '', confirmPassword: '' });
        setShowAddModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Instructors</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage your teaching staff and experts</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-[#0ea5e9]" />
                                <input
                                    type="text"
                                    placeholder="Search instructors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-64 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Instructor</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Instructors</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{instructors.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-[#0ea5e9] rounded-lg">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Members</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">
                                    {instructors.filter(i => i.status === 'active').length}
                                </h3>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Check className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Rated</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">3</h3>
                            </div>
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6">
                    {['All', 'Active', 'Inactive'].map((filter) => {
                        const val = filter.toLowerCase();
                        const isActive = statusFilter === val;
                        return (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(val as any)}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isActive
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>

                {/* Instructors Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Instructor</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Specialization</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Status</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Performance</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Joined</th>
                                    <th className="text-right py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInstructors.map((instructor) => (
                                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                                    {instructor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm group-hover:text-[#0ea5e9] transition-colors">{instructor.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {instructor.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="text-xs font-semibold text-gray-900">{instructor.role}</div>
                                                <div className="text-xs text-gray-500">{instructor.specialization}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${instructor.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${instructor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></span>
                                                {instructor.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> {instructor.students.toLocaleString()} Students</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500">⭐ {instructor.rating} Rating</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                    <span className="text-gray-500">{instructor.courses} Courses</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                                            {instructor.joinDate}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Instructor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Instructor</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={newInstructor.name}
                                    onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                                    placeholder="e.g., Dr. Emily White"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={newInstructor.email}
                                    onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                                    placeholder="e.g., emily@learnsphere.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={newInstructor.password}
                                        onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={newInstructor.confirmPassword}
                                        onChange={(e) => setNewInstructor({ ...newInstructor, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all ${newInstructor.confirmPassword && newInstructor.password !== newInstructor.confirmPassword ? 'border-red-300 focus:border-red-500' : ''
                                            }`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role</label>
                                    <select
                                        value={newInstructor.role}
                                        onChange={(e) => setNewInstructor({ ...newInstructor, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                    >
                                        <option value="Instructor">Instructor</option>
                                        <option value="Senior Instructor">Senior Instructor</option>
                                        <option value="Lead Instructor">Lead Instructor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Specialization</label>
                                    <input
                                        type="text"
                                        value={newInstructor.specialization}
                                        onChange={(e) => setNewInstructor({ ...newInstructor, specialization: e.target.value })}
                                        placeholder="e.g. AI/ML"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddInstructor}
                                disabled={!newInstructor.name || !newInstructor.email || !newInstructor.password || !newInstructor.confirmPassword}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <Check className="w-4 h-4" />
                                Add Instructor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Instructors;
