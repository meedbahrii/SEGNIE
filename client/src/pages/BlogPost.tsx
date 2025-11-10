import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import type { BlogPost } from "@shared/schema";
import { useEffect } from "react";

interface BlogPostResponse {
  post: BlogPost;
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = useQuery<BlogPostResponse>({
    queryKey: ["/api/blog/posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: !!slug,
  });

  const post = data?.post;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - SaveTo Blog`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.excerpt;
        document.head.appendChild(meta);
      }
      
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', post.title);
      
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', post.excerpt);
      
      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) {
        ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        document.head.appendChild(ogType);
      }
      ogType.setAttribute('content', 'article');
      
      if (post.imageUrl) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', post.imageUrl);
      }
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4" data-testid="text-post-not-found">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button data-testid="button-back-to-blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const contentParagraphs = post.content.split('\n\n');
  const firstSection = contentParagraphs.slice(0, 2).join('\n\n');
  const restContent = contentParagraphs.slice(2).join('\n\n');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Link href="/blog">
                <Button variant="ghost" className="mb-8" data-testid="button-back">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>

              <div className="mb-8">
                <Badge className="mb-4" data-testid="badge-category">
                  {post.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-post-title">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center" data-testid="text-read-time">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime} min read
                  </div>
                  <div className="flex items-center" data-testid="text-publish-date">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <AdPlacement slot="Top of Article - 728x90" format="horizontal" className="mb-8" />

              {post.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-md mb-8">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    data-testid="img-featured"
                  />
                </div>
              )}

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    data-testid="content-article"
                    dangerouslySetInnerHTML={{ 
                      __html: firstSection.replace(/\n/g, '<br />') 
                    }}
                  />
                </CardContent>
              </Card>

              <AdPlacement slot="In-Article - 728x90" format="horizontal" className="mb-8" />

              {restContent && (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ 
                        __html: restContent.replace(/\n/g, '<br />') 
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <AdPlacement slot="End of Article - 728x90" format="horizontal" className="mb-12" />

              <div className="pt-8 border-t">
                <Link href="/blog">
                  <Button variant="outline" data-testid="button-more-articles">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Read More Articles
                  </Button>
                </Link>
              </div>
            </div>

            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-24">
                <AdPlacement slot="Sidebar Top - 300x250" format="square" className="mb-6" />
                <AdPlacement slot="Sidebar Bottom - 300x600" format="vertical" />
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
