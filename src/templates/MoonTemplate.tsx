"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiSearch,
  HiX,
  HiPlus,
  HiMinus,
  HiOutlineTag,
  HiOutlineEmojiHappy,
  HiOutlineStar,
  HiBell,
  HiOutlineCamera,
  HiOutlinePaperAirplane,
  HiOutlinePhone,
  HiOutlinePencilAlt,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
} from "react-icons/hi";
import { EmptySearch, EmptyCart } from "@/components/ui/empty-state";

interface DefaultTemplateProps {
  restaurant: any;
  categories: any[];
  foods: any[];
  cart: any[];
  tableNumber: string;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  previousCategory: string | null;
  setPreviousCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedFood: any;
  setSelectedFood: (food: any) => void;
  activeView: "menu" | "about" | "orders";
  setActiveView: (view: "menu" | "about" | "orders") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  totalCartItems: number;
  totalCartPrice: number;
  addToCart: (food: any) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  updateNote: (foodId: string, note: string) => void;
  callWaiter: () => void;
  callingWaiter: boolean;
  waiterMessage: string | null;
  setWaiterMessage: (msg: string | null) => void;
  filteredFoods: any[];
  selectedFoodImages?: any[];
  foodImageCounts?: Record<string, number>;
}

export default function MoonTemplate({
  restaurant,
  categories,
  foods,
  cart,
  tableNumber,
  selectedCategory,
  setSelectedCategory,
  previousCategory,
  setPreviousCategory,
  searchQuery,
  setSearchQuery,
  selectedFood,
  setSelectedFood,
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
  totalCartItems,
  totalCartPrice,
  addToCart,
  updateQuantity,
  updateNote,
  callWaiter,
  callingWaiter,
  waiterMessage,
  setWaiterMessage,
  filteredFoods,
  selectedFoodImages = [],
}: DefaultTemplateProps) {
  const [currentModalImage, setCurrentModalImage] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [flyItems, setFlyItems] = useState<
    {
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }[]
  >([]);
  const [flyRemoveItems, setFlyRemoveItems] = useState<
    {
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }[]
  >([]);

  const [cartBounce, setCartBounce] = useState(false);

  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const cartMobileRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (totalCartItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalCartItems]);

  useEffect(() => {
    if (selectedFood) {
      setCurrentModalImage(selectedFood.image_url || "");
    }
  }, [selectedFood]);

  useEffect(() => {
    if (thumbnailScrollRef.current && currentModalImage) {
      const activeThumb = thumbnailScrollRef.current.querySelector(
        `[data-image-url="${CSS.escape(currentModalImage)}"]`
      );
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentModalImage]);

  useEffect(() => {
    if (!restaurant) return;
    const root = document.documentElement;
    root.style.setProperty("--custom-primary", restaurant.primary_color || "#1A1A1A");
    root.style.setProperty("--custom-bg", restaurant.bg_color || "#F7F7F7");
    root.style.setProperty("--custom-text", restaurant.text_color || "#1A1A1A");
    root.style.setProperty("--custom-accent", restaurant.accent_color || "#1A1A1A");
    root.style.setProperty("--custom-font", restaurant.font_family || "Vazirmatn");
    root.style.setProperty("--custom-surface", restaurant.surface_color || "#FFFFFF");

    const styleId = "serviro-mobile-dynamic-styles";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      .qty-btn {
        background-color: var(--custom-bg) !important;
        color: var(--custom-primary) !important;
        border: 1px solid #E6E6E6 !important;
      }
      .qty-btn:hover {
        background-color: var(--custom-primary) !important;
        color: white !important;
      }
      .add-btn {
        background-color: var(--custom-primary) !important;
        color: white !important;
      }
      .add-btn:hover {
        opacity: 0.92;
      }
      .mobile-menu-scroll {
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
      }
      .no-tap-highlight {
        -webkit-tap-highlight-color: transparent;
      }
      * {
        min-width: 0;
      }
    `;
  }, [restaurant]);

  const customStyles = {
    fontFamily: restaurant?.font_family || "Vazirmatn, sans-serif",
    backgroundColor: restaurant?.bg_color || "#F7F7F7",
    color: restaurant?.text_color || "#1A1A1A",
  };

  const surfaceColorWithAlpha = restaurant?.surface_color
    ? `${restaurant.surface_color}CC`
    : "#FFFFFFCC";

  const allImages = selectedFood
    ? [
        ...(selectedFood.image_url ? [selectedFood.image_url] : []),
        ...selectedFoodImages.map((img: any) => img.image_url).filter(Boolean),
      ]
    : [];

  const goToPrevImage = () => {
    if (allImages.length === 0) return;
    const currentIndex = allImages.indexOf(currentModalImage);
    const safeIndex = currentIndex < 0 ? 0 : currentIndex;
    const newIndex = (safeIndex - 1 + allImages.length) % allImages.length;
    setCurrentModalImage(allImages[newIndex]);
  };

  const goToNextImage = () => {
    if (allImages.length === 0) return;
    const currentIndex = allImages.indexOf(currentModalImage);
    const safeIndex = currentIndex < 0 ? 0 : currentIndex;
    const newIndex = (safeIndex + 1) % allImages.length;
    setCurrentModalImage(allImages[newIndex]);
  };

  const handleAddToCart = (food: any, e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const targetEl = cartMobileRef.current;
    if (!targetEl) {
      addToCart(food);
      return;
    }
    const targetRect = targetEl.getBoundingClientRect();
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const flyId = `${food.id}-${Date.now()}`;
    setFlyItems((prev) => [
      ...prev,
      { id: flyId, startX, startY, endX, endY },
    ]);
    addToCart(food);
  };

  const handleRemoveFromCart = (foodId: string, e: React.MouseEvent) => {
    const currentQuantity = cart.find((i: any) => i.food.id === foodId)?.quantity || 1;
    updateQuantity(foodId, currentQuantity - 1);

    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    const targetEl = cartMobileRef.current;
    if (!targetEl) return;
    const targetRect = targetEl.getBoundingClientRect();
    const startX = targetRect.left + targetRect.width / 2;
    const startY = targetRect.top + targetRect.height / 2;

    const flyId = `remove-${foodId}-${Date.now()}`;
    setFlyRemoveItems((prev) => [
      ...prev,
      { id: flyId, startX, startY, endX, endY },
    ]);
  };

  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden scrollbar-hide bg-[var(--custom-bg)] text-[var(--custom-text)]"
      style={customStyles}
    >
      {/* =========================
          HEADER (Elementor Style)
      ========================== */}
      <header
        className="sticky top-0 z-30 w-full px-4 sm:px-6 lg:px-8 pt-[max(8px,env(safe-area-inset-top))] pb-2 backdrop-blur-md"
        style={{
          backgroundColor: restaurant?.bg_color ? `${restaurant.bg_color}E6` : "#F7F7F7E6",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          {/* بخش متنی: عنوان فارسی و انگلیسی */}
          <div className="flex flex-col items-start">
            <h2
              className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight"
              style={{ color: restaurant?.text_color || "#1A1A1A" }}
            >
              {restaurant?.name || "نام رستوران"}
            </h2>
            <h5
              className="text-xs sm:text-sm md:text-base font-light mt-1"
              style={{ color: restaurant?.text_color ? `${restaurant.text_color}99` : "#666" }}
            >
              {restaurant?.description || "توضیح کوتاه"}
            </h5>
          </div>

          <div className="flex shrink-0 items-center gap-3">
  <div className="flex-shrink-0">
    {restaurant?.logo_url ? (
      <img
        src={restaurant.logo_url}
        alt={restaurant?.name || ""}
        className="h-12 w-auto max-w-[120px] object-contain sm:h-14 md:h-16"
      />
    ) : (
      <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-white/50" />
    )}
  </div>

  {restaurant?.waiter_call_enabled === false ? (
    <span
      className="text-xs font-medium leading-none"
      style={{ color: restaurant?.text_color || "#1A1A1A" }}
    >
      {tableNumber}
    </span>
  ) : (
    <motion.button
      onClick={callWaiter}
      disabled={callingWaiter}
      whileTap={{ scale: 0.86 }}
      animate={callingWaiter ? { scale: [1, 1.12, 1] } : {}}
      transition={
        callingWaiter
          ? { repeat: Infinity, duration: 0.8 }
          : {}
      }
      className="
        no-tap-highlight
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-sm
      "
      style={{ color: restaurant?.primary_color || "#1A1A1A" }}
      aria-label="فراخوانی گارسون"
    >
      <HiBell className="text-lg" />
    </motion.button>
  )}
</div>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Search Bar (Expandable) */}
        <div className="px-4 pt-2 pb-2">
          {/* دکمه جستجو موبایل */}
          <div className="flex justify-end lg:hidden">
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="no-tap-highlight flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
              style={{ color: restaurant?.primary_color || "#1A1A1A" }}
            >
              <HiSearch className="text-lg" />
            </button>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="relative w-full mt-2">
                  <HiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-3xl bg-white py-2.5 pl-10 pr-10 text-sm font-light shadow-sm outline-none placeholder:text-gray-400"
                    style={{ color: restaurant?.text_color || "#1A1A1A" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="no-tap-highlight absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400"
                    >
                      <HiX className="text-lg" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* جستجو دسکتاپ */}
          <div className="hidden lg:block">
            <div className="relative w-full">
              <HiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-3xl bg-white py-2.5 pl-10 pr-10 text-sm font-light shadow-sm outline-none placeholder:text-gray-400"
                style={{ color: restaurant?.text_color || "#1A1A1A" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="no-tap-highlight absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400"
                >
                  <HiX className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WAITER TOAST */}
        <AnimatePresence>
          {waiterMessage && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-[100] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl px-4 py-2.5 text-xs text-white shadow-xl"
              style={{ backgroundColor: "var(--custom-primary)" }}
            >
              {waiterMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================
            MENU VIEW
        ========================== */}
        {activeView === "menu" && (
          <>
            {/* CATEGORIES - Glass Sticky Horizontal Nav */}
<div
  className="sticky top-[64px] z-20 mt-2 px-4"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(12px) saturate(120%)",
    WebkitBackdropFilter: "blur(12px) saturate(120%)",
    borderRadius: "0 0 16px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}
>
  <div className="mobile-menu-scroll overflow-x-auto scrollbar-hide">
    <div className="flex w-max items-center gap-1 px-1 py-2">
      {categories.map((cat: any) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setPreviousCategory(cat.id);
            }}
            className={`
              no-tap-highlight
              shrink-0
              whitespace-nowrap
              rounded-full
              px-4
              py-2
              text-xs
              font-light
              transition-all
              duration-200

              ${
                isSelected
                  ? "text-white shadow-sm"
                  : "text-luxury-muted hover:text-luxury-text"
              }
            `}
            style={
              isSelected
                ? {
                    backgroundColor:
                      restaurant?.primary_color || "#1A1A1A",
                  }
                : {
                    backgroundColor: "transparent",
                  }
            }
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  </div>
</div>


{/* SEARCH FIELD */}
<div className="px-4 pt-3 pb-2">
  <div className="relative w-full">
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch className="h-5 w-5" />
    </span>
    <input
      type="text"
      placeholder="جستجو در منو..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="h-11 w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-light shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-gray-300"
      style={{ color: restaurant?.text_color || "#1A1A1A" }}
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="no-tap-highlight absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
        aria-label="پاک کردن جستجو"
      >
        <HiX className="text-lg" />
      </button>
    )}
  </div>
</div>

            {/* FOOD LIST */}
<div className="px-4 pt-5 pb-32">
  {filteredFoods.length === 0 ? (
    <EmptySearch query={searchQuery} />
  ) : (
    <motion.div
      layout
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {filteredFoods.map((food: any) => {
        const cartItem = cart.find(
          (item: any) => item.food.id === food.id
        );
        const quantity = cartItem?.quantity || 0;

        return (
          <motion.div
            key={food.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.985 }}
            className="
              flex
              flex-col
              overflow-hidden
              rounded-2xl
              p-3
              shadow-sm
              transition-all
              duration-300
              hover:shadow-md
            "
            style={{
              backgroundColor: "var(--custom-surface)",
            }}
            onClick={() => setSelectedFood(food)}
          >
            {/* بخش بالایی: تصویر + متن */}
            <div className="flex items-start gap-3">
              {/* تصویر */}
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                {food.image_url ? (
                  <img
                    src={food.image_url}
                    alt={food.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-light text-luxury-muted/20">
                    {food.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* متن‌ها */}
              <div className="min-w-0 flex-1">
                <h4
                  className="truncate text-sm font-bold leading-6"
                  style={{ color: restaurant?.text_color || "#1A1A1A" }}
                >
                  {food.name}
                </h4>
                {food.description && (
                  <p
                    className="mt-1 line-clamp-2 text-xs font-light leading-5 opacity-70"
                    style={{
                      color: restaurant?.text_color
                        ? `${restaurant.text_color}99`
                        : "#666",
                    }}
                  >
                    {food.description}
                  </p>
                )}
              </div>
            </div>

            {/* بخش پایینی: قیمت و دکمه‌ها */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className="text-sm font-extrabold tracking-wide"
                style={{ color: restaurant?.accent_color || "#1A1A1A" }}
              >
                {food.price.toLocaleString()} ت
              </span>

              {quantity === 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(food, e);
                  }}
                  className="
                    no-tap-highlight
                    add-btn
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    shadow-md
                  "
                  aria-label="افزودن"
                >
                  <HiPlus className="text-lg" />
                </button>
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCart(food.id, e);
                    }}
                    className="
                      no-tap-highlight
                      qty-btn
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                    "
                  >
                    <HiMinus className="text-xs" />
                  </button>
                  <span className="w-4 text-center text-xs font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(food, e);
                    }}
                    className="
                      no-tap-highlight
                      qty-btn
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                    "
                  >
                    <HiPlus className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  )}
</div>
          </>
        )}

        {/* =========================
            ABOUT VIEW
        ========================== */}
        {activeView === "about" && (
          <div className="mx-auto w-full max-w-lg px-4 pt-10 pb-28">
            <div className="text-center">
              {restaurant?.logo_url && (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="mx-auto mb-5 h-20 w-20 object-contain"
                />
              )}
              <h2
                className="mb-3 break-words text-2xl font-light leading-tight"
                style={{ color: restaurant?.text_color || "#1A1A1A" }}
              >
                {restaurant?.name}
              </h2>
              <p
                className="break-words whitespace-pre-line text-sm font-light leading-7"
                style={{
                  color: restaurant?.text_color ? `${restaurant.text_color}99` : "#666",
                }}
              >
                {restaurant?.description || "اطلاعات این رستوران به‌زودی تکمیل می‌شود."}
              </p>

              {restaurant?.map_url && (
                <div className="mt-7 overflow-hidden rounded-2xl shadow-lg">
                  <iframe
                    src={restaurant.map_url}
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقعیت مکانی"
                  />
                </div>
              )}

              {restaurant?.address && (
                <div
                  className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-6"
                  style={{ color: restaurant?.text_color ? `${restaurant.text_color}99` : "#666" }}
                >
                  <span>📍</span>
                  <span className="break-words">{restaurant.address}</span>
                </div>
              )}

              {restaurant?.working_hours && (
                <div
                  className="mt-2 flex items-start justify-center gap-2 text-center text-xs leading-6"
                  style={{ color: restaurant?.text_color ? `${restaurant.text_color}99` : "#666" }}
                >
                  <span>🕒</span>
                  <span className="break-words">{restaurant.working_hours}</span>
                </div>
              )}

              <div className="mt-7 flex items-center justify-center gap-6">
                {restaurant?.instagram && (
                  <a
                    href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-tap-highlight p-2 transition-opacity active:opacity-50"
                    style={{ color: restaurant?.text_color || "#666" }}
                  >
                    <HiOutlineCamera className="text-2xl" />
                  </a>
                )}
                {restaurant?.telegram && (
                  <a
                    href={`https://t.me/${restaurant.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-tap-highlight p-2 transition-opacity active:opacity-50"
                    style={{ color: restaurant?.text_color || "#666" }}
                  >
                    <HiOutlinePaperAirplane className="text-2xl" />
                  </a>
                )}
                {restaurant?.phone && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="no-tap-highlight p-2 transition-opacity active:opacity-50"
                    style={{ color: restaurant?.text_color || "#666" }}
                  >
                    <HiOutlinePhone className="text-2xl" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================
            ORDERS VIEW
        ========================== */}
        {activeView === "orders" && (
          <div className="mx-auto w-full max-w-lg px-4 pt-8 pb-28">
            <h2 className="mb-5 text-xl font-light" style={{ color: restaurant?.text_color || "#1A1A1A" }}>
              سفارشات شما
            </h2>
            {cart.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <div
                    key={item.food.id}
                    className="overflow-hidden rounded-2xl p-3.5 shadow-sm"
                    style={{ backgroundColor: "var(--custom-surface)" }}
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                          {item.food.image_url ? (
                            <img
                              src={item.food.image_url}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white text-2xl text-luxury-muted/30">
                              {item.food.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className="truncate text-sm font-light"
                            style={{ color: restaurant?.text_color || "#1A1A1A" }}
                          >
                            {item.food.name}
                          </h4>
                          <p
                            className="mt-1 truncate text-[11px] opacity-70"
                            style={{ color: restaurant?.accent_color || "#1A1A1A" }}
                          >
                            {item.food.price.toLocaleString()} تومان
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromCart(item.food.id, e);
                          }}
                          className="no-tap-highlight qty-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        >
                          <HiMinus className="text-xs" />
                        </button>
                        <span
                          className="w-5 shrink-0 text-center text-xs font-medium"
                          style={{ color: restaurant?.text_color || "#1A1A1A" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.food, e);
                          }}
                          className="no-tap-highlight qty-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        >
                          <HiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex min-w-0 items-center gap-2">
                      <HiOutlinePencilAlt
                        className="shrink-0 text-sm"
                        style={{ color: restaurant?.primary_color ? `${restaurant.primary_color}99` : "#666" }}
                      />
                      <input
                        type="text"
                        placeholder="یادداشت ..."
                        value={item.note || ""}
                        onChange={(e) => updateNote(item.food.id, e.target.value)}
                        className="min-w-0 flex-1 border-b border-gray-300 bg-transparent px-1 py-1 text-xs font-light outline-none placeholder:text-gray-400 focus:border-gray-400"
                        style={{ color: restaurant?.text_color || "#1A1A1A" }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-4 border-t border-luxury-border pt-4">
                  <span className="shrink-0 text-base font-light" style={{ color: restaurant?.text_color || "#1A1A1A" }}>
                    جمع کل:
                  </span>
                  <span
                    className="min-w-0 truncate text-right text-lg font-light opacity-70"
                    style={{ color: restaurant?.accent_color || "#1A1A1A" }}
                  >
                    {totalCartPrice.toLocaleString()} تومان
                  </span>
                </div>
                <button
                  className="w-full rounded-xl px-4 py-3.5 text-base font-light tracking-wide text-white transition-opacity active:opacity-80"
                  style={{ backgroundColor: restaurant?.accent_color || "#1A1A1A" }}
                >
                  ثبت سفارش
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================
          BOTTOM NAVIGATION
      ========================== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pb-[max(16px,env(safe-area-inset-bottom))] sm:pb-[max(18px,env(safe-area-inset-bottom))] pt-2"
      >
        <div
          className="flex h-14 sm:h-16 w-full items-center justify-around rounded-full px-2 sm:px-3 shadow-xl backdrop-blur-md"
          style={{ backgroundColor: surfaceColorWithAlpha }}
        >
          <button
            onClick={() => setActiveView("menu")}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-200"
            style={{
              backgroundColor: activeView === "menu" ? "var(--custom-primary)" : "transparent",
              color: activeView === "menu" ? "#FFFFFF" : "var(--custom-text)",
            }}
          >
            <HiOutlineTag className="text-lg sm:text-xl" />
          </button>

          <button
            onClick={() => setActiveView("orders")}
            className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-200"
            style={{
              backgroundColor: activeView === "orders" ? "var(--custom-primary)" : "transparent",
              color: activeView === "orders" ? "#FFFFFF" : "var(--custom-text)",
            }}
          >
            <HiOutlineStar className="text-lg sm:text-xl" />
            {totalCartItems > 0 && (
              <span
                ref={cartMobileRef}
                className={`absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white transition-transform duration-200 ${
                  cartBounce ? "scale-125" : "scale-100"
                }`}
                style={{ backgroundColor: "var(--custom-accent)", lineHeight: 1 }}
              >
                {totalCartItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("about")}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-200"
            style={{
              backgroundColor: activeView === "about" ? "var(--custom-primary)" : "transparent",
              color: activeView === "about" ? "#FFFFFF" : "var(--custom-text)",
            }}
          >
            <HiOutlineEmojiHappy className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>

      {/* =========================
          FOOD MODAL
      ========================== */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-black/40 p-3 backdrop-blur-sm sm:p-4"
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-3xl shadow-2xl"
              style={{ maxHeight: "calc(100dvh - 24px)", backgroundColor: "var(--custom-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedFood(null)}
                className="no-tap-highlight absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm"
                aria-label="بستن"
              >
                <HiX className="text-sm" />
              </button>

              <div className="relative aspect-square max-h-[46dvh] w-full shrink-0 overflow-hidden bg-white p-5">
                {currentModalImage ? (
                  <img
                    src={currentModalImage}
                    alt={selectedFood.name || ""}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white text-5xl font-extralight text-luxury-muted/20">
                    {selectedFood.name?.charAt(0)}
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="mt-2 flex shrink-0 items-center px-2">
                  <button
                    onClick={goToPrevImage}
                    className="no-tap-highlight flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-luxury-text shadow-sm"
                    aria-label="تصویر قبلی"
                  >
                    <HiOutlineChevronRight className="text-sm" />
                  </button>
                  <div
                    ref={thumbnailScrollRef}
                    className="mx-1 min-w-0 flex-1 overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex w-max min-w-full justify-center gap-2 py-1.5">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          data-image-url={imgUrl}
                          onClick={() => setCurrentModalImage(imgUrl)}
                          className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg transition-all ${
                            currentModalImage === imgUrl
                              ? "opacity-100 ring-1 ring-gray-400 ring-offset-1"
                              : "opacity-60"
                          }`}
                        >
                          <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={goToNextImage}
                    className="no-tap-highlight flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-luxury-text shadow-sm"
                    aria-label="تصویر بعدی"
                  >
                    <HiOutlineChevronLeft className="text-sm" />
                  </button>
                </div>
              )}

              <div className="min-h-0 overflow-y-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
                <h2
                  className="break-words text-base font-bold leading-6"
                  style={{ color: restaurant?.text_color || "#1A1A1A" }}
                >
                  {selectedFood.name}
                </h2>
                {selectedFood.description && (
                  <p
                    className="mt-1.5 break-words text-xs font-light leading-6"
                    style={{
                      color: restaurant?.text_color ? `${restaurant.text_color}99` : "#666",
                    }}
                  >
                    {selectedFood.description}
                  </p>
                )}
                <div className="mt-3 flex min-w-0 items-center justify-between gap-4">
                  <span
                    className="min-w-0 truncate text-sm font-bold tracking-wide opacity-70"
                    style={{ color: restaurant?.accent_color || "#1A1A1A" }}
                  >
                    {selectedFood.price.toLocaleString()} تومان
                  </span>
                  {cart.find((i: any) => i.food.id === selectedFood.id) ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCart(selectedFood.id, e);
                        }}
                        className="no-tap-highlight qty-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      >
                        <HiMinus className="text-sm" />
                      </button>
                      <span
                        className="w-5 text-center text-sm font-medium"
                        style={{ color: restaurant?.text_color || "#1A1A1A" }}
                      >
                        {cart.find((i: any) => i.food.id === selectedFood.id)?.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(selectedFood, e);
                        }}
                        className="no-tap-highlight qty-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      >
                        <HiPlus className="text-sm" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(selectedFood, e);
                      }}
                      className="no-tap-highlight add-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md"
                    >
                      <HiPlus className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLYING ADD */}
      <AnimatePresence>
        {flyItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              left: item.startX - 6,
              top: item.startY - 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "var(--custom-primary)",
              zIndex: 100,
              opacity: 1,
              scale: 1,
              pointerEvents: "none",
            }}
            animate={{
              left: item.endX - 6,
              top: item.endY - 6,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            onAnimationComplete={() => {
              setFlyItems((prev) => prev.filter((i) => i.id !== item.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* FLYING REMOVE */}
      <AnimatePresence>
        {flyRemoveItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              left: item.startX - 6,
              top: item.startY - 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#b30000",
              zIndex: 100,
              opacity: 1,
              scale: 1,
              pointerEvents: "none",
            }}
            animate={{
              left: item.endX - 6,
              top: item.endY - 6,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            onAnimationComplete={() => {
              setFlyRemoveItems((prev) => prev.filter((i) => i.id !== item.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}