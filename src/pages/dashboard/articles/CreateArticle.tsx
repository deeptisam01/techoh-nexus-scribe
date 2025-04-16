
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ArticleEditor from "@/components/articles/ArticleEditor";

export default function CreateArticle() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
          <p className="text-muted-foreground mt-2">
            Write and publish your thoughts to share with the world
          </p>
        </div>
        
        <ArticleEditor />
      </div>
    </DashboardLayout>
  );
}
