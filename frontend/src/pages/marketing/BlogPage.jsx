import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, ArrowRight, User, Tag, Search, Calendar,
  TrendingUp, Shield, Users, Lightbulb, ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const featuredPost = {
  title: "The Future of Earned Wage Access in Africa: 2026 Trends",
  excerpt: `As we look ahead to 2026, the earned wage access (EWA) industry in Africa stands at an inflection point. Having spent the last decade building EaziWage and witnessing the transformation of financial services across East Africa, I'm more optimistic than ever about what's coming.

The numbers tell a compelling story: the global EWA market is projected to reach $52 billion by 2034, with Africa positioned as one of the fastest-growing regions. In Kenya alone, we've seen a 300% increase in EWA adoption among formal sector employees over the past two years. But this is just the beginning.

**The Shift from Cash Access to Financial Wellness**

The evolution we're witnessing goes far beyond instant wage access. At EaziWage, over 50% of our transactions are now fee-free direct redemptions for essential services—utilities, school fees, healthcare. This shift represents a fundamental change in how workers interact with their earnings.

**AI-Powered Personalization**

In 2026, expect AI to revolutionize EWA. We're deploying machine learning models that analyze transaction patterns to offer personalized budgeting recommendations, predict cash flow needs, and proactively suggest optimal withdrawal timing. This isn't about encouraging more advances—it's about building genuine financial resilience.

**Regulatory Clarity and Trust**

Across East Africa, regulators are beginning to distinguish EWA from predatory payday lending. This regulatory maturation will unlock institutional partnerships and employer adoption at scale. We're actively engaging with central banks in Kenya, Uganda, Tanzania, and Rwanda to shape frameworks that protect workers while enabling innovation.

**The Path Forward**

The workers we serve don't need more debt—they need flexibility. A nurse in Nairobi shouldn't choose between feeding her family and paying for her child's medical emergency. A factory worker in Kampala shouldn't borrow at 30% monthly interest to cover school fees when he's already earned the money.

EWA is not just a financial product. It's a dignity product. And in 2026, we're committed to making it accessible to every worker across Africa who needs it.

*- Jason Crawford, CEO, EaziWage*`,
  author: "Jason Crawford",
  authorRole: "CEO, EaziWage",
  date: "December 15, 2025",
  readTime: "8 min read",
  category: "Industry Insights",
  image: null
};

// Real articles with accessible links
const blogPosts = [
  {
    title: "The Rise of Earned Wage Access Across Africa",
    excerpt: "A deep dive into how EWA is transforming financial access for formal sector employees across the continent.",
    author: "AfriDigest",
    date: "December 2025",
    readTime: "12 min read",
    category: "Industry Insights",
    icon: TrendingUp,
    externalLink: "https://afridigest.com/thought-circle-rise-earned-wage-access-across-africa/"
  },
  {
    title: "Earned Wage Access South Africa: Leading the Charge",
    excerpt: "How South African fintechs like Paymenow and TymeBank are pioneering EWA adoption in the region.",
    author: "WeeTracker",
    date: "August 2025",
    readTime: "8 min read",
    category: "Regional Focus",
    icon: Users,
    externalLink: "https://weetracker.com/2025/08/28/earned-wage-access-south-africa/"
  },
  {
    title: "EWA Trends 2025: The Evolution of Financial Flexibility",
    excerpt: "Comprehensive analysis of global EWA market trends, technology innovations, and growth projections.",
    author: "EBNet",
    date: "2025",
    readTime: "10 min read",
    category: "Market Analysis",
    icon: TrendingUp,
    externalLink: "https://www.ebnet.co.za/earned-wage-access-ewa-trends-2025-the-evolution-of-financial-flexibility/"
  },
  {
    title: "The Future of African Fintech: Trends to Watch 2025-2030",
    excerpt: "Exploring embedded finance, AI credit scoring, and the role of EWA in Africa's fintech evolution.",
    author: "Unipesa",
    date: "2025",
    readTime: "15 min read",
    category: "Fintech Trends",
    icon: Lightbulb,
    externalLink: "https://unipesa.com/blog/the-future-of-african-fintech-trends-to-watch-in-2025-2030"
  },
  {
    title: "Fintech in Africa: The Future Is Being Built in Plain Sight",
    excerpt: "How African fintech startups are leapfrogging traditional banking with innovative solutions.",
    author: "Fintech Futures",
    date: "2025",
    readTime: "7 min read",
    category: "Technology",
    icon: Shield,
    externalLink: "https://www.fintechfutures.com/fintech/fintech-in-africa-the-future-is-being-built-in-plain-sight"
  },
  {
    title: "A Primer on Earned Wage Access",
    excerpt: "Understanding the fundamentals of EWA: how it works, who benefits, and why it matters.",
    author: "AfriDigest",
    date: "2025",
    readTime: "6 min read",
    category: "Financial Education",
    icon: BookOpen,
    externalLink: "https://afridigest.com/primer-earned-wage-access/"
  },
];

const categories = [
  'All Posts',
  'Industry Insights',
  'Financial Education',
  'Regional Focus',
  'Market Analysis',
  'Fintech Trends',
  'Technology'
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState('All Posts');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFullArticle, setShowFullArticle] = React.useState(false);
  const navigate = useNavigate();

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
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6 sm:mb-8">
              <BookOpen className="w-4 h-4" />
              EaziWage Blog
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Insights & <span className="text-gradient">Stories</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10">
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
                className="h-12 sm:h-14 pl-12 pr-4 rounded-2xl text-base sm:text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 sm:py-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
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

      {/* Featured Post - CEO Article */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-slate-400 text-xs sm:text-sm">Featured</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed line-clamp-4">
                  {featuredPost.excerpt.split('\n\n')[0]}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm sm:text-base">JC</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base text-white">{featuredPost.author}</p>
                      <p className="text-xs sm:text-sm text-slate-400">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs sm:text-sm text-slate-400">
                    <p>{featuredPost.date}</p>
                    <p>{featuredPost.readTime}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowFullArticle(!showFullArticle)}
                  className="mt-6 sm:mt-8 w-fit h-10 sm:h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white"
                >
                  {showFullArticle ? 'Collapse Article' : 'Read Full Article'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-emerald-500/20 min-h-[200px] sm:min-h-[300px] lg:min-h-full flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/30 rounded-3xl flex items-center justify-center">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                </div>
              </div>
            </div>
            
            {/* Full Article Content */}
            {showFullArticle && (
              <div className="p-6 sm:p-8 lg:p-12 border-t border-slate-700">
                <div className="prose prose-invert max-w-none">
                  {featuredPost.excerpt.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-slate-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {paragraph.startsWith('**') ? (
                        <strong className="text-white text-base sm:text-lg block mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </strong>
                      ) : paragraph.startsWith('*-') ? (
                        <em className="text-primary block mt-6 sm:mt-8 text-base sm:text-lg">
                          {paragraph.replace(/\*/g, '')}
                        </em>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Grid - External Articles */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">
            {activeCategory === 'All Posts' ? 'Recommended Reading' : activeCategory}
          </h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post, i) => (
                <a 
                  key={i}
                  href={post.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group block"
                >
                  <div className="h-36 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
                    <post.icon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
                      </div>
                      <span className="text-xs text-slate-500">{post.date}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-6">
                Try a different search term or category
              </p>
              <Button onClick={() => { setSearchQuery(''); setActiveCategory('All Posts'); }} variant="outline" className="rounded-xl">
                View All Posts
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
