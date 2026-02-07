import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import {
    Search, Filter, Building2, MapPin, DollarSign,
    Send, Check, Briefcase, Users
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export const InfluencerPartnerships = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    // Fetch companies from backend
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('botfree_token');
                const res = await fetch(API_ENDPOINTS.ONBOARDING_COMPANIES, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setCompanies(data);
                }
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setLoading(false);
            }
        };

        // Load sent requests from localStorage
        const saved = localStorage.getItem('influencer_sent_requests');
        if (saved) {
            setSentRequests(JSON.parse(saved));
        }

        fetchCompanies();
    }, []);

    const handleSendRequest = (companyId: string, companyName: string) => {
        if (sentRequests.includes(companyId)) return;

        const updated = [...sentRequests, companyId];
        setSentRequests(updated);
        localStorage.setItem('influencer_sent_requests', JSON.stringify(updated));

        // Show success message
        alert(`Partnership request sent to ${companyName}! They will review your profile.`);
    };

    const filteredCompanies = companies.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.onboardingData?.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRequestStatus = (companyId: string) => {
        return sentRequests.includes(companyId);
    };

    return (
        <DashboardLayout role="influencer">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Partnership Opportunities</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Discover and connect with brands looking for authentic creators.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Requests Sent</div>
                        <div className="text-xl font-black text-brand-blue">{sentRequests.length}</div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
                <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-xl w-full md:w-auto shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue transition-all">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by company name or industry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Companies Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">No Companies Found</h3>
                    <p className="text-gray-500 text-sm font-medium mb-8 max-w-sm mx-auto">
                        {searchTerm ? 'Try adjusting your search criteria.' : 'Check back soon for new partnership opportunities.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => {
                        const isRequested = getRequestStatus(company._id);

                        return (
                            <div
                                key={company._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-premium transition-all duration-500"
                            >
                                {/* Header with gradient */}
                                <div className="relative h-32 bg-gradient-to-br from-brand-blue to-blue-600 overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                                    <div className="absolute -bottom-8 left-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                                            <Building2 className="w-8 h-8 text-brand-blue" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-12 p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1 group-hover:text-brand-blue transition-colors">
                                            {company.name || 'Unnamed Company'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Briefcase className="w-3 h-3" />
                                            <span>{company.onboardingData?.industry || 'General'}</span>
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    <div className="space-y-2 mb-6">
                                        {company.onboardingData?.location && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="font-medium">{company.onboardingData.location}</span>
                                            </div>
                                        )}
                                        {company.onboardingData?.budget && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="font-medium">Budget: {company.onboardingData.budget}</span>
                                            </div>
                                        )}
                                        {company.onboardingData?.targetAudience && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="font-medium">{company.onboardingData.targetAudience}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Goals/Interests */}
                                    {company.onboardingData?.goals && company.onboardingData.goals.length > 0 && (
                                        <div className="mb-6">
                                            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Campaign Goals</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {company.onboardingData.goals.slice(0, 3).map((goal: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-brand-blue/5 text-brand-blue rounded-lg text-[10px] font-bold"
                                                    >
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleSendRequest(company._id, company.name)}
                                        disabled={isRequested}
                                        className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isRequested
                                            ? 'bg-green-50 text-green-600 border-2 border-green-100 cursor-not-allowed'
                                            : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20 active:scale-95'
                                            }`}
                                    >
                                        {isRequested ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Request Sent
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Partnership Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
};
