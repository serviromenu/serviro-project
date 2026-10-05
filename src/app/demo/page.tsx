"use client";

import { useState } from "react";
import DefaultTemplate from "@/templates/DefaultTemplate";

// داده‌های فیک برای رستوران دمو
const demoRestaurant = {
  name: "کافه دمو سرویرو",
  description: "این یک منوی نمایشی است. برای ثبت‌نام و دریافت منوی واقعی، از طریق راه‌های ارتباطی با ما تماس بگیرید.",
  logo_url: "", // می‌توانید یک لوگوی فیک بگذارید یا خالی بگذارید
  primary_color: "#1A1A1A",
  bg_color: "#F7F7F7",
  text_color: "#1A1A1A",
  accent_color: "#1A1A1A",
  font_family: "Vazirmatn",
  surface_color: "#FFFFFF",
  address: "تهران، خیابان ولیعصر، بالاتر از پارک وی",
  working_hours: "همه‌روزه از ۸ صبح تا ۱۲ شب",
  instagram: "@demo_cafe",
  telegram: "@demo_cafe",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.123456789!2d51.123456!3d35.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA3JzI0LjQiTiA1McKwMDcnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890",
};

const demoCategories = [
  { id: "cat1", name: "نوشیدنی گرم" },
  { id: "cat2", name: "نوشیدنی سرد" },
  { id: "cat3", name: "کیک و دسر" },
];

const demoFoods = [
  {
    id: "food1",
    name: "اسپرسو",
    description: "یک شات اسپرسو اصیل ایتالیایی",
    price: 45000,
    image_url: "",
    category_id: "cat1",
  },
  {
    id: "food2",
    name: "کاپوچینو",
    description: "اسپرسو با شیر بخارپز و فوم نرم",
    price: 55000,
    image_url: "",
    category_id: "cat1",
  },
  {
    id: "food3",
    name: "موهیتو",
    description: "نوشیدنی خنک با نعنا و لیمو",
    price: 65000,
    image_url: "",
    category_id: "cat2",
  },
  {
    id: "food4",
    name: "چیزکیک نیویورکی",
    description: "چیزکیک پنیری با سس توت‌فرنگی",
    price: 85000,
    image_url: "",
    category_id: "cat3",
  },
  {
    id: "food5",
    name: "چای ماسالا",
    description: "چای هندی با ادویه‌های گرم",
    price: 50000,
    image_url: "",
    category_id: "cat1",
  },
  {
    id: "food6",
    name: "شیک شکلات",
    description: "شیر، بستنی و شکلات ذوب‌شده",
    price: 75000,
    image_url: "",
    category_id: "cat2",
  },
  {
    id: "food7",
    name: "براونی",
    description: "براونی شکلاتی با گردو",
    price: 60000,
    image_url: "",
    category_id: "cat3",
  },
  {
    id: "food8",
    name: "لاته",
    description: "اسپرسو با شیر گرم",
    price: 55000,
    image_url: "",
    category_id: "cat1",
  },
];

export default function DemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("cat1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [activeView, setActiveView] = useState<"menu" | "about" | "orders">("menu");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // توابع بی‌اثر برای دمو
  const dummyFunction = () => {};
  const dummyAddToCart = () => alert("این یک نسخهٔ نمایشی است. برای ثبت‌نام با ما تماس بگیرید.");
  const dummyCallWaiter = () => alert("این یک نسخهٔ نمایشی است. برای ثبت‌نام با ما تماس بگیرید.");

  // فیلتر غذاها بر اساس جستجو و دسته‌بندی
  const filteredFoods = demoFoods.filter((food) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return food.name.toLowerCase().includes(q) || (food.description || "").toLowerCase().includes(q);
    }
    return !selectedCategory || food.category_id === selectedCategory;
  });

  return (
    <div>
      {/* بنر دمو */}
      <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm text-center py-2 px-4">
        ⚠️ این یک <strong>نسخهٔ نمایشی</strong> است. برای ثبت‌نام و دریافت منوی واقعی، با ما تماس بگیرید.
      </div>
      <DefaultTemplate
        restaurant={demoRestaurant}
        categories={demoCategories}
        foods={demoFoods}
        cart={[]}
        tableNumber="۱"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        previousCategory={null}
        setPreviousCategory={dummyFunction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFood={selectedFood}
        setSelectedFood={setSelectedFood}
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        totalCartItems={0}
        totalCartPrice={0}
        addToCart={dummyAddToCart}
        updateQuantity={dummyFunction}
        updateNote={dummyFunction}
        callWaiter={dummyCallWaiter}
        callingWaiter={false}
        waiterMessage={null}
        setWaiterMessage={dummyFunction}
        filteredFoods={filteredFoods}
      />
    </div>
  );
}