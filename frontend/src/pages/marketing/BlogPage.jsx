import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Clock, ArrowRight, User, Tag, Search, Calendar,
  TrendingUp, Shield, Users, Lightbulb
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const featuredPost = {
  title: "The Future of Earned Wage Access in Africa: 2025 Trends",
  excerpt: "Explore how earned wage access is transforming the financial landscape across East Africa, and what it means for workers and employers alike.",
  author: "Daniel Kimani",
  authorRole: "CEO, EaziWage",
  date: "December 15, 2025",
  readTime: "8 min read",
  category: "Industry Insights",
  image: null
};

const blogPosts = [
  {
    title: "5 Ways EaziWage Reduces Employee Financial Stress",
    excerpt: "Financial stress affects productivity and wellbeing. Here's how on-demand pay is helping workers thrive.",
    author: "Grace Wanjiru",
    date: "December 10, 2025",
    readTime: "5 min read",
    category: "Employee Benefits",
    icon: Users
  },
  {
    title: "Understanding Fee Structures: EaziWage vs Traditional Loans",
    excerpt: "A comprehensive comparison of EaziWage's transparent fees versus the hidden costs of payday loans.",
    author: "Fatima Hassan",
    date: "December 5, 2025",
    readTime: "6 min read",
    category: "Financial Education",
    icon: TrendingUp
  },
  {
    title: "Data Security in FinTech: How We Protect Your Information",
    excerpt: "An inside look at the security measures we use to keep your financial data safe and private.",
    author: "Samuel Osei",
    date: "November 28, 2025",
    readTime: "7 min read",
    category: "Security",
    icon: Shield
  },
  {
    title: "Why HR Leaders Are Embracing Earned Wage Access",
    excerpt: "Discover why forward-thinking companies are adding EWA to their employee benefits package.",
    author: "Grace Wanjiru",
    date: "November 20, 2025",
    readTime: "4 min read",
    category: "HR Insights",
    icon: Users
  },
  {
    title: "Breaking the Payday Loan Cycle: A Kenyan Success Story",
    excerpt: "How one factory worker escaped predatory lending with the help of earned wage access.",
    author: "Peter Njoroge",
    date: "November 15, 2025",
    readTime: "6 min read",
    category: "Success Stories",
    icon: Lightbulb
  },
  {
    title: "Mobile Money Integration: Building for East Africa",
    excerpt: "Technical insights into how we built seamless Mobile Wallet and MTN Mobile Money integrations.",
    author: "Samuel Osei",
    date: "November 8, 2025",
    readTime: "8 min read",
    category: "Technology",
    icon: TrendingUp
  },
];

const categories = [
  'All Posts',
  'Industry Insights',
  'Financial Education',
  'Employee Benefits',
  'HR Insights',
  'Success Stories',
  'Technology',
  'Security'
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState('All Posts');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All Posts' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
              <BookOpen className="w-4 h-4" />
              EaziWage Blog
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Insights & <span className="text-gradient">Stories</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              Expert perspectives on earned wage access, financial wellness, and the future of work in Africa.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 rounded-2xl text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-slate-400 text-sm">Featured</span>
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">DK</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{featuredPost.author}</p>
                      <p className="text-sm text-slate-400">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <p>{featuredPost.date}</p>
                    <p>{featuredPost.readTime}</p>
                  </div>
                </div>
                <Button className="mt-8 w-fit h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-emerald-500/20 min-h-[300px] lg:min-h-full flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/30 rounded-3xl flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {activeCategory === 'All Posts' ? 'Latest Articles' : activeCategory}
          </h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <article 
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                >
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <post.icon className="w-16 h-16 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
                      </div>
                      <span className="text-xs text-slate-500">{post.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Try a different search term or category
              </p>
              <Button onClick={() => { setSearchQuery(''); setActiveCategory('All Posts'); }} variant="outline" className="rounded-xl">
                View All Posts
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Get the latest articles, industry insights, and EaziWage news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="h-14 rounded-xl flex-1"
            />
            <Button className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
