import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { navigationCategories } from "./navigationData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function MobileMenu() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (categoryName: string) => {
    setOpenItems(prev => 
      prev.includes(categoryName) 
        ? prev.filter(item => item !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="py-4">
          <div className="space-y-2">
            {navigationCategories.map((category) => (
              <Collapsible 
                key={category.name}
                open={openItems.includes(category.name)}
                onOpenChange={() => toggleItem(category.name)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-100">
                  <Link 
                    to={category.path} 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering collapsible when clicking the link
                    }}
                  >
                    {category.name}
                  </Link>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openItems.includes(category.name) ? 'transform rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      to={`${category.path}?subcategory=${subcategory}`}
                      className="block p-3 hover:bg-gray-100"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}