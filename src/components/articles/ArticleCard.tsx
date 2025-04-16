
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, BookmarkCheck, Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    slug: string;
    publishedAt: Date;
    readTime: number;
    author: {
      name: string;
      username: string;
      avatar?: string;
    };
    tags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    likes: number;
    comments: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  variant?: "default" | "featured";
  className?: string;
}

export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(article.isLiked || false);
  const [likesCount, setLikesCount] = useState(article.likes);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const isFeatured = variant === "featured";
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      isFeatured ? "flex flex-col md:flex-row" : "",
      className
    )}>
      {article.coverImage && (
        <Link
          to={`/article/${article.slug}`}
          className={cn(
            "block overflow-hidden",
            isFeatured ? "md:w-1/3 h-48 md:h-auto" : "h-48"
          )}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      <div className={cn(
        "flex flex-col",
        isFeatured ? "md:w-2/3" : "w-full"
      )}>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="hover:bg-secondary/80 cursor-pointer"
              >
                <Link to={`/tag/${tag.slug}`}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
          <Link to={`/article/${article.slug}`}>
            <CardTitle className={cn(
              "line-clamp-2 hover:text-primary transition-colors",
              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            )}>
              {article.title}
            </CardTitle>
          </Link>
          <CardDescription className="flex items-center gap-2 text-xs">
            <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={cn(
            "line-clamp-2 text-muted-foreground text-sm",
            isFeatured ? "line-clamp-3 md:line-clamp-4" : ""
          )}>
            {article.excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${article.author.username}`} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline-block">{article.author.name}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
              <span className="sr-only">Like</span>
            </Button>
            <span className="text-xs text-muted-foreground">{likesCount}</span>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              asChild
            >
              <Link to={`/article/${article.slug}#comments`}>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Comments</span>
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">{article.comments}</span>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Bookmark</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <button className="flex w-full items-center" onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(window.location.origin + `/article/${article.slug}`);
                  }}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button className="flex w-full items-center" onClick={(e) => e.preventDefault()}>
                    Mute this author
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="flex w-full items-center" onClick={(e) => e.preventDefault()}>
                    Report
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
