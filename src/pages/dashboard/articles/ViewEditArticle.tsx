
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ArticleEditor from '@/components/articles/ArticleEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function ViewEditArticle() {
  const { articleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId || !user) return;

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .eq('author_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          toast.error('Article not found');
          navigate('/dashboard/articles');
          return;
        }

        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('Could not load article');
        navigate('/dashboard/articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, user, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <p>Loading article...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground mt-2">
            Make changes to your article
          </p>
        </div>
        
        <ArticleEditor articleId={articleId} initialData={article} />
      </div>
    </DashboardLayout>
  );
}
