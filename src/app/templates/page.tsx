"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiEye } from "react-icons/hi";
import templates from "@/templates/registry";
import { demoRestaurant, demoCategories, demoFoods } from "@/lib/demoData";

export default function TemplatesShowcase() {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("cat1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const dummy = () => {};

  const filteredFoods = demoFoods.filter((food) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return food.name.includes(q) || (food.description || "").includes(q);
    }
    return !selectedCategory || food.category_id === selectedCategory;
  });

  // اگر قالبی برای پیش‌نمایش انتخاب شده باشد
  if (previewTemplate) {
    const template = templates.find((t) => t.id === previewTemplate);
    if (!template) return null;
    const PreviewComponent = template.component;
    return (
      <div className="min-h-screen bg-gray-100">
        {/* نوار بالای پیش‌نمایش */}
        <div className="sticky top-0 z-50 bg-black text-white px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-light">{template.name}</span>
          <button
            onClick={() => setPreviewTemplate(null)}
            className="text-white hover:text-gray-300 flex items-center gap-1"
          >
            <HiX className="text-lg" /> بازگشت
          </button>
        </div>
        <PreviewComponent
          restaurant={demoRestaurant}
          categories={demoCategories}
          foods={demoFoods}
          cart={[]}
          tableNumber="۱"
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          previousCategory={null}
          setPreviousCategory={dummy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          activeView="menu"
          setActiveView={dummy}
          sidebarOpen={false}
          setSidebarOpen={dummy}
          totalCartItems={0}
          totalCartPrice={0}
          addToCart={() => alert("نسخهٔ نمایشی")}
          updateQuantity={dummy}
          updateNote={dummy}
          callWaiter={() => alert("نسخهٔ نمایشی")}
          callingWaiter={false}
          waiterMessage={null}
          setWaiterMessage={dummy}
          filteredFoods={filteredFoods}
        />
      </div>
    );
  }

  // حالت لیست قالب‌ها
  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light text-luxury-text mb-4 text-center"
        >
          قالب‌های آماده Serviro
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-luxury-muted text-lg font-light mb-12 text-center max-w-xl mx-auto"
        >
          پیش‌نمایش هر قالب را ببینید و بهترین را برای رستوران خود انتخاب کنید.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl luxury-shadow overflow-hidden group"
            >
              {/* تصویر قالب با حاشیه گرد و فاصله از لبه‌ها */}
              <div className="p-3">
                <div className="aspect-video bg-luxury-bg overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-light text-luxury-text">{template.name}</h3>
                <p className="text-sm text-luxury-muted mt-2 leading-relaxed">
                  {template.description}
                </p>
                <button
                  onClick={() => setPreviewTemplate(template.id)}
                  className="mt-4 w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light flex items-center justify-center gap-2 hover:bg-luxury-accent-dark transition-colors"
                >
                  <HiEye className="text-lg" /> مشاهده پیش‌نمایش
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}