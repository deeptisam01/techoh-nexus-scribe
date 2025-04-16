
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Install the dependency
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const articleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  articleId?: string;
  initialData?: ArticleFormValues & { id?: string };
}

const categories = [
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Design",
  "AI & Machine Learning",
  "Blockchain",
  "Cybersecurity",
  "Other",
];

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['link', 'image', 'video'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['clean']
];

export default function ArticleEditor({ articleId, initialData }: ArticleEditorProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData || {
      title: "",
      excerpt: "",
      content: "",
      category: undefined,
      status: "draft",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    if (!user) {
      toast.error("You must be logged in to save an article");
      return;
    }

    setIsLoading(true);

    try {
      const articleData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        status: values.status,
        category: values.category || null,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (articleId) {
        // Update existing article
        result = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", articleId)
          .select()
          .single();
      } else {
        // Create new article
        result = await supabase
          .from("articles")
          .insert({ ...articleData, created_at: new Date().toISOString() })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(
        articleId ? "Article updated successfully" : "Article created successfully"
      );

      navigate("/dashboard/articles");
    } catch (error: any) {
      toast.error(
        articleId ? "Failed to update article" : "Failed to create article",
        { description: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter article title"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Excerpt <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of your article (displayed in previews)"
                      className="resize-none h-20"
                      disabled={isLoading}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Card>
                    <CardContent className="p-0">
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your article content here..."
                        modules={{
                          toolbar: toolbarOptions
                        }}
                        className="h-[400px] max-w-full overflow-y-auto pb-10"
                      />
                    </CardContent>
                  </Card>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/articles")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? articleId
                ? "Updating..."
                : "Creating..."
              : articleId
              ? "Update Article"
              : "Create Article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
