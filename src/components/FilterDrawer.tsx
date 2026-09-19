import React, { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Filter, Search, RotateCcw } from "lucide-react";

export interface FilterState {
  status: "all" | "vegan" | "non-vegan";
  productClasses: string[];
  foodTypes: string[];
  subTypes: string[];
  dietary: string[];
  excludeAllergens: string[];
  brands: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  status: "all",
  productClasses: [],
  foodTypes: [],
  subTypes: [],
  dietary: [],
  excludeAllergens: [],
  brands: [],
};

const PRODUCT_CLASSES = [
  "Food",
  "Beverage",
  "Condiment",
  "Supplement",
  "Ingredient/Baking",
  "Confectionery",
];

const FOOD_TYPES = [
  "Snack",
  "Meal",
  "Dessert",
  "Ingredient",
  "Staple",
  "Breakfast",
  "Appetizer",
  "Side-Dish",
  "Soup/Stew",
  "Dip/Salsa",
  "Sweetener",
];

const SUB_TYPES = [
  "Chips", "Wafers", "Namkeen", "Popcorn", "Extruded-Snack", "Nut-Mix", "Fried-Snack", "Papad/Khakhra/Fryums",
  "Chocolate", "Biscuit", "Cookie", "Cake/Pastry", "Candy", "Energy-Bar", "Ice-Cream", "Dry-Fruits", "Pudding/Halwa", "Indian-Sweet",
  "Noodle", "Pasta", "Curry/Dal", "Rice-Dish", "Bread/Loaf", "Indian-Bread/Flatbread", "Idli/Dosa/Batter", "Dumpling/Momo", "Cereal/Granola", "Instant-Mix/Premix",
  "Juice", "Tea/Coffee", "Soda/Carbonated", "Syrup/Concentrate", "Drink-Mix/Powder",
  "Dairy-Alternative", "Meat-Alternative", "Cheese-Alternative", "Yogurt-Alternative",
  "Spread", "Sauce/Ketchup", "Pickle/Achar", "Spice-Mix/Masala", "Oil/Ghee/Butter", "Other"
];

const DIETARY_BADGES = [
  "Jain-Friendly", "Sattvic", "Organic", "Non-GMO",
  "Gluten-Free", "Nut-Free", "Soy-Free", "Corn-Free",
  "Sugar-Free", "No-Added-Sugar", "High-Protein", "Zero-Cholesterol",
  "High-Fibre", "Keto-Friendly", "Zero-Trans-Fat", "Low-Sodium", "Oil-Free",
  "Artificial-Color-Free", "Preservative-Free", "Palm-oil-free", "Saturated-oil-free"
];

const ALLERGEN_LIST = [
  "Dairy", "Soy", "Gluten", "Peanuts", "Tree-Nuts", "Sulphites", "Sesame",
  "Mustard", "Celery", "Lupin", "Coconut", "Nightshades"
];

interface FilterDrawerProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableBrands: string[];
  totalResultsCount: number;
  triggerClassName?: string;
}

export function FilterDrawer({
  filters,
  onFilterChange,
  availableBrands,
  totalResultsCount,
  triggerClassName,
}: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [brandSearch, setBrandSearch] = useState("");

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.status !== "all") count++;
    count += localFilters.productClasses.length;
    count += localFilters.foodTypes.length;
    count += localFilters.subTypes.length;
    count += localFilters.dietary.length;
    count += localFilters.excludeAllergens.length;
    count += localFilters.brands.length;
    return count;
  }, [localFilters]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    const q = brandSearch.toLowerCase();
    return availableBrands.filter((b) => b.toLowerCase().includes(q));
  }, [availableBrands, brandSearch]);

  const toggleArrayItem = (category: keyof FilterState, value: string) => {
    const current = localFilters[category] as string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setLocalFilters({ ...localFilters, [category]: next });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border-[#e3e7e2] bg-white px-3 sm:px-4 font-sans-ui text-xs font-semibold text-[#1c211e] shadow-2xs hover:bg-[#f0f3ef] hover:border-[#354338]/40 shrink-0 ${
            triggerClassName || ""
          }`}
        >
          <Filter size={15} className="text-[#354338]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 rounded-full bg-[#354338] text-white px-2 py-0.5 font-mono-data text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#f8f7f4] border-l border-[#e3e7e2] p-0 flex flex-col h-full text-[#1c211e] duration-200 ease-out transition-transform"
      >
        <SheetHeader className="p-5 border-b border-[#e3e7e2] bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#354338]" />
              <SheetTitle className="font-serif-fraunces text-xl font-bold text-[#1c211e]">
                Filter Products
              </SheetTitle>
              {activeFilterCount > 0 && (
                <Badge className="bg-[#354338] text-white text-[11px] rounded-full">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-[#5a655c] hover:text-[#1c211e] h-8 px-2"
            >
              <RotateCcw size={13} className="mr-1" />
              Reset All
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status */}
          <div className="rounded-xl border border-[#e3e7e2] bg-white p-4">
            <label className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#5a655c] mb-3 block">
              Vegan Status
            </label>
            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Vegan Only", value: "vegan" },
                { label: "Non-Vegan Only", value: "non-vegan" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      status: opt.value as any,
                    })
                  }
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all border ${
                    localFilters.status === opt.value
                      ? "bg-[#354338] text-white border-[#354338]"
                      : "bg-[#f8f7f4] text-[#1c211e] border-[#e3e7e2] hover:bg-[#e6ece7]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="brand" className="space-y-3">
            {/* Dietary & Lifestyle Badges */}
            <AccordionItem value="dietary" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Dietary & Health ({localFilters.dietary.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="max-h-56 overflow-y-auto grid grid-cols-1 gap-2 pr-1">
                  {DIETARY_BADGES.map((badge) => {
                    const checked = localFilters.dietary.includes(badge);
                    return (
                      <label
                        key={badge}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleArrayItem("dietary", badge)}
                        />
                        <span>{badge}</span>
                      </label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Brand Filter */}
            <AccordionItem value="brand" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Brand ({localFilters.brands.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a655c]" />
                  <Input
                    type="text"
                    placeholder={`Search among ${availableBrands.length} brands...`}
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="h-8 pl-8 text-xs bg-[#f8f7f4] border-[#e3e7e2]"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {filteredBrands.map((brand) => {
                    const checked = localFilters.brands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleArrayItem("brands", brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                  {filteredBrands.length === 0 && (
                    <p className="text-xs text-[#5a655c] italic py-1">No matching brands found</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sub Type / Category */}
            <AccordionItem value="sub_type" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Sub-Category / Type ({localFilters.subTypes.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="max-h-56 overflow-y-auto grid grid-cols-1 gap-2 pr-1">
                  {SUB_TYPES.map((sub) => {
                    const checked = localFilters.subTypes.includes(sub);
                    return (
                      <label
                        key={sub}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleArrayItem("subTypes", sub)}
                        />
                        <span>{sub}</span>
                      </label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Product Class */}
            <AccordionItem value="class" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Product Class ({localFilters.productClasses.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-2">
                {PRODUCT_CLASSES.map((cls) => {
                  const checked = localFilters.productClasses.includes(cls);
                  return (
                    <label
                      key={cls}
                      className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleArrayItem("productClasses", cls)}
                      />
                      <span>{cls}</span>
                    </label>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            {/* Food Type */}
            <AccordionItem value="food_type" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Food Type ({localFilters.foodTypes.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-2">
                {FOOD_TYPES.map((ft) => {
                  const checked = localFilters.foodTypes.includes(ft);
                  return (
                    <label
                      key={ft}
                      className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleArrayItem("foodTypes", ft)}
                      />
                      <span>{ft}</span>
                    </label>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            {/* Exclude Allergens */}
            <AccordionItem value="allergens" className="rounded-xl border border-[#e3e7e2] bg-white px-4">
              <AccordionTrigger className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#1c211e] hover:no-underline py-3">
                <span>Exclude Allergens ({localFilters.excludeAllergens.length})</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-2">
                {ALLERGEN_LIST.map((alg) => {
                  const checked = localFilters.excludeAllergens.includes(alg);
                  return (
                    <label
                      key={alg}
                      className="flex items-center gap-2.5 cursor-pointer text-xs font-sans-ui text-[#1c211e] hover:text-[#354338]"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleArrayItem("excludeAllergens", alg)}
                      />
                      <span>Must be {alg}-Free</span>
                    </label>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="p-4 border-t border-[#e3e7e2] bg-white gap-2 flex-row sm:flex-row">
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 rounded-xl bg-[#354338] text-white hover:bg-[#28332a] font-sans-ui text-xs font-semibold h-11"
          >
            Show {totalResultsCount} Results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
