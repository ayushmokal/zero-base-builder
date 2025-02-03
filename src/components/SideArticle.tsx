import { Link } from "react-router-dom";
import { BlogFormData } from "@/types/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface SideArticleProps {
  article: BlogFormData;
}

export function SideArticle({ article }: SideArticleProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Link
        to={`/article/${article.slug}`}
        className="flex flex-col h-full group"
      >
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100"
            />
          </AspectRatio>
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-lg font-medium">
            {article.title}
          </h3>
        </div>
      </Link>
    </Card>
  );
}