
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { CardFooter } from "@/components/ui/card";

// We need a type for Profile since we're referencing it
interface Profile {
  username?: string;
  full_name?: string;
  bio?: string;
  website?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  full_name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must not be longer than 50 characters.',
    }),
  bio: z.string().max(500, {
    message: 'Bio must not be longer than 500 characters.',
  }).optional().or(z.literal('')),
  website: z.string().max(100, {
    message: 'Website URL must not be longer than 100 characters.',
  }).optional().or(z.literal('')),
  avatar_url: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  userId: string | undefined;
  profile: Profile | null;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ProfileForm = ({ userId, profile, onSubmit, isLoading, setIsLoading }: ProfileFormProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      full_name: '',
      bio: '',
      website: '',
      avatar_url: '',
    },
    mode: 'onChange',
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || '',
      });
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, form]);

  const handleFormSubmit = async (data: ProfileFormValues) => {
    // Include the most recent avatar URL in the form submission
    const updatedData = { ...data, avatar_url: avatarUrl };
    await onSubmit(updatedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <AvatarUpload 
          userId={userId}
          avatarUrl={avatarUrl}
          onAvatarChange={(url) => {
            setAvatarUrl(url);
            form.setValue('avatar_url', url);
          }}
          username={profile?.username}
          fullName={profile?.full_name}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="px-0">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update profile'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
