import * as React from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  currentImageUrl?: string | null;
  currentGalleryImages?: string[] | null;
  multiple?: boolean;
  onRemoveImage?: (index: number) => void;
}

export function ImageUpload({ 
  onChange, 
  label = "Product Image", 
  currentImageUrl, 
  currentGalleryImages = [], 
  multiple = false,
  onRemoveImage 
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 1MB",
      });
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only JPEG, PNG and WebP images are allowed",
      });
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => validateFile(file));
      
      if (validFiles.length !== files.length) {
        e.target.value = ''; // Reset input if any files were invalid
        return;
      }
      
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => {
        // Cleanup old preview URLs
        prev.forEach(url => URL.revokeObjectURL(url));
        return urls;
      });
      onChange(e);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const imagesToDisplay = React.useMemo(() => {
    if (previewUrls.length > 0) return previewUrls;
    if (multiple && Array.isArray(currentGalleryImages)) return currentGalleryImages;
    if (!multiple && currentImageUrl) return [currentImageUrl];
    return [];
  }, [previewUrls, currentGalleryImages, currentImageUrl, multiple]);

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="relative"
          onClick={handleButtonClick}
        >
          Choose file{multiple ? 's' : ''}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleImageChange}
          className="hidden"
        />
        <span className="text-sm text-muted-foreground">
          {previewUrls.length > 0 ? `${previewUrls.length} file(s) selected` : "No file chosen"}
          <br />
          <span className="text-xs">Max size: 1MB. Formats: JPEG, PNG, WebP</span>
        </span>
      </div>
      {imagesToDisplay.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesToDisplay.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <AspectRatio ratio={1}>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-contain w-full h-full rounded-md border border-gray-200"
                />
              </AspectRatio>
              {onRemoveImage && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}