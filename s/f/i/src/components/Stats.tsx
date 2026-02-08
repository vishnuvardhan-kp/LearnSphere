export const Stats = () => {
    const stats = [
        { label: 'Courses Published', value: '1,200+' },
        { label: 'Lessons Completed', value: '45,000+' },
        { label: 'Badges Earned', value: '8,900+' },
        { label: 'Active Learners', value: '12,000+' }
    ];

    return (
        <div className="bg-brand-dark py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="text-4xl lg:text-5xl font-extrabold text-white">{stat.value}</div>
                            <div className="text-brand-blue font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
