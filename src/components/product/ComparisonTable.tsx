import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ComparisonTableProps {
  selectedProducts: (MobileProduct | LaptopProduct)[];
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
  onRemove: (productId: string) => void;
}

export function ComparisonTable({ selectedProducts, currentProduct, type, onRemove }: ComparisonTableProps) {
  // Fetch expert reviews for all products
  const { data: expertReviews = [] } = useQuery({
    queryKey: ['expert-reviews', selectedProducts.map(p => p.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_reviews')
        .select('*')
        .in('product_id', selectedProducts.map(p => p.id));

      if (error) throw error;
      return data;
    }
  });

  const getExpertReview = (productId: string) => {
    return expertReviews.find(review => review.product_id === productId);
  };

  const mobileSpecCategories = {
    expert_review: {
      title: "Expert Review",
      specs: [
        { title: "Rating", key: "expert_rating", format: (review: any) => review ? `${review.rating}/10` : 'No review' },
        { title: "Verdict", key: "expert_verdict", format: (review: any) => review?.verdict || 'No verdict available' },
      ]
    },
    general: {
      title: "Basic Information",
      specs: [
        { title: "Brand", key: "brand" },
        { title: "Model", key: "model_name" },
        { title: "Price", key: "price", format: (value: number) => `₹${value.toLocaleString()}` },
        { title: "Announced", key: "announced" },
        { title: "Status", key: "status" },
      ]
    },
    display: {
      title: "Display",
      specs: [
        { title: "Type", key: "display_type" },
        { title: "Size", key: "display_size" },
        { title: "Resolution", key: "display_resolution" },
        { title: "Protection", key: "display_protection" },
        { title: "Features", key: "display_specs" },
      ]
    },
    platform: {
      title: "Platform",
      specs: [
        { title: "Chipset", key: "chipset" },
        { title: "CPU", key: "cpu_details" },
        { title: "GPU", key: "gpu_details" },
        { title: "OS", key: "os" },
      ]
    },
    memory: {
      title: "Memory",
      specs: [
        { title: "RAM", key: "ram" },
        { title: "Storage", key: "storage" },
        { title: "Card slot", key: "card_slot", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Type", key: "memory_type" },
      ]
    },
    camera: {
      title: "Camera",
      specs: [
        { title: "Main Camera", key: "camera" },
        { title: "Features", key: "main_camera_features" },
        { title: "Video", key: "main_camera_video" },
      ]
    },
    body: {
      title: "Body",
      specs: [
        { title: "Dimensions", key: "dimensions" },
        { title: "Weight", key: "weight" },
        { title: "Build", key: "build_material" },
        { title: "SIM", key: "sim_type" },
        { title: "Protection", key: "protection_rating" },
      ]
    },
    battery: {
      title: "Battery",
      specs: [
        { title: "Type", key: "battery_type" },
        { title: "Capacity", key: "battery" },
        { title: "Charging", key: "charging_specs" },
      ]
    },
    network: {
      title: "Network",
      specs: [
        { title: "Technology", key: "network_technology" },
        { title: "2G bands", key: "bands_2g" },
        { title: "3G bands", key: "bands_3g" },
        { title: "4G bands", key: "bands_4g" },
        { title: "5G bands", key: "bands_5g" },
        { title: "Speed", key: "network_speed" },
      ]
    },
    connectivity: {
      title: "Connectivity",
      specs: [
        { title: "WLAN", key: "wlan" },
        { title: "Bluetooth", key: "bluetooth" },
        { title: "GPS", key: "gps" },
        { title: "NFC", key: "nfc", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Radio", key: "radio", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "USB", key: "usb_type" },
      ]
    },
    features: {
      title: "Features",
      specs: [
        { title: "Sensors", key: "sensors" },
        { title: "Colors", key: "available_colors" },
      ]
    },
    sound: {
      title: "Sound",
      specs: [
        { title: "Loudspeaker", key: "loudspeaker_type" },
        { title: "3.5mm jack", key: "audio_jack", format: (value: boolean) => value ? "Yes" : "No" },
      ]
    },
  };

  const laptopSpecCategories = {
    // ... (existing laptop spec categories)
  };

  const specCategories = type === 'laptop' ? laptopSpecCategories : mobileSpecCategories;

  const formatValue = (spec: any, value: any, product: MobileProduct | LaptopProduct) => {
    if (spec.key.startsWith('expert_')) {
      const review = getExpertReview(product.id);
      return spec.format(review);
    }

    if (value === null || value === undefined || value === '') return 'Not Specified';
    if (spec.format) return spec.format(value);
    if (Array.isArray(value)) return value.join(', ');
    return value.toString();
  };

  // Desktop View
  const DesktopView = () => (
    <ScrollArea className="w-full">
      <div className="min-w-[640px]">
        {/* Product Headers */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b">
          <div className="font-semibold text-left text-lg">Specifications</div>
          {selectedProducts.map((product, index) => (
            <div key={`header-${product.id}`} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 relative mb-3">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => onRemove(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <h3 className="text-sm font-medium text-center line-clamp-2">{product.name}</h3>
                <p className="text-primary font-bold mt-1">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications Content */}
        <div className="p-6">
          {Object.entries(specCategories).map(([categoryKey, category]) => {
            if (!category) return null;
            return (
              <div key={categoryKey} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-left text-gray-900">{category.title}</h3>
                <div className="space-y-3">
                  {category.specs.map((spec) => (
                    <div key={`${categoryKey}-${spec.key}`} className="grid grid-cols-4 gap-4 py-2">
                      <div className="font-medium text-gray-700 text-left">
                        {spec.title}
                      </div>
                      {selectedProducts.map((product) => (
                        <div 
                          key={`${categoryKey}-${spec.key}-${product.id}`} 
                          className="text-gray-600 break-words"
                        >
                          {formatValue(spec, product[spec.key as keyof typeof product], product)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );

  // Mobile View
  const MobileView = () => (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(specCategories).map(([categoryKey, category]) => {
        if (!category) return null;
        return (
          <AccordionItem key={categoryKey} value={categoryKey}>
            <AccordionTrigger className="text-lg font-semibold px-4">
              {category.title}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-6">
                {category.specs.map((spec) => (
                  <div key={`${categoryKey}-${spec.key}`} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{spec.title}</h4>
                    <div className="space-y-3">
                      {selectedProducts.map((product) => (
                        <div 
                          key={`${categoryKey}-${spec.key}-${product.id}-mobile`} 
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img 
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="font-medium truncate">{product.name}</span>
                          </div>
                          <span className="text-gray-600">
                            {formatValue(spec, product[spec.key as keyof typeof product], product)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

  return (
    <>
      {/* Desktop View - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopView />
      </div>

      {/* Mobile View - Hidden on Desktop */}
      <div className="md:hidden">
        <MobileView />
      </div>
    </>
  );
}