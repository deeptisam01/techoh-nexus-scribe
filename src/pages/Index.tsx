
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Flame, Clock, LayoutGrid, LayoutList } from "lucide-react";

// Mock data
const featuredArticle = {
  id: "1",
  title: "Building Scalable Web Applications with React and TypeScript in 2025",
  excerpt: "Learn how to build modern, scalable web applications using React and TypeScript with the latest best practices and tools available in 2025. We'll cover everything from project setup to deployment.",
  coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
  slug: "building-scalable-web-applications-react-typescript-2025",
  publishedAt: new Date("2025-03-15"),
  readTime: 12,
  author: {
    name: "Alex Johnson",
    username: "alexjohnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  tags: [
    { id: "1", name: "React", slug: "react" },
    { id: "2", name: "TypeScript", slug: "typescript" },
    { id: "3", name: "Web Development", slug: "web-development" },
  ],
  likes: 248,
  comments: 42,
  isLiked: false,
  isBookmarked: false,
};

const articles = [
  {
    id: "2",
    title: "The Future of AI in Software Development: Trends and Predictions",
    excerpt: "AI is transforming how we build software. From code generation to automated testing, discover what the future holds for developers in the AI era.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2232&auto=format&fit=crop",
    slug: "future-ai-software-development-trends-predictions",
    publishedAt: new Date("2025-04-02"),
    readTime: 8,
    author: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    tags: [
      { id: "4", name: "AI", slug: "ai" },
      { id: "5", name: "Software Development", slug: "software-development" },
      { id: "6", name: "Machine Learning", slug: "machine-learning" },
    ],
    likes: 187,
    comments: 31,
  },
  {
    id: "3",
    title: "Modern Backend Architecture with Node.js and GraphQL",
    excerpt: "Explore advanced patterns for building robust, scalable backend systems using Node.js, GraphQL, and modern database technologies.",
    coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
    slug: "modern-backend-architecture-nodejs-graphql",
    publishedAt: new Date("2025-03-28"),
    readTime: 10,
    author: {
      name: "Miguel Rodriguez",
      username: "miguelrodriguez",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    tags: [
      { id: "7", name: "Node.js", slug: "nodejs" },
      { id: "8", name: "GraphQL", slug: "graphql" },
      { id: "9", name: "Backend", slug: "backend" },
    ],
    likes: 143,
    comments: 27,
  },
  {
    id: "4",
    title: "Building Accessible Web Applications: A Comprehensive Guide",
    excerpt: "Learn how to create inclusive web experiences that work for everyone. From ARIA roles to keyboard navigation, master the essentials of web accessibility.",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    slug: "building-accessible-web-applications-comprehensive-guide",
    publishedAt: new Date("2025-03-22"),
    readTime: 15,
    author: {
      name: "Jordan Taylor",
      username: "jordantaylor",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    },
    tags: [
      { id: "10", name: "Accessibility", slug: "accessibility" },
      { id: "3", name: "Web Development", slug: "web-development" },
      { id: "11", name: "UX", slug: "ux" },
    ],
    likes: 221,
    comments: 35,
  },
  {
    id: "5",
    title: "Microservices vs. Monoliths: Choosing the Right Architecture for Your Project",
    excerpt: "Compare the benefits and drawbacks of microservices and monolithic architectures to make informed decisions for your next software project.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2134&auto=format&fit=crop",
    slug: "microservices-vs-monoliths-choosing-right-architecture",
    publishedAt: new Date("2025-04-05"),
    readTime: 12,
    author: {
      name: "Olivia Park",
      username: "oliviapark",
      avatar: "https://randomuser.me/api/portraits/women/37.jpg",
    },
    tags: [
      { id: "12", name: "Architecture", slug: "architecture" },
      { id: "13", name: "Microservices", slug: "microservices" },
      { id: "14", name: "System Design", slug: "system-design" },
    ],
    likes: 165,
    comments: 29,
  },
  {
    id: "6",
    title: "Mastering CSS Grid and Flexbox: Advanced Layout Techniques",
    excerpt: "Take your CSS layouts to the next level with advanced grid and flexbox techniques that solve common design challenges.",
    coverImage: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?q=80&w=2130&auto=format&fit=crop",
    slug: "mastering-css-grid-flexbox-advanced-layout-techniques",
    publishedAt: new Date("2025-03-18"),
    readTime: 9,
    author: {
      name: "David Wilson",
      username: "davidwilson",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    tags: [
      { id: "15", name: "CSS", slug: "css" },
      { id: "16", name: "Frontend", slug: "frontend" },
      { id: "17", name: "Design", slug: "design" },
    ],
    likes: 198,
    comments: 32,
  },
];

const popularTags = [
  { id: "1", name: "React", slug: "react", count: 1245 },
  { id: "2", name: "TypeScript", slug: "typescript", count: 982 },
  { id: "3", name: "Web Development", slug: "web-development", count: 854 },
  { id: "4", name: "AI", slug: "ai", count: 721 },
  { id: "5", name: "Node.js", slug: "nodejs", count: 689 },
  { id: "15", name: "CSS", slug: "css", count: 645 },
  { id: "7", name: "GraphQL", slug: "graphql", count: 621 },
  { id: "10", name: "Accessibility", slug: "accessibility", count: 534 },
];

export default function Index() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container py-8">
      <section className="mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="techoh-heading mb-4">Welcome to Tech-OH</h1>
          <p className="techoh-subheading mb-6">
            The ultimate platform for technical content creators and readers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Rocket className="h-5 w-5" />
              Start Reading
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/register">
                <Zap className="h-5 w-5" />
                Join Community
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Article</h2>
        </div>
        <ArticleCard article={featuredArticle} variant="featured" />
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <div className="flex items-center">
            <Button 
              size="icon" 
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button 
              size="icon" 
              variant={viewMode === "list" ? "default" : "ghost"}
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="latest">
          <TabsList className="mb-6">
            <TabsTrigger value="latest" className="gap-2">
              <Clock className="h-4 w-4" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <Flame className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="space-y-0">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-0">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {[...articles].sort((a, b) => b.likes - a.likes).map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                />
              ))}
            </div>
          </TabsContent>
          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/explore">View More Articles</Link>
            </Button>
          </div>
        </Tabs>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag) => (
            <Link to={`/tag/${tag.slug}`} key={tag.id}>
              <Badge variant="outline" className="text-sm py-1.5 px-3 hover:bg-secondary cursor-pointer">
                {tag.name}
                <span className="ml-2 text-xs text-muted-foreground">({tag.count})</span>
              </Badge>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link to="/tags">View All Tags</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
