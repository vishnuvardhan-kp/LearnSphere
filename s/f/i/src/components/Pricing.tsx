import { CheckCircle2 } from 'lucide-react';

const plans = [
    {
        name: 'Open Learning',
        price: '$0',
        period: 'forever free',
        features: [
            'Publicly visible courses',
            'Basic course builder',
            'Community support',
            'Social sharing',
            'Standard player access'
        ],
        button: 'Get Started',
        popular: false
    },
    {
        name: 'Instructor Pro',
        price: '$49',
        period: 'per month',
        features: [
            'Unlimited paid courses',
            'Advanced analytics',
            'Priority email support',
            'Course certifications',
            'Custom branding',
            'Detailed reporting'
        ],
        button: 'Start Teaching',
        popular: true
    },
    {
        name: 'Organization',
        price: 'Custom',
        period: 'contact sales',
        features: [
            'Private invite-only courses',
            'Internal corporate training',
            'Dedicated manager',
            'SSO & API access',
            'White-label solution',
            '24/7 Phone support'
        ],
        button: 'Contact Sales',
        popular: false
    }
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-3">Access & Plans</h2>
                    <p className="text-4xl font-extrabold text-gray-900 mb-4">The Right Access for Every Stage</p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether you are a solo instructor or a global organization, LearnSphere scales with you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-brand-blue shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm'} bg-white transition-all`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                            <div className="mb-8">
                                <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 ml-2">{plan.period}</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}>
                                {plan.button}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
