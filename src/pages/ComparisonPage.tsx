import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CompareSearchBar } from "@/components/product/CompareSearchBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { ComparisonTable } from "@/components/product/ComparisonTable";
import { PopularMobiles } from "@/components/product/PopularMobiles";
import { Separator } from "@/components/ui/separator";

export default function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = location.state?.product as MobileProduct | LaptopProduct;
  const type = location.state?.type as 'mobile' | 'laptop';

  const [products, setProducts] = useState<(MobileProduct | LaptopProduct)[]>(
    initialProduct ? [initialProduct] : []
  );

  if (!initialProduct || !type) {
    navigate('/gadgets');
    return null;
  }

  const handleAddProduct = (product: MobileProduct | LaptopProduct) => {
    if (products.length < 3) {
      setProducts([...products, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-4 sm:py-8 px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="w-fit gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Compare Products</h1>
          </div>

          {/* Selected Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {products.map((product, index) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border relative">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="aspect-square mb-4">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Add Product Cards */}
            {products.length < 3 && (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed p-4">
                <h3 className="text-base font-medium text-gray-600 mb-4">
                  Add {products.length === 0 ? "a" : "another"} product to compare
                </h3>
                <CompareSearchBar
                  type={type}
                  onProductSelect={handleAddProduct}
                  currentProductId={initialProduct.id}
                />
              </div>
            )}
          </div>

          {/* Comparison Table */}
          {products.length > 1 && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <ComparisonTable
                selectedProducts={products}
                currentProduct={products[0]}
                type={type}
                onRemove={handleRemoveProduct}
              />
              <div className="flex justify-center p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Popular Mobiles Section */}
          {type === 'mobile' && (
            <>
              <Separator className="my-8 sm:my-12" />
              <PopularMobiles />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}