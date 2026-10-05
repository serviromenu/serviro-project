"use client";

import SmartImage from "@/components/ui/smart-image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiSearch,
  HiX,
  HiPlus,
  HiMinus,
  HiBell,
  HiOutlineCamera,
  HiOutlinePaperAirplane,
  HiOutlinePhone,
  HiOutlinePencilAlt,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineTag,
  HiOutlineCake,
  HiOutlineEmojiHappy,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { EmptySearch, EmptyCart } from "@/components/ui/empty-state";

interface DefaultTemplateProps {
  restaurant: any;
  about?: AboutData | null;
aboutFeatures?: AboutFeature[];
aboutImages?: AboutImage[];
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

interface AboutData {
  id?: string;
  enabled: boolean;
  title: string;
  short_description: string;
  story_title: string;
  story: string;
  cover_image: string;
}

interface AboutFeature {
  id: string;
  title: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

interface AboutImage {
  id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
}

export default function ClassicTemplate({
  restaurant,
  about = null,
  aboutFeatures = [],
  aboutImages = [],
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

      const timer = setTimeout(() => {
        setCartBounce(false);
      }, 400);

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

  const primary = restaurant.primary_color || "#1A1A1A";
  const bg = restaurant.bg_color || "#F7F7F7";
  const text = restaurant.text_color || "#1A1A1A"; // ← این خط اضافه شود
  const accent = restaurant.accent_color || "#1A1A1A";
  const surface = restaurant.surface_color || "#FFFFFF";

  root.style.setProperty("--custom-primary", primary);
  root.style.setProperty("--custom-bg", bg);
  root.style.setProperty("--custom-text", text);
  root.style.setProperty("--custom-accent", accent);
  root.style.setProperty("--custom-surface", surface);

  root.style.setProperty("--custom-border", `${text}1F`);
  root.style.setProperty("--custom-muted", `${text}99`);
  root.style.setProperty(
    "--custom-shadow",
    "0 2px 8px rgba(0, 0, 0, 0.06)"
  );

    const styleId = "serviro-mobile-dynamic-styles";

    let styleEl = document.getElementById(
      styleId
    ) as HTMLStyleElement | null;

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

      .mobile-safe-bottom {
        padding-bottom: max(24px, env(safe-area-inset-bottom));
      }

      .mobile-safe-top {
        padding-top: max(8px, env(safe-area-inset-top));
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
    fontFamily:
      restaurant?.font_family || "Vazirmatn, sans-serif",
    backgroundColor:
      restaurant?.bg_color || "#F7F7F7",
    color:
      restaurant?.text_color || "#1A1A1A",
  };

  const surfaceColorWithAlpha = restaurant?.surface_color
    ? `${restaurant.surface_color}CC`
    : "#FFFFFFCC";

  const allImages = selectedFood
    ? [
        ...(selectedFood.image_url
          ? [selectedFood.image_url]
          : []),
        ...selectedFoodImages
          .map((img: any) => img.image_url)
          .filter(Boolean),
      ]
    : [];

  const goToPrevImage = () => {
    if (allImages.length === 0) return;

    const currentIndex = allImages.indexOf(
      currentModalImage
    );

    const safeIndex =
      currentIndex < 0 ? 0 : currentIndex;

    const newIndex =
      (safeIndex - 1 + allImages.length) %
      allImages.length;

    setCurrentModalImage(allImages[newIndex]);
  };

  const goToNextImage = () => {
    if (allImages.length === 0) return;

    const currentIndex = allImages.indexOf(
      currentModalImage
    );

    const safeIndex =
      currentIndex < 0 ? 0 : currentIndex;

    const newIndex =
      (safeIndex + 1) % allImages.length;

    setCurrentModalImage(allImages[newIndex]);
  };

  const handleAddToCart = (
    food: any,
    e: React.MouseEvent
  ) => {
    const btn = e.currentTarget as HTMLElement;

    const rect = btn.getBoundingClientRect();

    const startX =
      rect.left + rect.width / 2;

    const startY =
      rect.top + rect.height / 2;

    const targetEl = cartMobileRef.current;

    if (!targetEl) {
      addToCart(food);
      return;
    }

    const targetRect =
      targetEl.getBoundingClientRect();

    const endX =
      targetRect.left + targetRect.width / 2;

    const endY =
      targetRect.top + targetRect.height / 2;

    const flyId = `${food.id}-${Date.now()}`;

    setFlyItems((prev) => [
      ...prev,
      {
        id: flyId,
        startX,
        startY,
        endX,
        endY,
      },
    ]);

    addToCart(food);
  };

  const handleRemoveFromCart = (
    foodId: string,
    e: React.MouseEvent
  ) => {
    const currentQuantity =
      cart.find(
        (i: any) => i.food.id === foodId
      )?.quantity || 1;

    updateQuantity(
      foodId,
      currentQuantity - 1
    );

    const btn = e.currentTarget as HTMLElement;

    const rect = btn.getBoundingClientRect();

    const endX =
      rect.left + rect.width / 2;

    const endY =
      rect.top + rect.height / 2;

    const targetEl = cartMobileRef.current;

    if (!targetEl) return;

    const targetRect =
      targetEl.getBoundingClientRect();

    const startX =
      targetRect.left + targetRect.width / 2;

    const startY =
      targetRect.top + targetRect.height / 2;

    const flyId =
      `remove-${foodId}-${Date.now()}`;

    setFlyRemoveItems((prev) => [
      ...prev,
      {
        id: flyId,
        startX,
        startY,
        endX,
        endY,
      },
    ]);
  };

  return (
    <div
      className="
        relative
        flex
        min-h-[100dvh]
        w-full
        flex-col
        overflow-x-hidden
        scrollbar-hide
        bg-[var(--custom-bg)]
        text-[var(--custom-text)]
      "
      style={customStyles}
    >
      {/* =========================
          MAIN
      ========================== */}

      <main
        className="
          flex
          min-h-0
          flex-1
          flex-col
          overflow-y-auto
          overflow-x-hidden
          scrollbar-hide
        "
      >
        {/* =========================
            HEADER
        ========================== */}

        <div
          className="
            sticky
            top-0
            z-30
            flex
            min-h-[64px]
            items-center
            justify-between
            gap-2
            px-4
            pt-[max(8px,env(safe-area-inset-top))]
            pb-2
            backdrop-blur-md
          "
          style={{
            backgroundColor: restaurant?.bg_color
              ? `${restaurant.bg_color}E6`
              : "#F7F7F7E6",
          }}
        >
          {/* SEARCH TOGGLE (جایگزین شماره میز) */}
          <div className="flex w-10 shrink-0 items-center justify-center">
            <motion.button
              onClick={() => {
                setActiveView("menu");
                setSearchOpen((prev) => !prev);
              }}
              whileTap={{ scale: 0.86 }}
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
              style={{
                color:
                  restaurant?.primary_color ||
                  "#1A1A1A",
              }}
              aria-label="جستجو"
            >
              <HiSearch className="text-lg" />
            </motion.button>
          </div>

          {/* LOGO */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            {restaurant?.logo_url ? (
  <div className="relative h-10 w-[110px] sm:h-11">
    <SmartImage
      src={restaurant.logo_url}
      alt={restaurant?.name || ""}
      fill
      objectFit="contain"
    />
  </div>
) : (
  <div className="h-10" />
)}
          </div>

          {/* WAITER / TABLE NUMBER */}
<div className="flex w-10 shrink-0 items-center justify-center">
  {restaurant?.waiter_call_enabled === false ? (
    <div className="no-tap-highlight flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
      <span
        className="text-xs font-medium leading-none"
        style={{ color: restaurant?.primary_color || "#1A1A1A" }}
      >
        {tableNumber}
      </span>
    </div>
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

        {/* SEARCH EXPANDABLE BAR */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden px-4 pt-2 pb-2"
            >
              <div className="relative w-full">
                <HiSearch
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-lg
                    text-gray-400
                  "
                />

                <input
  autoFocus
  type="text"
  placeholder="جستجو..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="
    h-11
    w-full
    rounded-3xl
    bg-white
    py-2.5
    pl-10
    pr-10
    text-sm
    font-light
    shadow-sm
    outline-none
    transition-all
    placeholder:text-gray-400
  "
  style={{
    color: restaurant?.text_color || "#1A1A1A",
  }}
/>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="
                      no-tap-highlight
                      absolute
                      left-3
                      top-1/2
                      flex
                      h-7
                      w-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      text-gray-400
                    "
                    aria-label="پاک کردن جستجو"
                  >
                    <HiX className="text-lg" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WAITER TOAST */}
        <AnimatePresence>
          {waiterMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 25,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                fixed
                bottom-[max(20px,env(safe-area-inset-bottom))]
                left-1/2
                z-[100]
                max-w-[calc(100vw-32px)]
                -translate-x-1/2
                overflow-hidden
                text-ellipsis
                whitespace-nowrap
                rounded-xl
                px-4
                py-2.5
                text-xs
                text-white
                shadow-xl
              "
              style={{
                backgroundColor:
                  "var(--custom-primary)",
              }}
            >
              {waiterMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================
            MENU
        ========================== */}

        {activeView === "menu" && (
          <>
            {/* CATEGORIES */}
<div className="mobile-menu-scroll mt-2 overflow-x-auto px-4 scrollbar-hide">
  <div className="flex gap-5 pb-2">
    {categories.map((cat: any) => {
      const catImage = cat.image_url || foods.find(
        (f: any) => f.category_id === cat.id
      )?.image_url;

      const isSelected = selectedCategory === cat.id;

      return (
        <button
          key={cat.id}
          onClick={() => {
            setSelectedCategory(cat.id);
            setPreviousCategory(cat.id);
          }}
          className="
            no-tap-highlight
            flex
            shrink-0
            flex-col
            items-center
            gap-1.5
          "
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-full transition-all duration-200">
            {catImage ? (
              <SmartImage
                src={catImage}
                alt={cat.name}
                fill
                objectFit="cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white">
                <span
                  className="text-base font-medium"
                  style={{ color: "var(--custom-primary)" }}
                >
                  {cat.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <span
            className={`
              text-[11px]
              font-medium
              leading-none
              ${
                isSelected
                  ? "text-[var(--custom-primary)]"
                  : "text-luxury-muted"
              }
            `}
            style={
              isSelected
                ? {
                    color:
                      restaurant?.primary_color ||
                      "#1A1A1A",
                  }
                : undefined
            }
          >
            {cat.name}
          </span>
        </button>
      );
    })}
  </div>
</div>

            {/* FOOD LIST */}
            <div className="px-4 pt-5 pb-32">
              {filteredFoods.length === 0 ? (
                <EmptySearch query={searchQuery} />
              ) : (
                <motion.div
                  layout
                  className="flex flex-col gap-3"
                >
                  {filteredFoods.map((food: any) => {
                    const cartItem = cart.find(
                      (item: any) =>
                        item.food.id === food.id
                    );

                    const quantity =
                      cartItem?.quantity || 0;

                    return (
                      <motion.div
                        key={food.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        className="
                          flex
                          min-h-[96px]
                          w-full
                          items-center
                          gap-3
                          overflow-hidden
                          rounded-2xl
                          p-3
                          shadow-sm
                        "
                        style={{
                          backgroundColor:
                            "var(--custom-surface)",
                        }}
                        onClick={() =>
                          setSelectedFood(food)
                        }
                      >
                        {/* IMAGE - RIGHT */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          {food.image_url ? (
  <SmartImage
    src={food.image_url}
    alt={food.name}
    fill
    objectFit="contain"
  />
) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                text-2xl
                                opacity-20
                              "
                            >
                              {food.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* NAME + PRICE + DESCRIPTION */}
                        <div
                          className="
                            min-w-0
                            flex-1
                            self-stretch
                          "
                        >
                          <div
                            className="
                              flex
                              h-full
                              flex-col
                              justify-center
                            "
                          >
                            <h3
                              className="
                                truncate
                                text-sm
                                font-semibold
                                leading-6
                              "
                              style={{
                                color:
                                  restaurant?.text_color ||
                                  "#1A1A1A",
                              }}
                            >
                              {food.name}
                            </h3>

                            {/* قیمت زیر اسم محصول */}
                            <span
                              className="
                                mt-1
                                block
                                text-xs
                                font-extrabold
                                leading-5
                                opacity-80
                              "
                              style={{
                                color:
                                  restaurant?.accent_color ||
                                  "#1A1A1A",
                              }}
                            >
                              {food.price.toLocaleString()}{" "}
                              تومان
                            </span>

                            {food.description && (
                              <p
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-[11px]
                                  font-light
                                  leading-5
                                  opacity-60
                                "
                                style={{
                                  color:
                                    restaurant?.text_color ||
                                    "#666",
                                }}
                              >
                                {food.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* BUTTON / QUANTITY - LEFT */}
                        <div
                          className="
                            flex
                            h-full
                            shrink-0
                            items-center
                            justify-center
                            py-1
                          "
                        >
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
                            <div className="flex items-center gap-1">
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

                              <span
                                className="
                                  w-4
                                  text-center
                                  text-xs
                                  font-medium
                                "
                              >
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
            ABOUT
        ========================== */}

        {activeView === "about" && (
  <section className="w-full px-4 pb-28 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
    <div className="mx-auto w-full max-w-4xl">
      {about?.enabled ? (
        <div className="space-y-10">
          <div className="text-center">
            {about.title && (
              <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--custom-text)" }}>
                {about.title}
              </h1>
            )}
            {about.short_description && (
              <p className="mt-4 text-sm font-light leading-7 sm:text-base" style={{ color: "var(--custom-muted)" }}>
                {about.short_description}
              </p>
            )}
          </div>

          {about.cover_image && (
            <div className="relative h-56 w-full overflow-hidden rounded-3xl sm:h-72 lg:h-96" style={{ backgroundColor: "var(--custom-surface)", boxShadow: "var(--custom-shadow)" }}>
              <SmartImage src={about.cover_image} alt={about.title || ""} fill objectFit="cover" />
            </div>
          )}

          {about.story && (
            <div className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: "var(--custom-border)", backgroundColor: "var(--custom-surface)", boxShadow: "var(--custom-shadow)" }}>
              {about.story_title && (
                <h2 className="text-xl font-medium sm:text-2xl" style={{ color: "var(--custom-text)" }}>
                  {about.story_title}
                </h2>
              )}
              <p className="mt-4 whitespace-pre-line text-sm font-light leading-7" style={{ color: "var(--custom-muted)" }}>
                {about.story}
              </p>
            </div>
          )}

          {aboutFeatures.filter(f => f.is_active).length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-medium" style={{ color: "var(--custom-muted)" }}>
                ویژگی‌های مجموعه
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {aboutFeatures.filter(f => f.is_active).map(feature => (
                  <div key={feature.id} className="flex items-center justify-center rounded-2xl border px-4 py-3 text-center text-xs font-light" style={{ borderColor: "var(--custom-border)", backgroundColor: "var(--custom-surface)", color: "var(--custom-text)" }}>
                    {feature.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {aboutImages.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-medium" style={{ color: "var(--custom-muted)" }}>
                گالری تصاویر
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {aboutImages.map(img => (
                  <div key={img.id} className="relative h-32 overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--custom-surface)", boxShadow: "var(--custom-shadow)" }}>
                    <SmartImage src={img.image_url} alt={img.caption || ""} fill objectFit="cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center text-sm font-light" style={{ color: "var(--custom-muted)" }}>
          اطلاعات این مجموعه به‌زودی تکمیل می‌شود.
        </div>
      )}
    </div>
  </section>
)}

        {/* =========================
            ORDERS
        ========================== */}

        {activeView === "orders" && (
          <div
            className="
              mx-auto
              w-full
              max-w-lg
              px-4
              pt-8
              pb-28
            "
          >
            <h2
              className="
                mb-5
                text-xl
                font-light
              "
              style={{
                color:
                  restaurant?.text_color ||
                  "#1A1A1A",
              }}
            >
              سفارشات شما
            </h2>

            {cart.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <div
                    key={item.food.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      p-3.5
                      shadow-sm
                    "
                    style={{
                      backgroundColor:
                        "var(--custom-surface)",
                    }}
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                          {item.food.image_url ? (
  <SmartImage
    src={item.food.image_url}
    alt=""
    fill
    objectFit="contain"
  />
) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                bg-white
                                text-2xl
                                text-luxury-muted/30
                              "
                            >
                              {item.food.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4
                            className="
                              truncate
                              text-sm
                              font-light
                            "
                            style={{
                              color:
                                restaurant?.text_color ||
                                "#1A1A1A",
                            }}
                          >
                            {item.food.name}
                          </h4>

                          <p
                            className="
                              mt-1
                              truncate
                              text-[11px]
                              opacity-70
                            "
                            style={{
                              color:
                                restaurant?.accent_color ||
                                "#1A1A1A",
                            }}
                          >
                            {item.food.price.toLocaleString()}{" "}
                            تومان
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-1.5
                        "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromCart(item.food.id, e);
                          }}
                          className="
                            no-tap-highlight
                            qty-btn
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                          "
                          aria-label="کم کردن"
                        >
                          <HiMinus className="text-xs" />
                        </button>

                        <span
                          className="
                            w-5
                            shrink-0
                            text-center
                            text-xs
                            font-medium
                          "
                          style={{
                            color:
                              restaurant?.text_color ||
                              "#1A1A1A",
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.food, e);
                          }}
                          className="
                            no-tap-highlight
                            qty-btn
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                          "
                          aria-label="افزایش"
                        >
                          <HiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex min-w-0 items-center gap-2">
                      <HiOutlinePencilAlt
                        className="shrink-0 text-sm"
                        style={{
                          color:
                            restaurant?.primary_color
                              ? `${restaurant.primary_color}99`
                              : "#666",
                        }}
                      />

                      <input
                        type="text"
                        placeholder="یادداشت ..."
                        value={item.note || ""}
                        onChange={(e) =>
                          updateNote(
                            item.food.id,
                            e.target.value
                          )
                        }
                        className="
                          min-w-0
                          flex-1
                          border-b
                          border-gray-300
                          bg-transparent
                          px-1
                          py-1
                          text-xs
                          font-light
                          outline-none
                          placeholder:text-gray-400
                          focus:border-gray-400
                        "
                        style={{
                          color:
                            restaurant?.text_color ||
                            "#1A1A1A",
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-4 border-t border-luxury-border pt-4">
                  <span
                    className="
                      shrink-0
                      text-base
                      font-light
                    "
                    style={{
                      color:
                        restaurant?.text_color ||
                        "#1A1A1A",
                    }}
                  >
                    جمع کل:
                  </span>

                  <span
                    className="
                      min-w-0
                      truncate
                      text-right
                      text-lg
                      font-light
                      opacity-70
                    "
                    style={{
                      color:
                        restaurant?.accent_color ||
                        "#1A1A1A",
                    }}
                  >
                    {totalCartPrice.toLocaleString()}{" "}
                    تومان
                  </span>
                </div>

                <button
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3.5
                    text-base
                    font-light
                    tracking-wide
                    text-white
                    transition-opacity
                    active:opacity-80
                  "
                  style={{
                    backgroundColor:
                      restaurant?.accent_color ||
                      "#1A1A1A",
                  }}
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

      {/* =========================
    BOTTOM NAVIGATION
========================= */}

<div
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-50
    flex
    justify-center
    px-4
    sm:px-6
    pb-[max(16px,env(safe-area-inset-bottom))]
    sm:pb-[max(18px,env(safe-area-inset-bottom))]
    pt-2
  "
>
  <div
    className="
      flex
      h-14
      sm:h-16
      w-full
      items-center
      justify-around
      rounded-full
      px-2
      sm:px-3
      shadow-xl
      backdrop-blur-md
    "
    style={{
      backgroundColor: surfaceColorWithAlpha,
    }}
  >
    {/* MENU */}
    <button
      onClick={() => setActiveView("menu")}
      className="
        flex
        h-9
        w-9
        sm:h-11
        sm:w-11
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
      "
      style={{
        backgroundColor:
          activeView === "menu"
            ? "var(--custom-primary)"
            : "transparent",
        color:
          activeView === "menu"
            ? "#FFFFFF"
            : "var(--custom-text)",
      }}
    >
      <HiOutlineTag className="text-lg sm:text-xl" />
    </button>

    {/* ORDERS */}
    <button
      onClick={() => setActiveView("orders")}
      className="
        relative
        flex
        h-9
        w-9
        sm:h-11
        sm:w-11
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
      "
      style={{
        backgroundColor:
          activeView === "orders"
            ? "var(--custom-primary)"
            : "transparent",
        color:
          activeView === "orders"
            ? "#FFFFFF"
            : "var(--custom-text)",
      }}
    >
      <HiOutlineStar className="text-lg sm:text-xl" />

      {totalCartItems > 0 && (
        <span
          ref={cartMobileRef}
          className={`
            absolute
            -right-0.5
            -top-0.5
            flex
            h-4
            w-4
            items-center
            justify-center
            rounded-full
            text-[8px]
            text-white
            transition-transform
            duration-200
            ${cartBounce ? "scale-125" : "scale-100"}
          `}
          style={{
            backgroundColor: "var(--custom-accent)",
            lineHeight: 1,
          }}
        >
          {totalCartItems}
        </span>
      )}
    </button>

    {/* ABOUT */}
    <button
      onClick={() => setActiveView("about")}
      className="
        flex
        h-9
        w-9
        sm:h-11
        sm:w-11
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
      "
      style={{
        backgroundColor:
          activeView === "about"
            ? "var(--custom-primary)"
            : "transparent",
        color:
          activeView === "about"
            ? "#FFFFFF"
            : "var(--custom-text)",
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
            className="
              fixed
              inset-0
              z-[95]
              flex
              items-center
              justify-center
              overflow-hidden
              bg-black/40
              p-3
              backdrop-blur-sm
              sm:p-4
            "
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{
                y: 40,
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                y: 40,
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="
                relative
                flex
                w-full
                max-w-[420px]
                flex-col
                overflow-hidden
                rounded-3xl
                shadow-2xl
              "
              style={{
                maxHeight: "calc(100dvh - 24px)",
                backgroundColor: "var(--custom-surface)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}
              <button
                onClick={() => setSelectedFood(null)}
                className="
                  no-tap-highlight
                  absolute
                  right-3
                  top-3
                  z-20
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-black/25
                  text-white
                  backdrop-blur-sm
                "
                aria-label="بستن"
              >
                <HiX className="text-sm" />
              </button>

              {/* IMAGE */}
              <div
                className="
                  relative
                  aspect-square
                  max-h-[46dvh]
                  w-full
                  shrink-0
                  overflow-hidden
                  bg-white
                  p-5
                "
              >
                {currentModalImage ? (
  <SmartImage
    src={currentModalImage}
    alt={selectedFood.name || ""}
    fill
    objectFit="contain"
  />
) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      bg-white
                      text-5xl
                      font-extralight
                      text-luxury-muted/20
                    "
                  >
                    {selectedFood.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {allImages.length > 1 && (
                <div className="mt-2 flex shrink-0 items-center px-2">
                  <button
                    onClick={goToPrevImage}
                    className="
                      no-tap-highlight
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-luxury-text
                      shadow-sm
                    "
                    aria-label="تصویر قبلی"
                  >
                    <HiOutlineChevronRight className="text-sm" />
                  </button>

                  <div
                    ref={thumbnailScrollRef}
                    className="
                      mx-1
                      min-w-0
                      flex-1
                      overflow-x-auto
                      scrollbar-hide
                    "
                  >
                    <div className="flex w-max min-w-full justify-center gap-2 py-1.5">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          data-image-url={imgUrl}
                          onClick={() => setCurrentModalImage(imgUrl)}
                          className={`
                            h-10
                            w-10
                            shrink-0
                            overflow-hidden
                            rounded-lg
                            transition-all
                            ${
                              currentModalImage === imgUrl
                                ? "opacity-100 ring-1 ring-gray-400 ring-offset-1"
                                : "opacity-60"
                            }
                          `}
                        >
                          <SmartImage
  src={imgUrl}
  alt=""
  width={40}
  height={40}
  objectFit="cover"
/>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={goToNextImage}
                    className="
                      no-tap-highlight
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-luxury-text
                      shadow-sm
                    "
                    aria-label="تصویر بعدی"
                  >
                    <HiOutlineChevronLeft className="text-sm" />
                  </button>
                </div>
              )}

              {/* CONTENT */}
              <div
                className="
                  min-h-0
                  overflow-y-auto
                  px-4
                  pb-[max(16px,env(safe-area-inset-bottom))]
                  pt-3
                "
              >
                <h2
                  className="
                    break-words
                    text-base
                    font-bold
                    leading-6
                  "
                  style={{
                    color:
                      restaurant?.text_color || "#1A1A1A",
                  }}
                >
                  {selectedFood.name}
                </h2>

                {selectedFood.description && (
                  <p
                    className="
                      mt-1.5
                      break-words
                      text-xs
                      font-light
                      leading-6
                    "
                    style={{
                      color:
                        restaurant?.text_color
                          ? `${restaurant.text_color}99`
                          : "#666",
                    }}
                  >
                    {selectedFood.description}
                  </p>
                )}

                <div
                  className="
                    mt-3
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      min-w-0
                      truncate
                      text-sm
                      font-bold
                      tracking-wide
                      opacity-70
                    "
                    style={{
                      color:
                        restaurant?.accent_color || "#1A1A1A",
                    }}
                  >
                    {selectedFood.price.toLocaleString()} تومان
                  </span>

                  {cart.find(
                    (i: any) => i.food.id === selectedFood.id
                  ) ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCart(selectedFood.id, e);
                        }}
                        className="
                          no-tap-highlight
                          qty-btn
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                        "
                      >
                        <HiMinus className="text-sm" />
                      </button>

                      <span
                        className="w-5 text-center text-sm font-medium"
                        style={{
                          color:
                            restaurant?.text_color || "#1A1A1A",
                        }}
                      >
                        {
                          cart.find(
                            (i: any) => i.food.id === selectedFood.id
                          )?.quantity
                        }
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(selectedFood, e);
                        }}
                        className="
                          no-tap-highlight
                          qty-btn
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                        "
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
              setFlyItems((prev) =>
                prev.filter((i) => i.id !== item.id)
              );
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
              setFlyRemoveItems((prev) =>
                prev.filter((i) => i.id !== item.id)
              );
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}