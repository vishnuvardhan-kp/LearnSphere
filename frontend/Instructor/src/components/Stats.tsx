export const Stats = () => {
    const stats = [
        { label: 'Verified Influencers', value: '9,833+' },
        { label: 'Bot Views Blocked', value: '9,83,333+' },
        { label: 'Detection Accuracy', value: '95%' },
        { label: 'Active Campaigns', value: '2,400+' }
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
