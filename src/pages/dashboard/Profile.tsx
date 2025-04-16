
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { ProfileForm, ProfileFormValues } from '@/components/profile/ProfileForm';
import { AccountInfo } from '@/components/profile/AccountInfo';

export default function Profile() {
  const { user, profile, getUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");
      
      const updates = {
        id: user.id,
        username: data.username,
        full_name: data.full_name,
        bio: data.bio,
        website: data.website,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      toast.success('Profile updated');
      await getUserProfile();
    } catch (error: any) {
      toast.error('Error updating profile', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and how it appears to others.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm 
                userId={user?.id}
                profile={profile}
                onSubmit={onSubmit}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountInfo user={user} profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
