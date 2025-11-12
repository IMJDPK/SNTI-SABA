import React from 'react';
import { Link } from 'react-router-dom';

function ForTeams() {
  const teamBenefits = [
    {
      icon: '🤝',
      title: 'Enhanced Team Dynamics',
      description: 'Understand each team member\'s communication style, work preferences, and collaboration patterns for smoother teamwork.',
      metric: '87% reduction in team conflicts'
    },
    {
      icon: '🎯',
      title: 'Optimized Role Assignment',
      description: 'Place team members in roles that align with their natural strengths and cognitive functions for peak performance.',
      metric: '42% productivity increase'
    },
    {
      icon: '💬',
      title: 'Improved Communication',
      description: 'Bridge communication gaps by understanding how different personality types process information and express ideas.',
      metric: '93% report better clarity'
    },
    {
      icon: '🚀',
      title: 'Leadership Development',
      description: 'Identify leadership potential and develop management strategies tailored to each personality type.',
      metric: '68% faster promotions'
    },
    {
      icon: '⚡',
      title: 'Conflict Resolution',
      description: 'Address team conflicts with personality-aware strategies that respect individual differences and working styles.',
      metric: '76% faster resolution'
    },
    {
      icon: '📈',
      title: 'Performance Optimization',
      description: 'Create workflows and processes that leverage each personality type\'s unique contributions to team success.',
      metric: '54% higher output'
    }
  ];

  const useCases = [
    {
      title: 'Corporate Teams',
      description: 'Enhance collaboration and productivity across departments',
      icon: '🏢',
      features: ['Team building workshops', 'Leadership development', 'Hiring optimization', 'Communication training']
    },
    {
      title: 'Startups',
      description: 'Build balanced founding teams and scale culture',
      icon: '💡',
      features: ['Founder compatibility', 'Early hiring strategy', 'Culture building', 'Role clarity']
    },
    {
      title: 'Remote Teams',
      description: 'Bridge distance with personality-aware communication',
      icon: '🌐',
      features: ['Virtual collaboration', 'Async communication', 'Team bonding', 'Work-life balance']
    },
    {
      title: 'Project Teams',
      description: 'Form high-performing cross-functional teams',
      icon: '⚙️',
      features: ['Skill complementarity', 'Agile workflows', 'Deadline management', 'Innovation facilitation']
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$299',
      period: '/team/month',
      description: 'Perfect for small teams just getting started',
      features: [
        'Up to 10 team members',
        'Basic personality assessments',
        'Team compatibility report',
        'Email support',
        'Basic analytics dashboard',
        '1 team building session'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$799',
      period: '/team/month',
      description: 'Ideal for growing teams and departments',
      features: [
        'Up to 50 team members',
        'Advanced personality profiles',
        'Team dynamics analysis',
        'Priority support',
        'Advanced analytics & insights',
        'Quarterly team workshops',
        'Custom role recommendations',
        'Leadership development module'
      ],
      cta: 'Get Started',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For organizations with multiple teams',
      features: [
        'Unlimited team members',
        'White-label option',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'On-site training sessions',
        'Advanced reporting & BI',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const testimonials = [
    {
      company: 'TechCorp Solutions',
      industry: 'Technology',
      quote: 'SNTI Teams transformed how we build our engineering teams. We reduced onboarding time by 40% and improved cross-team collaboration significantly.',
      name: 'Jennifer Wu',
      role: 'VP of Engineering',
      logo: '🏢',
      teamSize: '250 employees'
    },
    {
      company: 'GrowthHub Marketing',
      industry: 'Marketing Agency',
      quote: 'Understanding our team\'s personality dynamics helped us assign clients to the right account managers. Client satisfaction scores increased by 32%.',
      name: 'Marcus Johnson',
      role: 'CEO',
      logo: '📈',
      teamSize: '45 employees'
    },
    {
      company: 'EduTech Innovations',
      industry: 'Education',
      quote: 'We use SNTI Teams for hiring and team formation. It\'s been instrumental in building a collaborative culture across our remote workforce.',
      name: 'Dr. Priya Sharma',
      role: 'Chief People Officer',
      logo: '🎓',
      teamSize: '120 employees'
    }
  ];

  const integrations = [
    { name: 'Slack', icon: '💬', description: 'Team insights in your workspace' },
    { name: 'Microsoft Teams', icon: '📊', description: 'Seamless collaboration' },
    { name: 'Asana', icon: '✅', description: 'Project management sync' },
    { name: 'Jira', icon: '🔧', description: 'Developer team optimization' },
    { name: 'BambooHR', icon: '👥', description: 'HR integration' },
    { name: 'Zoom', icon: '🎥', description: 'Virtual team building' }
  ];

  return (
    <div className="for-teams">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-semibold mb-4 shadow-md">
              🏢 Enterprise Team Assessment
            </span>
            <h1 className="text-5xl font-bold mb-6 font-display">
              Build High-Performing Teams with SNTI Team Assessment
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Unlock your team's potential with personality-driven insights. Improve collaboration, 
              reduce conflicts, and optimize performance across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact-sales" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-bold transition-colors inline-block">
                Schedule Demo
              </Link>
              <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white text-lg px-8 py-4 border-2 border-white rounded-lg font-bold transition-colors">
                Download Case Study
              </button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              ✓ Trusted by 2,500+ companies  ✓ 87% reduction in team conflicts  ✓ 42% productivity increase
            </p>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-600 mb-6 font-semibold">TRUSTED BY LEADING ORGANIZATIONS</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-4xl opacity-60">🏢 Google</div>
            <div className="text-4xl opacity-60">💼 Microsoft</div>
            <div className="text-4xl opacity-60">🚀 SpaceX</div>
            <div className="text-4xl opacity-60">📱 Meta</div>
            <div className="text-4xl opacity-60">🎯 Amazon</div>
            <div className="text-4xl opacity-60">⚡ Tesla</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Why Organizations Choose SNTI Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data-driven insights to transform your team dynamics and organizational performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamBenefits.map((benefit, index) => (
              <div key={index} className="card bg-white hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <div className="inline-block px-3 py-1 bg-secondary-light text-secondary-dark text-sm font-semibold rounded-full">
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Perfect for Every Team Type
            </h2>
            <p className="text-xl text-gray-600">
              From startups to enterprises, SNTI Teams adapts to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="card bg-cream hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-primary-dark mb-2 text-center">{useCase.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">{useCase.description}</p>
                <div className="border-t border-gray-200 pt-4">
                  <ul className="space-y-2">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-display">
              How SNTI Teams Works
            </h2>
            <p className="text-xl opacity-90">
              Simple implementation, powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Onboard Your Team</h3>
              <p className="opacity-90">
                Invite team members via email. Each takes a 20-minute personality assessment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Team Analysis</h3>
              <p className="opacity-90">
                Our AI analyzes team dynamics, communication patterns, and collaboration potential.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply Insights</h3>
              <p className="opacity-90">
                Use recommendations for role assignment, communication strategies, and conflict resolution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 text-blue-600 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="opacity-90">
                Monitor team performance metrics and engagement through our analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your team size and needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`card ${plan.highlighted ? 'border-4 border-secondary shadow-xl' : 'bg-white'} relative`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary text-primary-dark px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-dark mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`btn w-full ${plan.highlighted ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600">
              SNTI Teams works with the tools your team already uses
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {integrations.map((integration, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-cream rounded-lg flex items-center justify-center text-4xl mx-auto mb-3 hover:shadow-md transition-shadow cursor-pointer">
                  {integration.icon}
                </div>
                <div className="font-semibold text-gray-800">{integration.name}</div>
                <div className="text-xs text-gray-600 mt-1">{integration.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4 font-display">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">{testimonial.logo}</div>
                  <div>
                    <div className="font-bold text-primary-dark">{testimonial.company}</div>
                    <div className="text-sm text-gray-600">{testimonial.industry}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-primary-dark">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500 mt-1">{testimonial.teamSize}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-display">
              Ready to Transform Your Team?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 2,500+ organizations using SNTI Teams to build better, more collaborative workplaces. 
              Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact-sales" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 rounded-lg font-bold transition-colors inline-block">
                Schedule a Demo
              </Link>
              <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white text-lg px-10 py-4 border-2 border-white rounded-lg font-bold transition-colors">
                Start Free Trial
              </button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              ✓ No credit card required  ✓ 14-day free trial  ✓ Setup in under 10 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForTeams;
