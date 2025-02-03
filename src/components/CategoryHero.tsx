import { BlogFormData } from "@/types/blog";
import { Link, useLocation } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CategoryHeroProps {
  featuredArticle: BlogFormData | undefined;
  gridArticles: BlogFormData[];
}

export function CategoryHero({ featuredArticle, gridArticles }: CategoryHeroProps) {
  const location = useLocation();
  const isGadgetsPage = location.pathname === "/gadgets";
  
  if (!featuredArticle || isGadgetsPage) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-8 animate-fadeIn bg-white">
      {/* Main Featured Article - 75% width */}
      <div className="lg:col-span-2 overflow-hidden group">
        <Link to={`/article/${featuredArticle.slug}`} className="block">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16/9}>
              <img
                src={featuredArticle.image_url}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 border-r border-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-primary/90 transition-colors">
                    {featuredArticle.title}
                  </h2>
                </div>
              </div>
            </AspectRatio>
          </div>
        </Link>
      </div>

      {/* Side Articles Column - 25% width */}
      <div className="lg:col-span-1 grid grid-cols-1 divide-y divide-gray-100">
        {gridArticles.slice(0, 2).map((article) => (
          <div key={article.slug} className="overflow-hidden group flex-1">
            <Link to={`/article/${article.slug}`} className="block">
              <div className="relative overflow-hidden">
                <AspectRatio ratio={16/9} className="border-l border-gray-100">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-lg font-medium text-white group-hover:text-primary/90 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}