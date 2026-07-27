import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2 } from "lucide-react";
import { getMenuItems, getCategories, getImageUrl } from "../lib/supabase";
import { getNavigationSettings } from "../lib/site/getNavigationSettings";
import { Category, MenuItem } from "../types";

export default function Menu() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [izGrabUrl, setIzGrabUrl] = useState("https://grab.izcafe.com");
  const [izGrabEnabled, setIzGrabEnabled] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [itemsData, categoriesData, navData] = await Promise.all([
          getMenuItems(true),
          getCategories(),
          getNavigationSettings()
        ]);
        
        setMenuItems(itemsData);
        setCategories(categoriesData);
        const grabItem = navData.find(item => item.id === 'iz-grab');
        if (grabItem) {
          setIzGrabUrl(grabItem.href);
          setIzGrabEnabled(grabItem.enabled);
        }
      } catch (err: any) {
        console.error("Failed to fetch menu", err);
        setError(err.message || "Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainCategories = useMemo(() => {
    return categories.filter(c => !c.parent_id);
  }, [categories]);

  const subCategories = useMemo(() => {
    return categories.filter(c => c.parent_id);
  }, [categories]);

  // Filter items by search query
  const searchedItems = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return menuItems;
    
    const query = debouncedSearchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query)
    );
  }, [menuItems, debouncedSearchQuery]);

  // Group items by category for efficient lookup
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    searchedItems.forEach(item => {
      if (!grouped[item.category_id]) {
        grouped[item.category_id] = [];
      }
      grouped[item.category_id].push(item);
    });
    return grouped;
  }, [searchedItems]);

  // Build the hierarchical structure (Always show all for Scroll Spy)
  const groupedCategories = useMemo(() => {
    return mainCategories.map(parent => {
      const children = subCategories
        .filter(sub => sub.parent_id === parent.id)
        .map(sub => ({
          ...sub,
          items: itemsByCategory[sub.id] || []
        }))
        .filter(sub => sub.items.length > 0);

      const parentItems = itemsByCategory[parent.id] || [];

      return {
        ...parent,
        items: parentItems,
        children
      };
    }).filter(p => p.items.length > 0 || p.children.length > 0);
  }, [mainCategories, subCategories, itemsByCategory]);

  // Scroll active tab into view when selectedCategoryId changes (horizontal only)
  useEffect(() => {
    const activeTabButton = document.querySelector(`.category-tab-btn[data-category="${selectedCategoryId}"]`) as HTMLElement;
    const container = activeTabButton?.closest(".overflow-x-auto") as HTMLElement;
    if (activeTabButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeTabButton.getBoundingClientRect();
      
      const scrollLeft = activeTabButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth"
      });
    }
  }, [selectedCategoryId]);

  // Scroll Spy to track active category on scroll
  useEffect(() => {
    if (isLoading || groupedCategories.length === 0) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Near the top
      if (scrollPosition < 120) {
        setSelectedCategoryId(groupedCategories[0].id);
        return;
      }

      // 2. Near the bottom
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setSelectedCategoryId(groupedCategories[groupedCategories.length - 1].id);
        return;
      }

      // 3. Find which section is currently in view
      const offset = 180; // slightly larger than 160 offset for buffer
      let activeId = selectedCategoryId;

      for (let i = 0; i < groupedCategories.length; i++) {
        const section = document.getElementById(groupedCategories[i].id);
        if (section) {
          const top = section.getBoundingClientRect().top + scrollPosition;
          if (scrollPosition >= top - offset) {
            activeId = groupedCategories[i].id;
          }
        }
      }

      if (activeId !== selectedCategoryId) {
        setSelectedCategoryId(activeId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load/mount/update
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [isLoading, groupedCategories, selectedCategoryId]);

  const handleCategoryClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setSelectedCategoryId(id);
      isManualScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      const offset = 160; // Offset for the sticky tabs
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });

      scrollTimeout.current = window.setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  console.log("Grouped Categories:", groupedCategories.length);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 bg-cream text-charcoal min-h-screen"
    >
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16 flex flex-col items-center"
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
            The <span className="italic font-light text-mocha">Menu</span>
          </h1>
          <p className="text-charcoal/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Artisanal pastries and specialty coffee crafted daily.
          </p>
          {izGrabEnabled && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-3 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm shadow-soft"
            >
              <span className="text-xs tracking-widest uppercase font-semibold text-mocha">
                ✨ Order Online via <span className="brand-script normal-case tracking-normal text-sm">IZ Grab</span>
              </span>
              <a 
                href={izGrabUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-1.5 bg-[#6f4e37] hover:bg-gold text-cream hover:text-charcoal text-[10px] tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-md hover:scale-105"
              >
                Order Now
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 sticky top-24 md:static z-20 px-2 md:px-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/30 group-focus-within:text-mocha transition-colors">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pastries, coffee..."
              className="w-full bg-white/50 backdrop-blur-md border border-charcoal/5 rounded-full py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:bg-white transition-all shadow-soft group-hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal/30 hover:text-mocha transition-colors"
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Sticky Category Navbar */}
        <div className="sticky top-20 z-30 bg-cream/80 backdrop-blur-lg -mx-6 md:-mx-12 px-6 md:px-12 py-4 mb-16 border-b border-mocha/5 overflow-x-auto no-scrollbar">
          <div className="flex justify-center min-w-max gap-8 md:gap-12">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                data-category={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`category-tab-btn text-xs tracking-[0.2em] uppercase transition-all duration-300 relative pb-2 whitespace-nowrap ${
                  selectedCategoryId === category.id
                    ? "text-mocha font-bold"
                    : "text-charcoal/40 hover:text-charcoal"
                }`}
              >
                {category.name}
                {selectedCategoryId === category.id && (
                  <motion.div
                    layoutId="menuActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-mocha" size={40} />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-mocha text-white rounded-full text-sm hover:bg-mocha/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={debouncedSearchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-24"
              >
                {/* Empty State for Search */}
                {searchedItems.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-charcoal/40 italic text-xl">
                      No items found for "<span className="text-charcoal">{debouncedSearchQuery}</span>"
                    </p>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="mt-6 text-mocha underline underline-offset-4 text-sm font-medium hover:text-gold transition-colors"
                    >
                      Clear search and show all items
                    </button>
                  </div>
                ) : (
                  <>
                      <div className="space-y-32">
                        {groupedCategories.map((parent) => (
                          <section id={parent.id} key={parent.id} className="menu-category-section space-y-16">
                            {/* Parent Category Heading */}
                            <div className="flex items-center gap-6">
                              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight">
                                {parent.name}
                              </h2>
                              <div className="h-[1px] flex-1 bg-charcoal/10" />
                            </div>

                            <div className="space-y-20">
                              {/* Items directly in parent category */}
                              {parent.items.length > 0 && (
                                <div className="space-y-8">
                                  {parent.children.length > 0 && (
                                    <h3 className="font-serif text-2xl text-mocha italic font-medium opacity-60">
                                      General
                                    </h3>
                                  )}
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                                    {parent.items.map((item, index) => (
                                      <div key={item.id}>
                                        <MenuItemCard item={item} index={index} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Subcategories */}
                              {parent.children.map((sub) => (
                                <div key={sub.id} className="space-y-8">
                                  <h3 className="font-serif text-2xl md:text-3xl text-mocha italic font-medium">
                                    {sub.name}
                                  </h3>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                                    {sub.items.map((item, index) => (
                                      <div key={item.id}>
                                        <MenuItemCard item={item} index={index} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </motion.main>
  );
}

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  console.log("IMAGE URL:", getImageUrl(item.image_url, "menu-images"));
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-beige shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img
          src={getImageUrl(item.image_url, "menu-images")}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>
      
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="font-serif text-lg font-medium text-charcoal group-hover:text-mocha transition-colors line-clamp-1">
          {item.name}
        </h3>
        
        <div className="mt-2 space-y-1">
          {item.variants && item.variants.length > 0 ? (
            item.variants.map((v) => (
              <p key={v.id} className="font-mono text-xs font-medium text-mocha">
                {v.name} — ৳{v.price.toFixed(2)}
              </p>
            ))
          ) : (
            <p className="font-mono text-sm font-medium text-mocha">
              ৳{item.price?.toFixed(2) || '0.00'}
            </p>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-charcoal/50 font-light line-clamp-2 leading-relaxed mt-2">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
