import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogSidebar } from "@/components/BlogSidebar";
import type { BlogFormData } from "@/types/blog";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export default function ArticlePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The article you're looking for doesn't exist.",
        });
        navigate("/");
        return;
      }

      await supabase.rpc('increment_view_count', { blog_id: data.id });
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the article. Please try again later.",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  const cleanDescription = blog.meta_description || blog.content.replace(/<[^>]*>/g, '').slice(0, 160);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{blog.meta_title || `${blog.title} | Technikaz`}</title>
        <meta name="description" content={cleanDescription} />
        <meta name="keywords" content={blog.meta_keywords || ''} />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={blog.meta_title || blog.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={blog.image_url || '/og-image.png'} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.meta_title || blog.title} />
        <meta name="twitter:description" content={cleanDescription} />
        <meta name="twitter:image" content={blog.image_url || '/og-image.png'} />
      </Helmet>

      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8 space-y-6">
            {/* Category Tags */}
            <div className="flex gap-2">
              <Badge variant="default" className="bg-[#00897B] hover:bg-[#00897B]/90">
                {blog.category}
              </Badge>
              {blog.subcategories && blog.subcategories.length > 0 && (
                <Badge variant="secondary">
                  {blog.subcategories.join(', ')}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-left">
              {blog.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>By {blog.author}</span>
                <span>•</span>
                <time>
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>1 min read</span>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span>{blog.view_count || 0} views</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{blog.share_count || 0}</span>
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {blog.image_url && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}