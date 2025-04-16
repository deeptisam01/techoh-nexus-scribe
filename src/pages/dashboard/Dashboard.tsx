
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenSquare, Clock, CalendarDays } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    lastEditedArticle: null as any,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get total articles
        const { data: articles, error } = await supabase
          .from('articles')
          .select('*')
          .eq('author_id', user.id);

        if (error) throw error;

        // Get last edited article
        const { data: lastEdited, error: lastEditedError } = await supabase
          .from('articles')
          .select('*')
          .eq('author_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (lastEditedError && lastEditedError.code !== 'PGRST116') {
          throw lastEditedError;
        }

        setStats({
          totalArticles: articles?.length || 0,
          publishedArticles: articles?.filter(a => a.status === 'published').length || 0,
          draftArticles: articles?.filter(a => a.status === 'draft').length || 0,
          lastEditedArticle: lastEdited || null,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name || profile?.username || 'Writer'}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your article activity and stats.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalArticles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Articles you've created
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.publishedArticles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Live on Tech-OH Blog
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileEdit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.draftArticles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Articles in progress
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest article updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : stats.lastEditedArticle ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Last edited article
                      </p>
                      <Link to={`/dashboard/articles/${stats.lastEditedArticle.id}`} className="text-sm text-primary hover:underline">
                        {stats.lastEditedArticle.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(stats.lastEditedArticle.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Account created
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(profile?.created_at || Date.now()), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <PenSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No articles yet</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    You haven't created any articles yet. Start writing your first article.
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/articles/new">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Create article
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your content and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/dashboard/articles/new">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Write new article
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/articles">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage articles
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
