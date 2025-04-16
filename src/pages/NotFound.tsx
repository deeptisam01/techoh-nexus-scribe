
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6 max-w-md mx-auto animate-fade-in">
        <h1 className="techoh-heading mb-2">404</h1>
        <p className="techoh-subheading mb-4">Oops! Page not found</p>
        <p className="text-muted-foreground">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="default" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/explore">
              <Search className="mr-2 h-4 w-4" />
              Explore Content
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
