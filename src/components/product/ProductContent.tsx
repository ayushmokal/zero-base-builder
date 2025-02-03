import { ProductSpecifications } from "@/components/admin/ProductSpecifications";
import { LaptopSpecifications } from "./LaptopSpecifications";
import { ProductReviewCard } from "./ProductReviewCard";
import { Button } from "@/components/ui/button";
import { ProductKeySpecs } from "./ProductKeySpecs";
import { ProductComments } from "./ProductComments";
import { PopularMobiles } from "./PopularMobiles";
import type { LaptopProduct, MobileProduct } from "@/types/product";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductRatingSystem } from "./ProductRatingSystem";
import { ProductReview } from "./ProductReview";
import { ProductVariantSelector } from "./ProductVariantSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductGalleryTabs } from "./ProductGalleryTabs";

interface ProductContentProps {
  product: LaptopProduct | MobileProduct;
  type: 'mobile' | 'laptop';
  activeSection: string;
}

export function ProductContent({ product: initialProduct, type }: ProductContentProps) {
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLaptop = type === 'laptop';
  const isMobile = type === 'mobile';

  // Define allImages array
  const allImages = [currentProduct.image_url, ...(currentProduct.gallery_images || [])].filter(Boolean) as string[];

  // Query for affiliate link
  const { data: affiliateLink, isLoading: isLoadingAffiliateLink } = useQuery({
    queryKey: ['affiliate-link', currentProduct.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('affiliate_links')
          .select('affiliate_link')
          .eq('product_id', currentProduct.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching affiliate link:', error);
          return null;
        }

        return data?.affiliate_link;
      } catch (error) {
        console.error('Error in affiliate link query:', error);
        return null;
      }
    }
  });

  const handleVariantChange = (variant: LaptopProduct | MobileProduct) => {
    setCurrentProduct(variant);
  };

  const handleCompare = () => {
    navigate('/comparison', {
      state: {
        product: currentProduct,
        type,
      },
    });
  };

  const handleBuyNow = () => {
    if (affiliateLink) {
      window.open(affiliateLink, '_blank');
    } else if (currentProduct.buy_link) {
      window.open(currentProduct.buy_link, '_blank');
    } else {
      toast({
        title: "Not Available",
        description: "This product is not available for purchase at the moment.",
      });
    }
  };

  return (
    <div className="space-y-16 lg:pl-4">
      {/* Overview Section */}
      <section id="overview" className="scroll-mt-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-muted-foreground mb-4">
              {isMobile && currentProduct.announced && (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{currentProduct.announced}</span>
                  </div>
                  <span>•</span>
                </>
              )}
              <Button 
                className="h-8 text-sm px-4 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleCompare}
              >
                Compare
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">₹{currentProduct.price.toLocaleString()}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">(onwards)</span>
                </div>
                <ProductVariantSelector
                  product={currentProduct}
                  type={type}
                  onVariantChange={handleVariantChange}
                />
              </div>
              
              <div>
                <Button 
                  size="lg"
                  className={`w-full md:w-auto ${affiliateLink ? 'bg-[#FF9900] hover:bg-[#FF9900]/90' : 'bg-gray-400 hover:bg-gray-500'}`}
                  onClick={handleBuyNow}
                  disabled={isLoadingAffiliateLink}
                >
                  {isLoadingAffiliateLink ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : affiliateLink ? (
                    <>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg"
                        alt="Amazon"
                        className="w-5 h-5 mr-2"
                      />
                      Buy on Amazon
                    </>
                  ) : (
                    'Coming Soon'
                  )}
                </Button>
              </div>
            </div>

            <ProductKeySpecs
              type={type}
              screenSize={currentProduct.display_specs}
              camera={isMobile ? (currentProduct as MobileProduct).camera : undefined}
              processor={currentProduct.processor}
              ram={currentProduct.ram}
              graphics={isLaptop ? (currentProduct as LaptopProduct).graphics : undefined}
            />
          </div>
        </div>
      </section>

      {/* Expert Review Section */}
      <section id="review" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6 text-left">Expert Review</h2>
        <ProductReview productId={currentProduct.id} />
      </section>

      {/* Specifications Section */}
      <section id="specifications" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6 text-left">Full Specifications</h2>
        <div className="bg-white rounded-lg p-6">
          {isLaptop ? (
            <LaptopSpecifications product={currentProduct as LaptopProduct} />
          ) : (
            <ProductSpecifications product={currentProduct} type="mobile" />
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6 text-left">Compare Products</h2>
        <div className="bg-white rounded-lg p-6 border shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="w-full sm:w-auto flex-shrink-0 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <img 
                src={currentProduct.image_url || "/placeholder.svg"} 
                alt={currentProduct.name} 
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto"
              />
              <h3 className="text-sm font-medium text-center mt-2">{currentProduct.name}</h3>
            </div>
            <div className="flex-grow space-y-4 text-left">
              <div className="flex flex-col">
                <h4 className="text-xl font-semibold text-gray-900">Add devices to compare</h4>
                <p className="text-gray-600 mt-2">Compare {currentProduct.name} with other devices to find the best match for you</p>
              </div>
              <div className="flex justify-start">
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 px-8 py-2.5 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={handleCompare}
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section id="user-reviews" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6 text-left">User Reviews</h2>
        <ProductRatingSystem productId={currentProduct.id} />
        <div className="mt-8">
          <ProductComments productId={currentProduct.id} />
        </div>
      </section>

      {/* Pictures Section */}
      <section id="pictures" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6 text-left">Product Pictures</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {allImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square rounded-lg border overflow-hidden cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
            >
              <img
                src={image}
                alt={`${currentProduct.name} - View ${index + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-0">
          <ProductGalleryTabs
            mainImage={currentProduct.image_url}
            productName={currentProduct.name}
            galleryImages={currentProduct.gallery_images}
          />
        </DialogContent>
      </Dialog>

      {isMobile && <PopularMobiles />}
    </div>
  );
}