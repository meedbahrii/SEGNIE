import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import type { BlogPost } from "@shared/schema";

interface BlogPostsResponse {
  posts: BlogPost[];
}

interface CategoriesResponse {
  categories: string[];
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Blog - Segnie SaveTo | Productivity Tips & Guides";
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = "Discover productivity tips, guides, and insights on saving and organizing content. Learn how to maximize your efficiency with Segnie SaveTo.";
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Blog - Segnie SaveTo | Productivity Tips & Guides');
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');
  }, []);

  const { data: postsData, isLoading: postsLoading } = useQuery<BlogPostsResponse>({
    queryKey: selectedCategory ? ["/api/blog/posts", selectedCategory] : ["/api/blog/posts"],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/blog/posts?category=${encodeURIComponent(selectedCategory)}`
        : "/api/blog/posts";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    }
  });

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ["/api/blog/categories"],
  });

  const posts = postsData?.posts || [];
  const categories = categoriesData?.categories || [];

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery)
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-title">
                Our Blog
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Insights, tips, and stories to help you succeed
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-blog"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <AdPlacement slot="Top Banner - 728x90 Leaderboard" format="horizontal" className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                    data-testid="button-category-all"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                      data-testid={`button-category-${category.toLowerCase()}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {postsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground" data-testid="text-no-posts">
                    No articles found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="hover-elevate h-full transition-all cursor-pointer" data-testid={`card-post-${post.slug}`}>
                        {post.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-md">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" data-testid={`badge-category-${post.slug}`}>
                              {post.category}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.readTime} min read
                            </div>
                          </div>
                          <CardTitle className="line-clamp-2" data-testid={`text-title-${post.slug}`}>
                            {post.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3" data-testid={`text-excerpt-${post.slug}`}>
                            {post.excerpt}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                  {Math.floor(filteredPosts.length / 6) > 0 && filteredPosts.length >= 6 && (
                    <div className="md:col-span-2">
                      <AdPlacement slot="In-Feed Ad - 728x90" format="horizontal" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <aside className="hidden lg:block space-y-6">
              <AdPlacement slot="Sidebar Top - 300x250" format="square" />
              <AdPlacement slot="Sidebar Bottom - 300x600" format="vertical" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
