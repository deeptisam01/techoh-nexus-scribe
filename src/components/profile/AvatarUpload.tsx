
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface AvatarUploadProps {
  userId: string | undefined;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  username?: string;
  fullName?: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AvatarUpload = ({
  userId,
  avatarUrl,
  onAvatarChange,
  username,
  fullName,
  isLoading,
  setIsLoading,
}: AvatarUploadProps) => {
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!userId) throw new Error('User ID is required');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Check if avatars bucket exists
      const { data: bucketList, error: bucketListError } = await supabase.storage.listBuckets();
      
      if (bucketListError) throw bucketListError;
      
      // Create avatars bucket if it doesn't exist
      const bucketExists = bucketList?.some(bucket => bucket.name === 'avatars');
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
        
        if (createBucketError) throw createBucketError;
      }

      setIsLoading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onAvatarChange(data.publicUrl);
      
      toast.success('Avatar uploaded successfully');

    } catch (error: any) {
      toast.error('Error uploading avatar', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ''} alt={username || 'User'} />
        <AvatarFallback className="text-lg">
          {fullName?.split(' ').map(name => name[0]).join('') || 
           username?.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-2">
        <label htmlFor="avatar" className="cursor-pointer">
          <div className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            Change Avatar
          </div>
          <span className="sr-only">Change avatar</span>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
};
