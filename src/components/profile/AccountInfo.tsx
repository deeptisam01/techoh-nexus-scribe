
import { User } from '@supabase/supabase-js';
import { Profile } from '@/integrations/supabase/types';

interface AccountInfoProps {
  user: User | null;
  profile: Profile | null;
}

export const AccountInfo = ({ user, profile }: AccountInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium">Email</div>
        <div className="text-sm text-muted-foreground mt-1">{user?.email}</div>
      </div>
      
      <div>
        <div className="text-sm font-medium">Account Created</div>
        <div className="text-sm text-muted-foreground mt-1">
          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
        </div>
      </div>
      
      <div>
        <div className="text-sm font-medium">Last Updated</div>
        <div className="text-sm text-muted-foreground mt-1">
          {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
        </div>
      </div>
    </div>
  );
};
