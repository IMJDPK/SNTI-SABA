import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'personality-types', name: 'Personality Types', count: 8 },
    { id: 'career', name: 'Career Development', count: 6 },
    { id: 'relationships', name: 'Relationships', count: 5 },
    { id: 'self-improvement', name: 'Self-Improvement', count: 3 },
    { id: 'research', name: 'Research & Science', count: 2 }
  ];

  const featuredPost = {
    id: 1,
    title: 'The Complete Guide to Understanding Your MBTI Type',
    excerpt: 'Dive deep into the cognitive functions that shape your personality and learn how to leverage your natural strengths for personal and professional growth.',
    category: 'personality-types',
    author: 'Dr. Sarah Mitchell',
    authorRole: 'Lead Psychologist',
    date: 'November 8, 2025',
    readTime: '12 min read',
    image: '📚',
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: 'INTJ vs INFJ: Understanding the Key Differences',
      excerpt: 'Both are rare introverted types, but their decision-making processes are fundamentally different. Learn what sets these personality types apart.',
      category: 'personality-types',
      author: 'Michael Chen',
      date: 'November 5, 2025',
      readTime: '8 min read',
      image: '🔍'
    },
    {
      id: 3,
      title: 'How to Find the Perfect Career for Your Personality Type',
      excerpt: 'Discover the career paths that align with your cognitive functions and learn how to navigate your professional journey based on your MBTI type.',
      category: 'career',
      author: 'Jennifer Rodriguez',
      date: 'November 2, 2025',
      readTime: '10 min read',
      image: '💼'
    },
    {
      id: 4,
      title: 'The Science Behind MBTI: What Research Says',
      excerpt: 'Exploring the psychological research, validity studies, and neuroscience behind personality typing systems.',
      category: 'research',
      author: 'Dr. Sarah Mitchell',
      date: 'October 28, 2025',
      readTime: '15 min read',
      image: '🔬'
    },
    {
      id: 5,
      title: 'ENFP Relationships: The Complete Compatibility Guide',
      excerpt: 'ENFPs are known for their warmth and enthusiasm. Learn which personality types make the best romantic partners and friends.',
      category: 'relationships',
      author: 'Emma Watson',
      date: 'October 25, 2025',
      readTime: '9 min read',
      image: '💕'
    },
    {
      id: 6,
      title: '10 Signs You\'re an INTP (Even If You Think You\'re Not)',
      excerpt: 'The INTP personality type is often misunderstood. These telltale signs will help you identify if you\'re truly a Logician.',
      category: 'personality-types',
      author: 'Alex Thompson',
      date: 'October 20, 2025',
      readTime: '7 min read',
      image: '🤔'
    },
    {
      id: 7,
      title: 'How Each Personality Type Handles Stress',
      excerpt: 'Understand your stress triggers and learn coping mechanisms tailored to your personality type for better mental health.',
      category: 'self-improvement',
      author: 'Dr. James Lee',
      date: 'October 15, 2025',
      readTime: '11 min read',
      image: '😰'
    },
    {
      id: 8,
      title: 'The ENTJ Leadership Style: Strengths and Challenges',
      excerpt: 'ENTJs are natural leaders, but their commanding style can sometimes create friction. Learn how to lead more effectively.',
      category: 'career',
      author: 'Marcus Johnson',
      date: 'October 10, 2025',
      readTime: '8 min read',
      image: '👔'
    },
    {
      id: 9,
      title: 'ISFJ vs ISFP: The Defender vs The Adventurer',
      excerpt: 'Both are introverted feeling types, but they approach life very differently. Understand the key distinctions.',
      category: 'personality-types',
      author: 'Sophia Martinez',
      date: 'October 5, 2025',
      readTime: '9 min read',
      image: '🌟'
    },
    {
      id: 10,
      title: 'Building Better Teams: The Role of Personality Diversity',
      excerpt: 'Learn how to leverage personality type diversity to create high-performing teams in your organization.',
      category: 'career',
      author: 'Jennifer Rodriguez',
      date: 'September 28, 2025',
      readTime: '12 min read',
      image: '🤝'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'personality-types': 'bg-purple-100 text-purple-800',
      'career': 'bg-blue-100 text-blue-800',
      'relationships': 'bg-pink-100 text-pink-800',
      'self-improvement': 'bg-green-100 text-green-800',
      'research': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 font-display">
              SNTI Insights Blog
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Expert articles on personality types, career development, relationships, and personal growth. 
              Learn from psychologists and personality experts.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-sm font-semibold text-secondary mb-4">⭐ FEATURED ARTICLE</div>
              <div className="card bg-white hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-center bg-gradient-primary text-white rounded-lg text-9xl">
                    {featuredPost.image}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className={`badge ${getCategoryColor(featuredPost.category)} inline-block mb-3 w-fit`}>
                      {categories.find(c => c.id === featuredPost.category)?.name}
                    </span>
                    <h2 className="text-3xl font-bold text-primary-dark mb-4 font-display">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👤</span>
                        <div>
                          <div className="font-semibold text-primary-dark">{featuredPost.author}</div>
                          <div className="text-xs">{featuredPost.authorRole}</div>
                        </div>
                      </div>
                      <span>•</span>
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link to={`/blog/${featuredPost.id}`} className="btn btn-secondary w-fit">
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {searchQuery && (
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  Found <span className="font-bold text-primary">{filteredPosts.length}</span> articles
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="card bg-cream hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="text-6xl mb-4 text-center">{post.image}</div>
                    
                    <span className={`badge ${getCategoryColor(post.category)} inline-block mb-3 w-fit`}>
                      {categories.find(c => c.id === post.category)?.name}
                    </span>

                    <h3 className="text-xl font-bold text-primary-dark mb-3 font-display">
                      {post.title}
                    </h3>

                    <p className="text-gray-700 text-sm mb-4 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="border-t border-gray-200 pt-4 mt-auto">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span className="font-semibold">{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">{post.date}</div>
                      <Link 
                        to={`/blog/${post.id}`}
                        className="btn btn-primary w-full text-sm"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="card bg-gradient-primary text-white text-center">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-3xl font-bold mb-4 font-display">
                Get Weekly Personality Insights
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Join 45,000+ subscribers receiving expert articles on personality types, 
                career development, and personal growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
                />
                <button className="btn btn-secondary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs mt-4 opacity-75">
                ✓ No spam  ✓ Unsubscribe anytime  ✓ Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-dark mb-8 font-display">
              Popular Topics
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Cognitive Functions',
                'Type Comparisons',
                'Career Guidance',
                'Relationship Compatibility',
                'Personal Growth',
                'MBTI Science',
                'Type Indicators',
                'Personality Tests',
                'Work Styles',
                'Communication Tips',
                'Leadership',
                'Team Dynamics'
              ].map((topic, index) => (
                <span
                  key={index}
                  className="badge bg-gray-100 text-gray-700 hover:bg-primary hover:text-white cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-display">
              Discover Your Personality Type
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take our free SNTI assessment to unlock personalized insights and join millions 
              who have discovered their true potential.
            </p>
            <Link to="/mbti-assessment" className="btn btn-secondary text-lg px-10 py-4">
              Take Free Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blog;
