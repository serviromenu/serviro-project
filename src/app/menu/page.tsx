"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/skeleton";
import TemplateRenderer from "@/templates";
import { motion, AnimatePresence } from "framer-motion";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  address?: string;
  working_hours?: string;
  instagram?: string;
  telegram?: string;
  phone?: string;
  map_url?: string;
  primary_color?: string;
  bg_color?: string;
  text_color?: string;
  accent_color?: string;
  font_family?: string;
  surface_color?: string;
  template?: string;

  // ABOUT FIELDS
  about_tagline?: string;
  about_story?: string;
  about_hero_image?: string;
  about_gallery?: string[];
  about_highlights?: {
    title: string;
    description?: string;
    icon?: string;
  }[];
  about_facilities?: {
    title: string;
    icon?: string;
  }[];
  waiter_code_enabled?: boolean;
  waiter_code?: string;
}

interface AboutData {
  id?: string;
  restaurant_id?: string;
  enabled: boolean;
  title: string;
  short_description: string;
  story_title: string;
  story: string;
  cover_image: string;
}

interface AboutFeature {
  id: string;
  restaurant_id: string;
  title: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

interface AboutImage {
  id: string;
  restaurant_id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
}

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
}

interface FoodImage {
  id: string;
  food_id: string;
  image_url: string;
  sort_order: number;
}

interface CartItem {
  food: Food;
  quantity: number;
  note?: string;
}

interface MenuPageProps {
  slug?: string;
}

function saveCartToStorage(cartItems: CartItem[]) {
  if (typeof window !== "undefined") {
    const simplified = cartItems.map((item) => ({
      foodId: item.food.id,
      quantity: item.quantity,
      note: item.note || "",
    }));
    localStorage.setItem("serviro_cart", JSON.stringify(simplified));
  }
}

async function signMediaUrls(restaurantId: string, urls: string[]) {
  const unique = [...new Set(urls.filter(Boolean))];
  if (unique.length === 0) return new Map<string, string>();

  const response = await fetch("/api/media/signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId, paths: unique }),
  });
  if (!response.ok) return new Map<string, string>();

  const payload = await response.json();
  return new Map<string, string>(
    (payload.urls || [])
      .filter((item: { path?: string; url?: string | null }) => item.path && item.url)
      .map((item: { path: string; url: string }) => [item.path, item.url])
  );
}

function replaceMediaUrl(url: string | null | undefined, signed: Map<string, string>) {
  return url ? signed.get(url) || url : url;
}

function loadCartFromStorage(foods: Food[]): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("serviro_cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { foodId: string; quantity: number; note?: string }[];
    return parsed
      .map((entry) => {
        const food = foods.find((f) => f.id === entry.foodId);
        return food ? { food, quantity: entry.quantity, note: entry.note || "" } : null;
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

export default function MenuPage({ slug }: MenuPageProps = {}) {
  const [waiterCodeOpen, setWaiterCodeOpen] = useState(false);
const [waiterCodeInput, setWaiterCodeInput] = useState("");
const [waiterCooldown, setWaiterCooldown] = useState(false);
const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [about, setAbout] = useState<AboutData | null>(null);
const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>([]);
const [aboutImages, setAboutImages] = useState<AboutImage[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previousCategory, setPreviousCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"menu" | "about" | "orders">("menu");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("۱");
  const [callingWaiter, setCallingWaiter] = useState(false);
  const [waiterMessage, setWaiterMessage] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [selectedFoodImages, setSelectedFoodImages] = useState<FoodImage[]>([]);
  const [foodImageCounts, setFoodImageCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (foods.length > 0) {
      const foodIds = foods.map((f) => f.id);
      supabase
        .from("food_images")
        .select("food_id")
        .in("food_id", foodIds)
        .then(({ data }) => {
          if (data) {
            const counts: Record<string, number> = {};
            data.forEach((row) => {
              counts[row.food_id] = (counts[row.food_id] || 0) + 1;
            });
            setFoodImageCounts(counts);
          }
        });
    }
  }, [foods]);

  useEffect(() => {
    if (selectedFood) {
      supabase
        .from("food_images")
        .select("*")
        .eq("food_id", selectedFood.id)
        .order("sort_order")
        .then(({ data }) => setSelectedFoodImages(data || []));
    } else {
      setSelectedFoodImages([]);
    }
  }, [selectedFood]);

  useEffect(() => {
    if (isDataReady) saveCartToStorage(cart);
  }, [cart, isDataReady]);

  useEffect(() => {
  if (waiterCooldown && cooldownSeconds > 0) {
    const timer = setTimeout(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
  if (cooldownSeconds === 0 && waiterCooldown) {
    setWaiterCooldown(false);
  }
}, [waiterCooldown, cooldownSeconds]);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  if (table) setTableNumber(table);
  loadFirstRestaurant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  async function loadFirstRestaurant() {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("r");

    let query = supabase.from("restaurants").select("*");

    if (slug) {
      query = query.eq("slug", slug);
    } else if (restaurantId) {
      query = query.eq("id", restaurantId);
    } else {
      query = query.limit(1);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      setError("رستورانی یافت نشد");
      setLoading(false);
      return;
    }

    // Public menus are available only while a valid subscription is active.
    // The RPC returns a boolean and never exposes subscription details.
    const { data: isActive, error: subscriptionError } = await supabase.rpc(
      "is_restaurant_active",
      { p_restaurant_id: data.id }
    );

    if (subscriptionError || isActive !== true) {
      setError("این منو در حال حاضر فعال نیست");
      setLoading(false);
      return;
    }

    setRestaurant(data);
    loadMenu(data.id);
  }

async function loadMenu(restaurantId: string) {
  try {
    const [categoriesRes, foodsRes, aboutRes, featuresRes, aboutImagesRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order"),

      supabase
        .from("foods")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("is_available", true),

      supabase
        .from("restaurant_about")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .maybeSingle(),

      supabase
        .from("restaurant_about_features")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order"),

      supabase
        .from("restaurant_about_images")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order"),
    ]);

    const mediaUrls = [
      ...(categoriesRes.data || []).map((item) => item.image_url),
      ...(foodsRes.data || []).map((item) => item.image_url),
      ...(aboutRes.data ? [aboutRes.data.cover_image] : []),
      ...(aboutImagesRes.data || []).map((item) => item.image_url),
    ].filter((url): url is string => Boolean(url));
    const signedMedia = await signMediaUrls(restaurantId, mediaUrls);

    if (categoriesRes.data) {
      const signedCategories = categoriesRes.data.map((item) => ({
        ...item,
        image_url: replaceMediaUrl(item.image_url, signedMedia),
      }));
      setCategories(signedCategories);
      if (signedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesRes.data[0].id);
      }
    }

    if (foodsRes.data) {
      const signedFoods = foodsRes.data.map((item) => ({
        ...item,
        image_url: replaceMediaUrl(item.image_url, signedMedia),
      }));
      setFoods(signedFoods);
      const savedCart = loadCartFromStorage(signedFoods);
      if (savedCart.length > 0) setCart(savedCart);
    }

    // تنظیم داده‌های About از جدول‌های جداگانه
    if (aboutRes.data) {
      setAbout({
        id: aboutRes.data.id,
        restaurant_id: aboutRes.data.restaurant_id,
        enabled: aboutRes.data.enabled ?? true,
        title: aboutRes.data.title || "",
        short_description: aboutRes.data.short_description || "",
        story_title: aboutRes.data.story_title || "داستان ما",
        story: aboutRes.data.story || "",
        cover_image: replaceMediaUrl(aboutRes.data.cover_image, signedMedia) || "",
      });
    } else {
      setAbout(null);
    }

    setAboutFeatures(featuresRes.data || []);
    setAboutImages(
      (aboutImagesRes.data || []).map((item) => ({
        ...item,
        image_url: replaceMediaUrl(item.image_url, signedMedia) || "",
      }))
    );

    setLoading(false);
    setIsDataReady(true);
  } catch (err) {
    console.error("Menu load error:", err);
    setError("خطا در بارگذاری منو");
    setLoading(false);
  }
}

async function sendWaiterCall() {
  if (!restaurant) return;

  // محدودیت localStorage
  const lastCall = localStorage.getItem("serviro_last_waiter_call");
  if (lastCall) {
    const elapsed = Date.now() - parseInt(lastCall, 10);
    if (elapsed < 3 * 60 * 1000) {
      setWaiterMessage("شما قبلاً گارسون را صدا زده‌اید. لطفاً کمی صبر کنید.");
      setTimeout(() => setWaiterMessage(null), 3000);
      return;
    }
  }

  // بررسی درخواست‌های اخیر از دیتابیس
  const recentCall = await supabase
    .from("waiter_calls")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", tableNumber)
    .gte("created_at", new Date(Date.now() - 3 * 60 * 1000).toISOString())
    .limit(1);

  if (recentCall.data && recentCall.data.length > 0) {
    setWaiterMessage("درخواست قبلی هنوز در حال بررسی است.");
    setTimeout(() => setWaiterMessage(null), 3000);
    return;
  }

  setCallingWaiter(true);
  const { error } = await supabase.from("waiter_calls").insert({
    restaurant_id: restaurant.id,
    table_number: tableNumber,
  });
  setCallingWaiter(false);

  if (!error) {
    localStorage.setItem("serviro_last_waiter_call", String(Date.now()));
    setWaiterCooldown(true);
    setCooldownSeconds(15);
    setWaiterMessage("گارسون فراخوانده شد");
  } else {
    setWaiterMessage("خطا در فراخوانی گارسون");
  }

  setTimeout(() => setWaiterMessage(null), 3000);
}
  

  const addToCart = (food: Food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1, note: "" }];
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.food.id !== foodId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, quantity } : item))
    );
  };

  const updateNote = (foodId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, note } : item))
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  useEffect(() => {
    if (searchQuery.trim()) {
      const keywords = searchQuery.trim().toLowerCase().split(/\s+/);
      const categoryIds = new Set(
        foods
          .filter((food) => {
            const target = (food.name + " " + (food.description || "")).toLowerCase();
            return keywords.every((k) => target.includes(k));
          })
          .map((f) => f.category_id)
      );
      if (categoryIds.size === 1) {
        setSelectedCategory([...categoryIds][0]);
      } else {
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(previousCategory);
    }
  }, [searchQuery, foods, previousCategory]);

  const filteredFoods = foods.filter((food) => {
    if (searchQuery.trim()) {
      const keywords = searchQuery.trim().toLowerCase().split(/\s+/);
      const target = (food.name + " " + (food.description || "")).toLowerCase();
      return keywords.every((k) => target.includes(k));
    }
    return !selectedCategory || food.category_id === selectedCategory;
  });

  async function callWaiter() {
  if (!restaurant) return;
  if (waiterCooldown) return;

  if (restaurant.waiter_code_enabled) {
    setWaiterCodeOpen(true);
    return;
  }

  await sendWaiterCall();
}

  async function handleWaiterCodeSubmit() {
  if (!/^\d{4}$/.test(waiterCodeInput)) {
    setWaiterMessage("کد تأیید باید دقیقاً ۴ رقم باشد.");
    setTimeout(() => setWaiterMessage(null), 3000);
    return;
  }

  if (waiterCodeInput === restaurant?.waiter_code?.trim()) {
    setWaiterCodeOpen(false);
    setWaiterCodeInput("");
    await sendWaiterCall();
  } else {
    setWaiterMessage("کد تأیید اشتباه است");
    setTimeout(() => setWaiterMessage(null), 3000);
  }
}

  const baseStyles = {
    fontFamily: restaurant?.font_family || "Vazirmatn, sans-serif",
    backgroundColor: restaurant?.bg_color || "#F7F7F7",
    color: restaurant?.text_color || "#1A1A1A",
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={baseStyles}>
        <p className="text-lg font-light" style={{ color: restaurant?.text_color || "#666" }}>{error}</p>
      </div>
    );
  }

  return (
  <>
    <TemplateRenderer
      templateName={restaurant?.template || "default"}
      restaurant={restaurant}
      about={about}
      aboutFeatures={aboutFeatures}
      aboutImages={aboutImages}
      categories={categories}
      foods={foods}
      cart={cart}
      tableNumber={tableNumber}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      previousCategory={previousCategory}
      setPreviousCategory={setPreviousCategory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedFood={selectedFood}
      setSelectedFood={setSelectedFood}
      activeView={activeView}
      setActiveView={setActiveView}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      totalCartItems={totalCartItems}
      totalCartPrice={totalCartPrice}
      addToCart={addToCart}
      updateQuantity={updateQuantity}
      updateNote={updateNote}
      callWaiter={callWaiter}
      callingWaiter={callingWaiter}
      waiterMessage={waiterMessage}
      setWaiterMessage={setWaiterMessage}
      filteredFoods={filteredFoods}
      selectedFoodImages={selectedFoodImages}
      foodImageCounts={foodImageCounts}
      waiterCooldown={waiterCooldown}
      cooldownSeconds={cooldownSeconds}
    />

    {/* مودال کد تأیید گارسون */}
    <AnimatePresence>
      {waiterCodeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setWaiterCodeOpen(false)}
        >
          <motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
  className="rounded-2xl p-6 w-full max-w-sm mx-4"
  style={{
    backgroundColor: "var(--custom-surface)",
    color: "var(--custom-text)",
    border: "1px solid var(--custom-border)",
    boxShadow: "var(--custom-shadow)",
  }}
  onClick={(e) => e.stopPropagation()}
>
  <h3 className="text-lg font-light mb-4" style={{ color: "var(--custom-text)" }}>
    کد تأیید گارسون
  </h3>

  <input
    type="text"
    inputMode="numeric"
    value={waiterCodeInput}
    onChange={(e) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
      setWaiterCodeInput(digits);
    }}
    dir="ltr"
    maxLength={4}
    placeholder="****"
    className="w-full px-4 py-3 rounded-xl border text-sm font-light focus:outline-none transition-colors"
    style={{
      borderColor: "var(--custom-border)",
      backgroundColor: "var(--custom-surface)",
      color: "var(--custom-text)",
    }}
  />

  <button
    onClick={handleWaiterCodeSubmit}
    className="w-full mt-4 py-2.5 rounded-xl font-light transition-colors"
    style={{
      backgroundColor: "var(--custom-primary)",
      color: "#fff",
    }}
  >
    تأیید
  </button>

  <button
    onClick={() => setWaiterCodeOpen(false)}
    className="w-full mt-2 py-2 rounded-xl text-sm font-light transition-colors"
    style={{
      border: "1px solid var(--custom-border)",
      color: "var(--custom-muted)",
      backgroundColor: "transparent",
    }}
  >
    انصراف
  </button>
</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
}