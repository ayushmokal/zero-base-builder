import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/types/blog";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelect } from "./CategorySelect";
import { SubcategorySelect } from "./SubcategorySelect";
import { ImageUpload } from "./ImageUpload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FormFieldsProps {
  form: UseFormReturn<BlogFormData>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormFields({ form, selectedCategory, onCategoryChange, onImageChange }: FormFieldsProps) {
  return (
    <>
      <div className="text-left">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-left">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <CategorySelect 
            form={form} 
            onCategoryChange={onCategoryChange} 
          />
        </div>

        <div className="mt-4">
          <SubcategorySelect 
            form={form}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="mt-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left">Content</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    content={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left">Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <ImageUpload onChange={onImageChange} />
        </div>

        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="seo">
              <AccordionTrigger className="text-left">SEO Meta Tags</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter meta title (recommended: 50-60 characters)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter meta description (recommended: 150-160 characters)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Keywords</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter keywords separated by commas" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}