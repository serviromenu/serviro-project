"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabase";
import { HiPencil, HiTrash, HiPlus, HiX, HiUpload, HiMenuAlt2, HiCheck, HiMenu, HiSelector } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/skeleton";
import { EmptyFoods, EmptyCategories, EmptyWaiterCalls, EmptySearch } from "@/components/ui/empty-state";
import { compressImage } from "@/utils/compressImage";
import CategoryRow from "./components/CategoryRow";
import dynamic from "next/dynamic";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const FoodsList = dynamic(
  () => import("./components/FoodsList"),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl bg-white animate-pulse"
          />
        ))}
      </div>
    ),
  }
);

const defaultCustomization = {
  primaryColor: "#1A1A1A",
  bgColor: "#F7F7F7",
  textColor: "#1A1A1A",
  accentColor: "#1A1A1A",
  surfaceColor: "#FFFFFF",
  fontFamily: "Vazirmatn",
  template: "default",
};

const colorPalettes = [
  {
    id: "default",
    name: "پیش‌فرض",
    colors: {
      primaryColor: "#1A1A1A",
      bgColor: "#F7F7F7",
      textColor: "#1A1A1A",
      accentColor: "#1A1A1A",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "luxury",
    name: "لوکس",
    colors: {
      primaryColor: "#1A1A1A",
      bgColor: "#F5F0E8",
      textColor: "#2B2B2B",
      accentColor: "#B08D57",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "cafe",
    name: "کافه سبز",
    colors: {
      primaryColor: "#2F4F4F",
      bgColor: "#F6F7F4",
      textColor: "#2B2B2B",
      accentColor: "#4F7A5C",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "fastfood",
    name: "فست‌فود",
    colors: {
      primaryColor: "#B23B3B",
      bgColor: "#FFF8F0",
      textColor: "#1A1A1A",
      accentColor: "#E07A2F",
      surfaceColor: "#FFFFFF",
    },
  },
    {
    id: "ocean",
    name: "اقیانوسی",
    colors: {
      primaryColor: "#0F766E",
      bgColor: "#F0FDFA",
      textColor: "#134E4A",
      accentColor: "#2DD4BF",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "navy",
    name: "سرمه‌ای",
    colors: {
      primaryColor: "#1E3A5F",
      bgColor: "#F4F6FA",
      textColor: "#1E2A38",
      accentColor: "#D97706",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "rose",
    name: "رز طلایی",
    colors: {
      primaryColor: "#9D174D",
      bgColor: "#FFF1F2",
      textColor: "#500724",
      accentColor: "#F59E0B",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "coffee",
    name: "کرم و قهوه",
    colors: {
      primaryColor: "#5C4033",
      bgColor: "#FAF6F0",
      textColor: "#3E2723",
      accentColor: "#B08D57",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "purple",
    name: "بنفش آرام",
    colors: {
      primaryColor: "#4C1D95",
      bgColor: "#F5F3FF",
      textColor: "#2E1065",
      accentColor: "#A855F7",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "charcoal-orange",
    name: "زغالی و نارنجی",
    colors: {
      primaryColor: "#1F2937",
      bgColor: "#FFF7ED",
      textColor: "#111827",
      accentColor: "#EA580C",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "ice",
    name: "یخی",
    colors: {
      primaryColor: "#0369A1",
      bgColor: "#F0F9FF",
      textColor: "#0C4A6E",
      accentColor: "#38BDF8",
      surfaceColor: "#FFFFFF",
    },
  },
  {
    id: "olive",
    name: "زیتونی",
    colors: {
      primaryColor: "#3F3F2E",
      bgColor: "#F7F7F2",
      textColor: "#333326",
      accentColor: "#8A8D5A",
      surfaceColor: "#FFFFFF",
    },
  },
];

const fontOptions = [
  { value: "Vazir", label: "وزیر", preview: "متن نمونه با وزیر" },
  { value: "Shabnam", label: "شبنم", preview: "متن نمونه با شبنم" },
  { value: "Sahel", label: "ساحل", preview: "متن نمونه با ساحل" },
  { value: "Samim", label: "صمیم", preview: "متن نمونه با صمیم" },
  { value: "Tanha", label: "تنها", preview: "متن نمونه با تنها" },
  { value: "Parastoo", label: "پرستو", preview: "متن نمونه با پرستو" },
  { value: "Yekan", label: "یکان", preview: "متن نمونه با یکان" },
];

const templateOptions = [
  {
    value: "default",
    label: "پیش‌فرض",
    description: "کارت‌های مربعی و سایدبار",
  },
  {
    value: "classic",
    label: "کلاسیک",
    description: "لیست محصولات و ناوبری پایین",
  },
  {
    value: "moon",
    label: "ماه",
    description: "هدر الهام‌گرفته از کافه مون",
  },
];

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
  waiter_call_enabled?: boolean;
  slug?: string;
  waiter_code_enabled?: boolean;
  waiter_code?: string;
}

interface AboutData {
  id?: string;
  restaurant_id: string;
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
  sort_order: number;
  image_url?: string;
  icon?: string;
}

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  category_id: string;
  sort_order?: number;
}

interface WaiterCall {
  id: string;
  table_number: string;
  status: "new" | "acknowledged";
  created_at: string;
}

interface FoodImage {
  id?: string;
  image_url: string;
  file?: File;
}

export default function Dashboard() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [waiterCodeFormVisible, setWaiterCodeFormVisible] = useState(false);
  const [waiterCodeEnabled, setWaiterCodeEnabled] = useState(false);
const [waiterCode, setWaiterCode] = useState("");
  const [workingHoursWeekdays, setWorkingHoursWeekdays] = useState("");
const [workingHoursThursday, setWorkingHoursThursday] = useState("");
const [workingHoursFriday, setWorkingHoursFriday] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [restSlug, setRestSlug] = useState("");
  const [fontModalOpen, setFontModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState("default");
  const [waiterCallEnabled, setWaiterCallEnabled] = useState(true);
  const [foodImages, setFoodImages] = useState<FoodImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"foods" | "categories" | "settings" | "qrcodes" | "waiter" | "customize">("foods");
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalType, setModalType] = useState<"food" | "category">("food");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [foodName, setFoodName] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [foodAvailable, setFoodAvailable] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImageUrl, setCategoryImageUrl] = useState<string>("");
const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
const categoryImageInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [restName, setRestName] = useState("");
  const [restDesc, setRestDesc] = useState("");
  const [restAddress, setRestAddress] = useState("");
  const [restWorkingHours, setRestWorkingHours] = useState("");
  const [restInstagram, setRestInstagram] = useState("");
  const [restTelegram, setRestTelegram] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [restMapUrl, setRestMapUrl] = useState("");
  const [restLogoFile, setRestLogoFile] = useState<File | null>(null);
  const [restLogoPreview, setRestLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [primaryColor, setPrimaryColor] = useState(defaultCustomization.primaryColor);
  const [bgColor, setBgColor] = useState(defaultCustomization.bgColor);
  const [textColor, setTextColor] = useState(defaultCustomization.textColor);
  const [accentColor, setAccentColor] = useState(defaultCustomization.accentColor);
  const [fontFamily, setFontFamily] = useState(defaultCustomization.fontFamily);
  const [surfaceColor, setSurfaceColor] = useState(defaultCustomization.surfaceColor);
  const [template, setTemplate] = useState(defaultCustomization.template);

  const [qrTable, setQrTable] = useState("");
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [newCallsCount, setNewCallsCount] = useState(0);
  const [adminSelectedCategory, setAdminSelectedCategory] = useState<string | null>(null);

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);

  const [about, setAbout] = useState<AboutData | null>(null);
const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>([]);
const [aboutImages, setAboutImages] = useState<AboutImage[]>([]);

const [aboutShortDescription, setAboutShortDescription] = useState("");
const [aboutStoryTitle, setAboutStoryTitle] = useState("داستان ما");
const [aboutStory, setAboutStory] = useState("");
const [aboutCoverImage, setAboutCoverImage] = useState("");

const [aboutUploading, setAboutUploading] = useState(false);
const aboutCoverInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (fontModalOpen || templateModalOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [fontModalOpen, templateModalOpen]);

  function formatWaiterTime(createdAt: string) {
  if (!createdAt) return "";

  // بررسی وجود Z یا +offset در رشته
  const hasTimezoneInfo = createdAt.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(createdAt);

  const date = hasTimezoneInfo
    ? new Date(createdAt)
    : new Date(createdAt + "Z"); // فرض UTC

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

  function extractMapSrc(input: string): string {
  const match = input.match(/<iframe[^>]+src="([^"]+)"/i);
  return match ? match[1] : input;
}

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/admin"; return; }
    const { data: rest } = await supabase.from("restaurants").select("*").eq("user_id", user.id).single();
    if (rest) {
      setRestaurant(rest);
      setRestName(rest.name);
      setRestDesc(rest.description || "");
      setRestAddress(rest.address || "");
      setRestWorkingHours(rest.working_hours || "");
      setRestInstagram(rest.instagram || "");
      setRestTelegram(rest.telegram || "");
      setRestPhone(rest.phone || "");
      setRestMapUrl(rest.map_url || "");
      setWorkingHoursWeekdays(rest.working_hours_weekdays || "");
setWorkingHoursThursday(rest.working_hours_thursday || "");
setWorkingHoursFriday(rest.working_hours_friday || "");
      setRestLogoPreview(rest.logo_url || "");
      setPrimaryColor(rest.primary_color || defaultCustomization.primaryColor);
      setBgColor(rest.bg_color || defaultCustomization.bgColor);
      setTextColor(rest.text_color || defaultCustomization.textColor);
      setAccentColor(rest.accent_color || defaultCustomization.accentColor);
      setFontFamily(rest.font_family || defaultCustomization.fontFamily);
      setSurfaceColor(rest.surface_color || defaultCustomization.surfaceColor);
      setTemplate(rest.template || defaultCustomization.template);
      setRestSlug(rest.slug || "");
      setWaiterCallEnabled(rest.waiter_call_enabled ?? true);
      setWaiterCodeEnabled(rest.waiter_code_enabled ?? false);
setWaiterCode(rest.waiter_code || "");
setWaiterCodeFormVisible(!rest.waiter_code);

      const [
  catRes,
  foodRes,
  callsRes,
  aboutRes,
  featuresRes,
  aboutImagesRes,
] = await Promise.all([
  supabase
  .from("categories")
  .select("id, name, sort_order, image_url, icon")
  .eq("restaurant_id", rest.id)
  .order("sort_order"),
  supabase
  .from("foods")
  .select("id, name, description, price, image_url, is_available, category_id, sort_order")
  .eq("restaurant_id", rest.id)
  .order("sort_order"),
 supabase
  .from("waiter_calls")
  .select("id, table_number, status, created_at")
  .eq("restaurant_id", rest.id)
  .order("created_at", { ascending: false })
  .limit(50),
  supabase
  .from("restaurant_about")
  .select("id, restaurant_id, enabled, title, short_description, story_title, story, cover_image")
  .eq("restaurant_id", rest.id)
  .maybeSingle(),
  supabase
  .from("restaurant_about_features")
  .select("id, restaurant_id, title, icon, sort_order, is_active")
  .eq("restaurant_id", rest.id)
  .order("sort_order"),
  supabase
  .from("restaurant_about_images")
  .select("id, restaurant_id, image_url, caption, sort_order")
  .eq("restaurant_id", rest.id)
  .order("sort_order"),
]);

if (catRes.data) setCategories(catRes.data);
if (foodRes.data) setFoods(foodRes.data);
if (callsRes.data) { setWaiterCalls(callsRes.data); setNewCallsCount(callsRes.data.filter((c: WaiterCall) => c.status === "new").length); }

if (aboutRes.data) {
  setAbout(aboutRes.data);
  setAboutShortDescription(aboutRes.data.short_description || "");
  setAboutStoryTitle(aboutRes.data.story_title || "داستان ما");
  setAboutStory(aboutRes.data.story || "");
  setAboutCoverImage(aboutRes.data.cover_image || "");
} else {
  setAbout(null);
  setAboutShortDescription("");
  setAboutStoryTitle("داستان ما");
  setAboutStory("");
  setAboutCoverImage("");
}

setAboutFeatures(featuresRes.data || []);
setAboutImages(aboutImagesRes.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!restaurant) return;
    const channel = supabase.channel("waiter_calls_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "waiter_calls", filter: `restaurant_id=eq.${restaurant.id}` }, (payload) => {
        const newCall = payload.new as WaiterCall;
        setWaiterCalls((prev) => [newCall, ...prev]);
        if (newCall.status === "new") setNewCallsCount((prev) => prev + 1);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurant]);

  async function handleLogout() { await supabase.auth.signOut(); window.location.href = "/admin"; }

  async function openFoodModal(food?: Food) {
    setModalType("food");
    if (food) {
      setEditingFood(food); setFoodName(food.name); setFoodDesc(food.description || "");
      setFoodPrice(food.price.toString()); setFoodCategory(food.category_id || "");
      setImageUrl(food.image_url || ""); setFoodAvailable(food.is_available);
      // دریافت تصاویر اضافی از دیتابیس
      const { data: images } = await supabase
        .from("food_images")
        .select("*")
        .eq("food_id", food.id)
        .order("sort_order");
      setFoodImages(images || []);
      setNewFiles([]);
    } else {
      setEditingFood(null); setFoodName(""); setFoodDesc(""); setFoodPrice("");
      setFoodCategory(""); setImageUrl(""); setFoodAvailable(true);
      setFoodImages([]);
      setNewFiles([]);
    }
    setShowModal(true);
  }

  function openCategoryModal(cat?: Category) {
  setModalType("category");
  if (cat) {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryImageUrl(cat.image_url || ""); // ← لود عکس موجود
  } else {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImageUrl(""); // ← ریست
  }
  setCategoryImageFile(null);
  setShowModal(true);
}

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error, data } = await supabase.storage.from("restaurant-images").upload(`foods/${fileName}`, compressed, { cacheControl: "31536000", upsert: false });
      if (!error) {
        const { data: urlData } = supabase.storage.from("restaurant-images").getPublicUrl(data.path);
        setImageUrl(urlData.publicUrl);
      } else {
        alert("خطا در آپلود تصویر");
      }
    } catch { alert("خطا در فشرده‌سازی تصویر"); }
    setUploading(false);
  }

  // آپلود فوری تصاویر اضافی
  async function handleAddImages(files: FileList | null) {
    if (!files) return;
    const fileArray = Array.from(files);
    setUploading(true);
    const uploaded: FoodImage[] = [];
    for (const file of fileArray) {
      try {
        const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error, data } = await supabase.storage
          .from("restaurant-images")
          .upload(`foods/${fileName}`, compressed, { cacheControl: "31536000", upsert: false });
        if (!error) {
          const { data: urlData } = supabase.storage.from("restaurant-images").getPublicUrl(data.path);
          uploaded.push({ image_url: urlData.publicUrl, file: compressed });
        }
      } catch { /* skip failed uploads */ }
    }
    setFoodImages(prev => [...prev, ...uploaded]);
    setNewFiles(prev => [...prev, ...fileArray]);
    setUploading(false);
  }

  async function handleSaveFood() {
  if (!restaurant) return;
  setIsSaving(true);
  setSaveSuccess(false);
  try {
    const data = {
      name: foodName,
      description: foodDesc,
      price: parseInt(foodPrice) || 0,
      category_id: foodCategory || null,
      image_url: imageUrl || null,
      is_available: foodAvailable,
      restaurant_id: restaurant.id,
      sort_order: editingFood?.sort_order ?? foods.length,
    };

    let foodId: string | undefined = editingFood?.id;

    if (editingFood) {
      await supabase.from("foods").update(data).eq("id", editingFood.id);
    } else {
      const { data: newFood, error: insertError } = await supabase
        .from("foods")
        .insert(data)
        .select("id")
        .single();
      if (insertError || !newFood) {
        alert("خطا در ذخیره غذا");
        return;
      }
      foodId = newFood.id;
    }

    // مدیریت تصاویر اضافی (بدون تغییر)
    if (foodId) {
  if (editingFood) {
    const currentImageIds = foodImages.filter(img => img.id).map(img => img.id);
    const { data: existingImages } = await supabase
      .from("food_images")
      .select("id")
      .eq("food_id", foodId);
    const existingIds = existingImages?.map(img => img.id) || [];
    const idsToDelete = existingIds.filter(id => !currentImageIds.includes(id));
    if (idsToDelete.length > 0) {
      await supabase.from("food_images").delete().in("id", idsToDelete);
    }
  }

  const newImages = foodImages
    .filter(img => !img.id)
    .map((img, index) => ({
      food_id: foodId!,
      image_url: img.image_url,
      sort_order: index,
    }));

  if (newImages.length > 0) {
    await supabase.from("food_images").insert(newImages);
  }
}

    setSaveSuccess(true);

setTimeout(() => {
  setShowModal(false);
  setSaveSuccess(false);
  loadData();
}, 600);
  } finally {
    setIsSaving(false);
  }
}

async function handleSaveCategory() {
  if (!restaurant) return;
  setIsSaving(true);
  setSaveSuccess(false);
  try {
    let imageUrl = categoryImageUrl;

    if (categoryImageFile) {
      setUploadingCategoryImage(true);
      const fileExt = categoryImageFile.name.split(".").pop();
      const fileName = `category-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("restaurant-images")
        .upload(`categories/${fileName}`, categoryImageFile, { cacheControl: "31536000", upsert: false });

      if (!uploadError && data) {
        const { data: urlData } = supabase.storage.from("restaurant-images").getPublicUrl(data.path);
        imageUrl = urlData.publicUrl;
      }
      setUploadingCategoryImage(false);
    }

    const data = {
      name: categoryName,
      restaurant_id: restaurant.id,
      sort_order: editingCategory ? editingCategory.sort_order : categories.length,
      image_url: imageUrl || null,
    };

    if (editingCategory) {
      await supabase.from("categories").update(data).eq("id", editingCategory.id);
    } else {
      await supabase.from("categories").insert(data);
    }

    setSaveSuccess(true);

setTimeout(() => {
  setShowModal(false);
  setSaveSuccess(false);
  loadData();
}, 600);
  } finally {
    setIsSaving(false);
  }
}

  async function handleDeleteFood(id: string) { if (confirm("آیا از حذف این غذا مطمئن هستید؟")) { await supabase.from("foods").delete().eq("id", id); loadData(); } }
  async function handleDeleteCategory(id: string) { if (confirm("با حذف این دسته، غذاهای داخل آن بدون دسته می‌شوند. ادامه می‌دهید؟")) { await supabase.from("categories").delete().eq("id", id); loadData(); } }

  async function handleRestLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.9,
  preserveTransparency: true, // اختیاری
});
    setRestLogoFile(compressed);
    setRestLogoPreview(URL.createObjectURL(compressed));
  }

  async function handleCategoryImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploadingCategoryImage(true);
  try {
    const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.9 });
    setCategoryImageFile(compressed);
    setCategoryImageUrl(URL.createObjectURL(compressed));
  } catch {
    alert("خطا در فشرده‌سازی تصویر");
  }
  setUploadingCategoryImage(false);
}

async function handleSaveRestaurant() {
  if (!restaurant) return;
  setIsSaving(true);
  setSaveSuccess(false);

  try {
    let logoUrl = restaurant.logo_url || "";
    if (restLogoFile) {
      setUploadingLogo(true);
      const fileExt = restLogoFile.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("restaurant-images")
        .upload(`logos/${fileName}`, restLogoFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("restaurant-images")
          .getPublicUrl(`logos/${fileName}`);
        logoUrl = urlData.publicUrl;
      }
      setUploadingLogo(false);
    }

    // به‌روزرسانی اطلاعات رستوران
    const { error: restaurantError } = await supabase
      .from("restaurants")
      .update({
        name: restName,
        description: restDesc,
        address: restAddress,
        working_hours: restWorkingHours,
        instagram: restInstagram,
        telegram: restTelegram,
        phone: restPhone,
        map_url: extractMapSrc(restMapUrl),
        logo_url: logoUrl,
        primary_color: primaryColor,
        bg_color: bgColor,
        text_color: textColor,
        accent_color: accentColor,
        font_family: fontFamily,
        surface_color: surfaceColor,
        template: template,
        slug: restSlug.trim() || null,
        working_hours_weekdays: workingHoursWeekdays,
        working_hours_thursday: workingHoursThursday,
        working_hours_friday: workingHoursFriday,
        waiter_code_enabled: waiterCodeEnabled,
waiter_code: waiterCode || null,
      })
      .eq("id", restaurant.id);

    if (restaurantError) {
      alert(`خطا در ذخیره اطلاعات رستوران: ${restaurantError.message}`);
      return;
    }

    // ذخیره اطلاعات About
    const aboutData = {
      restaurant_id: restaurant.id,
      enabled: true,
      title: restName,
      short_description: aboutShortDescription,
      story_title: aboutStoryTitle,
      story: aboutStory,
      cover_image: aboutCoverImage || null,
    };

    if (about?.id) {
      const { error: aboutError } = await supabase
        .from("restaurant_about")
        .update(aboutData)
        .eq("id", about.id);
      if (aboutError) {
        alert(`خطا در ذخیره درباره مجموعه: ${aboutError.message}`);
        return;
      }
    } else {
      const { error: aboutInsertError } = await supabase
        .from("restaurant_about")
        .insert(aboutData);
      if (aboutInsertError) {
        alert(`خطا در ذخیره درباره مجموعه: ${aboutInsertError.message}`);
        return;
      }
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
    loadData();
  } catch (err) {
    console.error("Save error:", err);
    alert("خطای غیرمنتظره رخ داد");
  } finally {
    setIsSaving(false);
  }
}

async function handleAboutCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;
  setAboutUploading(true);
  try {
    const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.8 });
    const fileExt = file.name.split(".").pop();
    const fileName = `about-cover-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error, data } = await supabase.storage
      .from("restaurant-images")
      .upload(`about/${fileName}`, compressed, { cacheControl: "31536000", upsert: false });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("restaurant-images").getPublicUrl(data.path);
      setAboutCoverImage(urlData.publicUrl);
    }
  } catch {
    alert("خطا در آپلود تصویر");
  }
  setAboutUploading(false);
}

  function handleResetToDefault() {
  const palette = colorPalettes.find(
    (p) => p.id === selectedPaletteId
  ) || colorPalettes[0];

  setPrimaryColor(palette.colors.primaryColor);
  setBgColor(palette.colors.bgColor);
  setTextColor(palette.colors.textColor);
  setAccentColor(palette.colors.accentColor);
  setSurfaceColor(palette.colors.surfaceColor);

  setFontFamily(defaultCustomization.fontFamily);
  setTemplate(defaultCustomization.template);
}

  function applyPalette(palette: (typeof colorPalettes)[number]) {
  setPrimaryColor(palette.colors.primaryColor);
  setBgColor(palette.colors.bgColor);
  setTextColor(palette.colors.textColor);
  setAccentColor(palette.colors.accentColor);
  setSurfaceColor(palette.colors.surfaceColor);
  setSelectedPaletteId(palette.id);
}

  async function handleAcknowledgeCall(callId: string) {
    await supabase.from("waiter_calls").update({ status: "acknowledged" }).eq("id", callId);
    setWaiterCalls((prev) => prev.map((c) => (c.id === callId ? { ...c, status: "acknowledged" } : c)));
    setNewCallsCount((prev) => Math.max(0, prev - 1));
  }

  async function toggleWaiterCall() {
  if (!restaurant) return;

  const newValue = !waiterCallEnabled;
  setWaiterCallEnabled(newValue);

  const { error } = await supabase
    .from("restaurants")
    .update({ waiter_call_enabled: newValue })
    .eq("id", restaurant.id);

  if (error) {
    setWaiterCallEnabled(!newValue);
    alert("خطا در ذخیره تنظیمات");
  }
}

async function toggleWaiterCodeEnabled() {
  if (!restaurant) return;

  const newValue = !waiterCodeEnabled;
  setWaiterCodeEnabled(newValue);

  try {
    const { error } = await supabase
      .from("restaurants")
      .update({ waiter_code_enabled: newValue })
      .eq("id", restaurant.id);

    if (error) {
      setWaiterCodeEnabled(!newValue);
      alert("خطا در ذخیره تنظیمات");
    }
  } catch {
    setWaiterCodeEnabled(!newValue);
    alert("خطای غیرمنتظره");
  }
}

async function handleDeleteAllWaiterCalls() {
  if (!restaurant) return;

  if (!confirm("آیا از حذف تمام تاریخچه فراخوانی گارسون مطمئن هستید؟")) return;

  const { error } = await supabase
    .from("waiter_calls")
    .delete()
    .eq("restaurant_id", restaurant.id);

  if (!error) {
    setWaiterCalls([]);
    setNewCallsCount(0);
  } else {
    alert("خطا در حذف تاریخچه");
  }
}

  function toggleSelectFood(id: string) {
    setSelectedFoods((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  async function handleBulkUpdateAvailability(available: boolean) {
    if (selectedFoods.size === 0) return;
    await Promise.all(Array.from(selectedFoods).map((id) => supabase.from("foods").update({ is_available: available }).eq("id", id)));
    setFoods((prev) => prev.map((f) => (selectedFoods.has(f.id) ? { ...f, is_available: available } : f)));
    setSelectedFoods(new Set()); setIsBulkMode(false);
  }

  async function handleBulkDelete() {
    if (selectedFoods.size === 0) return;
    if (!confirm(`آیا از حذف ${selectedFoods.size} غذا مطمئن هستید؟`)) return;
    await Promise.all(Array.from(selectedFoods).map((id) => supabase.from("foods").delete().eq("id", id)));
    setFoods((prev) => prev.filter((f) => !selectedFoods.has(f.id)));
    setSelectedFoods(new Set()); setIsBulkMode(false);
  }

  async function handleSaveWaiterCode() {
  if (!restaurant) return;

  if (!/^\d{4}$/.test(waiterCode)) {
    alert("کد تأیید باید دقیقاً ۴ رقم باشد.");
    return;
  }

  setIsSaving(true);
  setSaveSuccess(false);

  try {
    const { error } = await supabase
      .from("restaurants")
      .update({
        waiter_code_enabled: waiterCodeEnabled,
        waiter_code: waiterCode,
      })
      .eq("id", restaurant.id);

    if (error) {
      alert("خطا در ذخیره کد تأیید");
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
    setWaiterCodeFormVisible(false);
    loadData();
  } finally {
    setIsSaving(false);
  }
}

  async function handleFoodDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = foods.findIndex((f) => f.id === active.id);
    const newIndex = foods.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newFoods = arrayMove(foods, oldIndex, newIndex).map((food, index) => ({ ...food, sort_order: index }));
    setFoods(newFoods);
    await Promise.all(newFoods.map((f, i) => supabase.from("foods").update({ sort_order: i }).eq("id", f.id)));
  }

  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newCategories = arrayMove(categories, oldIndex, newIndex).map((cat, index) => ({ ...cat, sort_order: index }));
    setCategories(newCategories);
    await Promise.all(newCategories.map((c, i) => supabase.from("categories").update({ sort_order: i }).eq("id", c.id)));
  }

  const adminFilteredFoods = foods
  .filter((food) => {
    if (adminSelectedCategory && food.category_id !== adminSelectedCategory) return false;

    if (foodSearch.trim()) {
      const q = foodSearch.trim().toLowerCase();
      return (
        food.name.toLowerCase().includes(q) ||
        (food.description || "").toLowerCase().includes(q)
      );
    }

    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col lg:flex-row">
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 bg-white border-l border-luxury-border h-screen sticky top-0 p-8">
        <div className="mb-12 flex justify-center"><span className="text-2xl font-extralight tracking-widest text-luxury-accent">Serviro</span></div>
        <nav className="space-y-1 flex-1">
          <button onClick={() => { setActiveTab("foods"); setSidebarOpen(false); }} className={`block w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "foods" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>غذاها</button>
          <button onClick={() => { setActiveTab("categories"); setSidebarOpen(false); }} className={`block w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "categories" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>دسته‌بندی‌ها</button>
          <button onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} className={`block w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "settings" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>تنظیمات</button>
          <button onClick={() => { setActiveTab("qrcodes"); setSidebarOpen(false); }} className={`block w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "qrcodes" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>کیوآر کدها</button>
          <button onClick={() => { setActiveTab("waiter"); setSidebarOpen(false); }} className={`flex items-center justify-between w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "waiter" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>
            <span>گارسون</span>
            {newCallsCount > 0 && <span className="bg-red-500 text-white text-[9px] leading-none w-4 h-4 rounded-full flex items-center justify-center">{newCallsCount}</span>}
          </button>
          <button onClick={() => { setActiveTab("customize"); setSidebarOpen(false); }} className={`block w-full text-right px-3 py-2 text-sm font-light transition-colors duration-500 border-r-2 ${activeTab === "customize" ? "border-luxury-accent text-luxury-text" : "border-transparent text-luxury-muted hover:text-luxury-text"}`}>شخصی‌سازی</button>
        </nav>
        <div className="text-xs text-luxury-muted/60 border-t border-luxury-border pt-4 mt-4 text-center">طراحی شده توسط Serviro</div>
        <button onClick={handleLogout} className="mt-4 w-full text-center text-xs text-luxury-muted hover:text-luxury-text transition-colors">خروج</button>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="absolute top-0 right-0 h-full w-64 bg-white shadow-2xl p-8 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="mb-12 flex justify-center"><span className="text-2xl font-extralight tracking-widest text-luxury-accent">Serviro</span></div>
              <nav className="space-y-1 flex-1">
  <button
    onClick={() => { setActiveTab("foods"); setSidebarOpen(false); }}
    className={`block w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "foods" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    غذاها
  </button>

  <button
    onClick={() => { setActiveTab("categories"); setSidebarOpen(false); }}
    className={`block w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "categories" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    دسته‌بندی‌ها
  </button>

  <button
    onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
    className={`block w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "settings" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    تنظیمات
  </button>

  <button
    onClick={() => { setActiveTab("qrcodes"); setSidebarOpen(false); }}
    className={`block w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "qrcodes" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    کیوآر کدها
  </button>

  <button
    onClick={() => { setActiveTab("waiter"); setSidebarOpen(false); }}
    className={`flex items-center justify-between w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "waiter" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    <span>گارسون</span>
    {newCallsCount > 0 && (
      <span className="bg-red-500 text-white text-[9px] leading-none w-4 h-4 rounded-full flex items-center justify-center">
        {newCallsCount}
      </span>
    )}
  </button>

  <button
    onClick={() => { setActiveTab("customize"); setSidebarOpen(false); }}
    className={`block w-full text-right px-3 py-2 text-sm font-light ${
      activeTab === "customize" ? "text-luxury-text" : "text-luxury-muted"
    }`}
  >
    شخصی‌سازی
  </button>
</nav>
              <div className="text-xs text-luxury-muted/60 border-t border-luxury-border pt-4 mt-4 text-center">طراحی شده توسط Serviro</div>
              <button onClick={handleLogout} className="mt-4 w-full text-center text-xs text-luxury-muted hover:text-luxury-text transition-colors">خروج</button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:pr-0 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-luxury-bg/90 backdrop-blur-sm sticky top-0 z-30 border-b border-luxury-border">
          <button onClick={() => setSidebarOpen(true)} className="text-luxury-text"><HiMenuAlt2 className="text-xl" /></button>
          <span className="text-lg font-light tracking-widest text-luxury-accent">Serviro</span>
          <div className="w-6" />
        </div>

        <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {activeTab === "foods" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
  <div className="bg-white rounded-xl luxury-shadow p-4 text-center">
    <p className="text-2xl font-light text-luxury-accent">{foods.length}</p>
    <p className="text-xs text-luxury-muted mt-1">کل غذاها</p>
  </div>
  <div className="bg-white rounded-xl luxury-shadow p-4 text-center">
    <p className="text-2xl font-light text-green-500">{foods.filter(f => f.is_available).length}</p>
    <p className="text-xs text-luxury-muted mt-1">فعال</p>
  </div>
  <div className="bg-white rounded-xl luxury-shadow p-4 text-center">
    <p className="text-2xl font-light text-red-500">{foods.filter(f => !f.is_available).length}</p>
    <p className="text-xs text-luxury-muted mt-1">غیرفعال</p>
  </div>
</div>
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <button onClick={() => openFoodModal()} className="h-11 px-5 bg-luxury-accent text-white rounded-xl flex items-center gap-2 shadow-sm hover:bg-luxury-accent-dark transition-colors text-sm font-light">
                      <HiPlus /> افزودن غذا
                    </button>
                    <button
                      onClick={() => { setIsBulkMode(!isBulkMode); setSelectedFoods(new Set()); }}
                      className={`h-11 px-5 rounded-xl text-sm font-light flex items-center gap-2 transition-colors ${
                        isBulkMode ? "bg-luxury-accent text-white" : "bg-white border border-luxury-border text-luxury-muted hover:bg-gray-50"
                      }`}
                    >
                      <HiSelector className="text-lg" />
                      {isBulkMode ? "خروج از انتخاب" : "انتخاب گروهی"}
                    </button>
                    {isBulkMode && selectedFoods.size > 0 && (
                      <>
                        <button onClick={() => handleBulkUpdateAvailability(true)} className="h-11 px-5 bg-green-500 text-white rounded-xl text-sm font-light hover:bg-green-600 transition-colors">فعال‌سازی</button>
                        <button onClick={() => handleBulkUpdateAvailability(false)} className="h-11 px-5 bg-red-500 text-white rounded-xl text-sm font-light hover:bg-red-600 transition-colors">غیرفعال‌سازی</button>
                        <button onClick={handleBulkDelete} className="h-11 px-5 bg-red-700 text-white rounded-xl text-sm font-light hover:bg-red-800 transition-colors">حذف</button>
                        <span className="text-xs text-luxury-muted mr-2">{selectedFoods.size} انتخاب شده</span>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
  <div className="relative w-full">
    <input
      type="text"
      placeholder="جستجوی غذا..."
      value={foodSearch}
      onChange={(e) => setFoodSearch(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
    />
  </div>
</div>

                  <div className="mb-6 overflow-x-auto pb-2">
                    <div className="flex gap-2">
                      <button onClick={() => setAdminSelectedCategory(null)} className={`px-4 py-2 rounded-xl text-sm font-light whitespace-nowrap transition-all ${adminSelectedCategory === null ? "bg-luxury-accent text-white shadow-md" : "bg-white text-luxury-muted shadow-sm hover:shadow-md"}`}>همه</button>
                      {categories.map((cat) => <button key={cat.id} onClick={() => setAdminSelectedCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-light whitespace-nowrap transition-all ${adminSelectedCategory === cat.id ? "bg-luxury-accent text-white shadow-md" : "bg-white text-luxury-muted shadow-sm hover:shadow-md"}`}>{cat.name}</button>)}
                    </div>
                  </div>

                  {adminFilteredFoods.length === 0 ? (
                    adminSelectedCategory ? <EmptySearch query={categories.find(c => c.id === adminSelectedCategory)?.name} /> : <EmptyFoods />
                  ) : (
                    <FoodsList
  foods={adminFilteredFoods}
  selectedFoods={selectedFoods}
  isBulkMode={isBulkMode}
  onToggleSelect={toggleSelectFood}
  onEdit={openFoodModal}
  onDelete={handleDeleteFood}
  onReorder={handleFoodDragEnd}
/>
                  )}
                </div>
              )}

              {activeTab === "categories" && (
                <div>
                  <button onClick={() => openCategoryModal()} className="h-11 px-5 bg-luxury-accent text-white rounded-xl flex items-center gap-2 shadow-sm hover:bg-luxury-accent-dark transition-colors text-sm font-light mb-6"><HiPlus /> افزودن دسته‌بندی</button>
                  {categories.length === 0 ? <EmptyCategories /> : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
                      <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {categories.map((cat) => <CategoryRow
  key={cat.id}
  category={cat}
  onEdit={() => openCategoryModal(cat)}
  onDelete={() => handleDeleteCategory(cat.id)}
/>)}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
  <div className="bg-white rounded-xl luxury-shadow p-6 w-full">
    <h2 className="text-xl font-light text-luxury-text mb-6">تنظیمات</h2>

    <div className="space-y-6">
      {/* ردیف اول: نام رستوران + شناسه منو */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">نام رستوران</label>
          <input
            value={restName}
            onChange={(e) => setRestName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">شناسه منو</label>
          <input
            dir="ltr"
            value={restSlug}
            onChange={(e) => setRestSlug(e.target.value)}
            placeholder="cafe-naderi"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>
      </div>

      {/* توضیح کوتاه */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">توضیح کوتاه</label>
        <textarea
          value={aboutShortDescription}
          onChange={(e) => setAboutShortDescription(e.target.value)}
          rows={2}
          placeholder="قهوه، موسیقی و چند ساعت دور از شلوغی شهر."
          className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
        />
      </div>

      {/* ردیف دوم: اینستاگرام + تلگرام + تلفن */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">اینستاگرام</label>
          <input
            value={restInstagram}
            onChange={(e) => setRestInstagram(e.target.value)}
            placeholder="@yourcafe"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">تلگرام</label>
          <input
            value={restTelegram}
            onChange={(e) => setRestTelegram(e.target.value)}
            placeholder="@yourcafe"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">تلفن</label>
          <input
            value={restPhone}
            onChange={(e) => setRestPhone(e.target.value)}
            placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>
      </div>

      {/* ردیف سوم: ساعت‌های کاری */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">شنبه تا چهارشنبه</label>
          <input
            value={workingHoursWeekdays}
            onChange={(e) => setWorkingHoursWeekdays(e.target.value)}
            placeholder="08:00 - 24:00"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">پنجشنبه</label>
          <input
            value={workingHoursThursday}
            onChange={(e) => setWorkingHoursThursday(e.target.value)}
            placeholder="08:00 - 24:00"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-luxury-text mb-1">جمعه</label>
          <input
            value={workingHoursFriday}
            onChange={(e) => setWorkingHoursFriday(e.target.value)}
            placeholder="08:00 - 24:00"
            className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
          />
        </div>
      </div>

      {/* آدرس */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">آدرس</label>
        <input
          value={restAddress}
          onChange={(e) => setRestAddress(e.target.value)}
          placeholder="تهران، خیابان ولیعصر..."
          className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
        />
      </div>

      {/* لینک نقشه */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">لینک نقشه</label>
        <input
          value={restMapUrl}
          onChange={(e) => setRestMapUrl(e.target.value)}
          placeholder="https://www.google.com/maps/embed?..."
          className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
        />
      </div>

      {/* لوگو */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">لوگو</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-white overflow-hidden flex-shrink-0">
            {restLogoPreview ? (
              <img src={restLogoPreview} alt="" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-luxury-muted/30 bg-white">
                🏪
              </div>
            )}
          </div>
          <div className="flex-1">
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleRestLogoSelect} />
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              className="w-full py-2 px-4 border border-luxury-border rounded-lg text-sm font-light flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <HiUpload />
              {uploadingLogo ? "در حال آپلود..." : "انتخاب عکس"}
            </button>
          </div>
        </div>
      </div>

      {/* تصویر اصلی (کاور) */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">تصویر اصلی (کاور)</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-white overflow-hidden flex-shrink-0">
            {aboutCoverImage ? (
              <img src={aboutCoverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-luxury-muted/30 bg-white">
                🖼️
              </div>
            )}
          </div>
          <div className="flex-1">
            <input ref={aboutCoverInputRef} type="file" accept="image/*" className="hidden" onChange={handleAboutCoverSelect} />
            <button
              onClick={() => aboutCoverInputRef.current?.click()}
              disabled={aboutUploading}
              className="w-full py-2 px-4 border border-luxury-border rounded-lg text-sm font-light flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <HiUpload />
              {aboutUploading ? "در حال آپلود..." : "انتخاب تصویر"}
            </button>
          </div>
        </div>
      </div>

      {/* ویژگی‌ها */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-2">ویژگی‌های مجموعه</label>
        <div className="space-y-2">
          {aboutFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <span className="text-sm font-light text-luxury-text">{feature.title}</span>
              <button
                onClick={async () => {
                  await supabase.from("restaurant_about_features").delete().eq("id", feature.id);
                  setAboutFeatures(prev => prev.filter(f => f.id !== feature.id));
                }}
                className="text-red-500 hover:text-red-700"
              >
                <HiTrash className="text-sm" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const title = prompt("عنوان ویژگی جدید:");
              if (title && title.trim() && restaurant) {
                supabase.from("restaurant_about_features")
                  .insert({
                    restaurant_id: restaurant.id,
                    title: title.trim(),
                    sort_order: aboutFeatures.length,
                    is_active: true,
                  })
                  .select()
                  .single()
                  .then(({ data }) => {
                    if (data) setAboutFeatures(prev => [...prev, data]);
                  });
              }
            }}
            className="w-full py-2 border border-dashed border-luxury-border rounded-xl text-sm font-light text-luxury-muted hover:bg-gray-50 transition-colors"
          >
            + افزودن ویژگی
          </button>
        </div>
      </div>

      {/* گالری */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-2">گالری تصاویر</label>
        <div className="flex flex-wrap gap-3">
          {aboutImages.map((img) => (
            <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-luxury-border">
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={async () => {
                  await supabase.from("restaurant_about_images").delete().eq("id", img.id);
                  setAboutImages(prev => prev.filter(i => i.id !== img.id));
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center"
              >
                <HiX className="text-[10px]" />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-lg border border-dashed border-luxury-border flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <HiPlus className="text-luxury-muted" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || !restaurant) return;
                for (const file of Array.from(files)) {
                  try {
                    const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
                    const fileExt = file.name.split(".").pop();
                    const fileName = `about-gallery-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const { error, data } = await supabase.storage
                      .from("restaurant-images")
                      .upload(`about-gallery/${fileName}`, compressed, { cacheControl: "31536000", upsert: false });
                    if (!error && data) {
                      const { data: urlData } = supabase.storage.from("restaurant-images").getPublicUrl(data.path);
                      const newImg = {
                        restaurant_id: restaurant.id,
                        image_url: urlData.publicUrl,
                        sort_order: aboutImages.length,
                      };
                      const { data: inserted } = await supabase
                        .from("restaurant_about_images")
                        .insert(newImg)
                        .select()
                        .single();
                      if (inserted) setAboutImages(prev => [...prev, inserted]);
                    }
                  } catch {}
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <div className="mt-8">
        <button
          onClick={handleSaveRestaurant}
          disabled={isSaving}
          className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
        >
          {isSaving ? "در حال ذخیره..." : saveSuccess ? "ذخیره شد ✓" : "ذخیره همه تغییرات"}
        </button>
      </div>
    </div>
  </div>
)}

              {activeTab === "qrcodes" && (
  <div className="bg-white rounded-xl luxury-shadow p-6 w-full">
    <h2 className="text-xl font-light text-luxury-text mb-6">مدیریت QR Code میزها</h2>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-light text-luxury-text mb-1">شماره میز</label>
        <input
          type="number"
          value={qrTable}
          onChange={(e) => setQrTable(e.target.value)}
          placeholder="مثلاً ۵"
          className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
        />
      </div>

      <button
        onClick={() => {
          if (qrTable.trim() && restaurant) {
            const baseUrl = restSlug.trim()
              ? `https://${encodeURIComponent(restSlug.trim())}.serviro.ir?table=${qrTable}`
              : window.location.origin + "/menu?table=" + qrTable + "&r=" + restaurant.id;

            setQrValue(baseUrl);
          }
        }}
        className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors"
      >
        تولید QR Code
      </button>

      {qrValue && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <div ref={qrRef} className="p-4 bg-white rounded-xl inline-block">
            <QRCodeCanvas value={qrValue} size={200} level="M" includeMargin />
          </div>
          <p className="text-xs text-luxury-muted text-center break-all">{qrValue}</p>
          <button
            onClick={() => {
              const canvas = qrRef.current?.querySelector("canvas");
              if (canvas) {
                const link = document.createElement("a");
                link.download = `table-${qrTable}-qr.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
              }
            }}
            className="px-6 py-2 border border-luxury-border rounded-lg text-sm font-light hover:bg-gray-50 transition-colors"
          >
            دانلود PNG
          </button>
        </div>
      )}
    </div>
  </div>
)}

              {activeTab === "waiter" && (
  <div>
    {/* فعال/غیرفعال بودن دکمهٔ گارسون */}
    <div className="mb-6 bg-white rounded-xl luxury-shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-light text-luxury-text">
            فعال بودن دکمهٔ گارسون
          </p>
          <p className="text-xs text-luxury-muted mt-1">
            {waiterCallEnabled
              ? "مشتری می‌تواند گارسون را فراخوانی کند"
              : "فراخوانی گارسون غیرفعال است"}
          </p>
        </div>

        <button
          onClick={toggleWaiterCall}
          className={`relative h-7 w-14 rounded-full transition-colors ${
            waiterCallEnabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
              waiterCallEnabled ? "left-1" : "left-8"
            }`}
          />
        </button>
      </div>
    </div>

    {/* کد تأیید گارسون — فقط وقتی گارسون فعال است */}
    {waiterCallEnabled && (
  <div className="mb-6 bg-white rounded-xl luxury-shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-light text-luxury-text">
        نیاز به کد تأیید برای گارسون
      </label>
      <button
  onClick={toggleWaiterCodeEnabled}
  className={`relative h-7 w-14 rounded-full transition-colors ${
    waiterCodeEnabled ? "bg-green-500" : "bg-gray-300"
  }`}
>
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            waiterCodeEnabled ? "left-1" : "left-8"
          }`}
        />
      </button>
    </div>

    {waiterCodeEnabled && waiterCodeFormVisible ? (
  <>
    <div className="mt-2">
      <input
        value={waiterCode}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          setWaiterCode(digits);
        }}
        dir="ltr"
        maxLength={4}
        placeholder="1234"
        className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
      />
      <p className="text-xs text-luxury-muted mt-1">
        این کد را روی تابلو یا کنار صندوق قرار دهید.
      </p>
    </div>

    <button
      onClick={handleSaveWaiterCode}
      disabled={isSaving}
      className="mt-4 w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
    >
      {isSaving ? "در حال ذخیره..." : saveSuccess ? "ذخیره شد ✓" : "ذخیره کد تأیید"}
    </button>
  </>
) : (
  <button
    type="button"
    onClick={() => setWaiterCodeFormVisible(true)}
    className="mt-3 w-full flex items-center justify-between rounded-xl border border-luxury-border p-3 text-right transition-colors hover:border-luxury-accent cursor-pointer"
  >
    <span className="text-sm font-light text-luxury-text">
      کد تنظیم شده: <span dir="ltr">{waiterCode}</span>
    </span>
    <span className="text-xs font-light text-luxury-accent">
      تغییر کد
    </span>
  </button>
)}
  </div>
)}

    {/* تیتر + دکمهٔ حذف همه */}
    <div className="flex items-center justify-between mb-4">
      {waiterCalls.length > 0 && (
        <button
          onClick={handleDeleteAllWaiterCalls}
          className="flex items-center gap-1 text-xs font-light text-red-500 hover:text-red-700 transition-colors"
        >
          <HiTrash className="text-sm" />
          حذف همه
        </button>
      )}
    </div>

    {waiterCalls.length === 0 ? (
      <EmptyWaiterCalls />
    ) : (
      <div className="space-y-3">
        {waiterCalls.map((call) => (
          <div
            key={call.id}
            className={`rounded-xl luxury-shadow p-4 flex items-center justify-between ${
              call.status === "acknowledged" ? "bg-gray-50 opacity-80" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  call.status === "new" ? "bg-red-500" : "bg-green-500"
                }`}
              />
              <span className="font-light text-luxury-text">
                میز {call.table_number}
              </span>
              <span className="text-xs text-luxury-muted">
                {formatWaiterTime(call.created_at)}
              </span>
            </div>

            {call.status === "new" && (
              <button
                onClick={() => handleAcknowledgeCall(call.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <HiCheck className="text-lg" />
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}

              {activeTab === "customize" && (
  <div className="bg-white rounded-xl luxury-shadow p-6 w-full">
    <h2 className="text-xl font-light text-luxury-text mb-6">شخصی‌سازی منو</h2>

    <div className="space-y-6">
      {/* پالت‌های آماده */}
      <div>
        <label className="block text-sm font-light text-luxury-text mb-3">
          پالت‌های آماده
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => applyPalette(palette)}
              className={`rounded-xl border bg-white p-3 text-right transition-all duration-200 hover:border-luxury-accent hover:shadow-sm ${
  selectedPaletteId === palette.id
    ? "border-luxury-accent ring-1 ring-luxury-accent"
    : "border-luxury-border"
}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border border-black/5"
                  style={{ backgroundColor: palette.colors.primaryColor }}
                />
                <span
                  className="h-4 w-4 rounded-full border border-black/5"
                  style={{ backgroundColor: palette.colors.bgColor }}
                />
                <span
                  className="h-4 w-4 rounded-full border border-black/5"
                  style={{ backgroundColor: palette.colors.accentColor }}
                />
                <span
                  className="h-4 w-4 rounded-full border border-black/5"
                  style={{ backgroundColor: palette.colors.surfaceColor }}
                />
              </div>
              <span className="text-xs font-light text-luxury-text">
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* تنظیمات دقیق‌تر رنگ‌ها */}
      <div className="border-t border-luxury-border pt-6">
        <p className="text-xs font-light text-luxury-muted mb-4">
          تنظیمات دقیق‌تر رنگ‌ها
        </p>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-luxury-text">رنگ اصلی</label>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-luxury-border">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-luxury-text">رنگ پس‌زمینه</label>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-luxury-border">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-luxury-text">رنگ متن</label>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-luxury-border">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: textColor }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-luxury-text">رنگ دکمه‌ها</label>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-luxury-border">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: accentColor }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-luxury-text">
              رنگ سطوح (سایدبار، کارت‌ها، دکمه‌ها)
            </label>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-luxury-border">
              <input
                type="color"
                value={surfaceColor}
                onChange={(e) => setSurfaceColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: surfaceColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* فونت */}
      <div>
  <label className="block text-sm font-light text-luxury-text mb-3">
    فونت
  </label>

  {/* کارت فونت انتخابی */}
  <button
    onClick={() => setFontModalOpen(true)}
    className="w-full rounded-xl border border-luxury-border bg-white p-4 text-right transition-all duration-200 hover:border-luxury-accent hover:shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <span
          className="block text-sm font-medium"
          style={{ fontFamily: fontFamily }}
        >
          {fontOptions.find((f) => f.value === fontFamily)?.label || fontFamily}
        </span>
        <span
          className="mt-1 block text-xs text-luxury-muted"
          style={{ fontFamily: fontFamily }}
        >
          {fontOptions.find((f) => f.value === fontFamily)?.preview ||
            "متن نمونه"}
        </span>
      </div>
      <span className="text-xs text-luxury-accent">تغییر</span>
    </div>
  </button>
</div>

      {/* قالب */}
      <div>
  <label className="block text-sm font-light text-luxury-text mb-3">
    قالب منو
  </label>

  {/* کارت قالب انتخابی */}
  <button
    onClick={() => setTemplateModalOpen(true)}
    className="w-full rounded-xl border border-luxury-border bg-white p-4 text-right transition-all duration-200 hover:border-luxury-accent hover:shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <span className="block text-sm font-medium text-luxury-text">
          {templateOptions.find((t) => t.value === template)?.label || template}
        </span>
        <span className="mt-1 block text-xs text-luxury-muted font-light">
          {templateOptions.find((t) => t.value === template)?.description ||
            "انتخاب قالب"}
        </span>
      </div>
      <span className="text-xs text-luxury-accent">تغییر</span>
    </div>
  </button>
</div>

      {/* دکمه‌ها */}
      <div className="pt-2 space-y-3">
        <button
          onClick={handleResetToDefault}
          className="w-full py-2.5 border border-luxury-border text-luxury-muted rounded-xl font-light hover:bg-gray-50 transition-colors"
        >
          بازنشانی به پیش‌فرض
        </button>

        <button
          onClick={handleSaveRestaurant}
          disabled={isSaving}
          className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
        >
          {isSaving ? "در حال ذخیره..." : saveSuccess ? "ذخیره شد ✓" : "ذخیره"}
        </button>
      </div>
    </div>
  </div>
)}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* مودال افزودن/ویرایش غذا و دسته‌بندی */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center" onClick={() => setShowModal(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white w-full lg:max-w-md lg:rounded-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-luxury-border"><h3 className="font-light text-lg text-luxury-text">{modalType === "food" ? (editingFood ? "ویرایش غذا" : "افزودن غذا") : (editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی")}</h3><button onClick={() => setShowModal(false)} className="text-luxury-muted hover:text-luxury-text transition-colors"><HiX className="text-xl" /></button></div>
              <div className="p-6 space-y-4">
                {modalType === "food" ? (
                  <>
                    <div><label className="block text-sm font-light text-luxury-text mb-1">نام غذا</label><input value={foodName} onChange={(e) => setFoodName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors" placeholder="مثلاً: پاستا آلفردو" /></div>
                    <div><label className="block text-sm font-light text-luxury-text mb-1">توضیحات</label><textarea value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors" /></div>
                    <div><label className="block text-sm font-light text-luxury-text mb-1">قیمت (تومان)</label><input type="number" value={foodPrice} onChange={(e) => setFoodPrice(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors" /></div>
                    <div><label className="block text-sm font-light text-luxury-text mb-1">دسته‌بندی</label><select value={foodCategory} onChange={(e) => setFoodCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors bg-white"><option value="">بدون دسته</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                    <div>
                      <label className="block text-sm font-light text-luxury-text mb-1">تصویر اصلی</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-white overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-luxury-muted/30 bg-white">
                              {uploading ? <span className="w-5 h-5 border-2 border-luxury-accent border-t-transparent rounded-full animate-spin" /> : "🍽️"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full py-2 px-4 border border-luxury-border rounded-lg text-sm font-light flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <HiUpload /> {uploading ? "در حال آپلود..." : "انتخاب عکس"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* بخش تصاویر اضافی */}
                    <div>
                      <label className="block text-sm font-light text-luxury-text mb-1">تصاویر بیشتر</label>
                      <div className="flex flex-wrap gap-3">
                        {foodImages.map((img, index) => (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-luxury-border">
  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
  <button
    onClick={() => setFoodImages(prev => prev.filter((_, i) => i !== index))}
    className="absolute top-1 right-1 w-5 h-5 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all duration-200"
  >
    <HiX className="text-[10px]" />
  </button>
</div>
                        ))}
                        <label className="w-20 h-20 rounded-lg border border-dashed border-luxury-border flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <HiPlus className="text-luxury-muted" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleAddImages(e.target.files)}
                          />
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={foodAvailable} onChange={(e) => setFoodAvailable(e.target.checked)} className="w-5 h-5 accent-luxury-accent" /><span className="text-sm font-light text-luxury-text">غذا فعال باشد</span></label>
                    <button
  onClick={handleSaveFood}
  disabled={uploading || isSaving}
  className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
>
  {isSaving ? "در حال ذخیره..." : saveSuccess ? "ذخیره شد ✓" : "ذخیره"}
</button>
                  </>
                ) : (
                  <>
                    <div><label className="block text-sm font-light text-luxury-text mb-1">نام دسته‌بندی</label><input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors" placeholder="مثلاً: پیش‌غذا" /></div>
                    <div>
  <label className="block text-sm font-light text-luxury-text mb-1">
    تصویر دسته‌بندی
  </label>
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0">
      {categoryImageUrl ? (
        <img
          src={categoryImageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl text-luxury-muted/30 bg-white">
          🖼️
        </div>
      )}
    </div>
    <div className="flex-1">
      <input
        ref={categoryImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCategoryImageSelect}
      />
      <button
        onClick={() => categoryImageInputRef.current?.click()}
        disabled={uploadingCategoryImage}
        className="w-full py-2 px-4 border border-luxury-border rounded-lg text-sm font-light flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <HiUpload />
        {uploadingCategoryImage ? "در حال آپلود..." : "انتخاب عکس"}
      </button>
    </div>
  </div>
</div>
                    <button
  onClick={handleSaveCategory}
  disabled={isSaving}
  className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
>
  {isSaving ? "در حال ذخیره..." : saveSuccess ? "ذخیره شد ✓" : "ذخیره"}
</button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* مودال انتخاب فونت */}
<AnimatePresence>
  {fontModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={() => setFontModalOpen(false)}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-4 border-b border-luxury-border">
          <h3 className="font-light text-lg text-luxury-text">
            انتخاب فونت
          </h3>
          <button
            onClick={() => setFontModalOpen(false)}
            className="text-luxury-muted hover:text-luxury-text transition-colors"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* لیست فونت‌ها */}
        <div
  className="max-h-[60vh] overflow-y-auto p-4 space-y-2 font-scroll-container"
  style={{ overscrollBehavior: "contain" }}
>
          {fontOptions.length === 0 ? (
            <p className="text-center text-sm text-luxury-muted py-8">
              فونتی یافت نشد
            </p>
          ) : (
            fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  setFontFamily(font.value);
                  setFontModalOpen(false);
                }}
                className={`w-full rounded-xl border p-4 text-right transition-all duration-200 ${
                  fontFamily === font.value
                    ? "border-luxury-accent ring-1 ring-luxury-accent"
                    : "border-luxury-border hover:border-luxury-accent"
                }`}
              >
                <span
                  className="block text-sm font-medium"
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </span>
                <span
                  className="mt-1 block text-xs text-luxury-muted"
                  style={{ fontFamily: font.value }}
                >
                  {font.preview}
                </span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
{/* مودال انتخاب قالب */}
<AnimatePresence>
  {templateModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={() => setTemplateModalOpen(false)}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-4 border-b border-luxury-border">
          <h3 className="font-light text-lg text-luxury-text">
            انتخاب قالب
          </h3>
          <button
            onClick={() => setTemplateModalOpen(false)}
            className="text-luxury-muted hover:text-luxury-text transition-colors"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* لیست قالب‌ها */}
        <div
  className="max-h-[60vh] overflow-y-auto p-4 space-y-2 font-scroll-container"
  style={{ overscrollBehavior: "contain" }}
>
          {templateOptions.map((tpl) => (
            <button
              key={tpl.value}
              onClick={() => {
                setTemplate(tpl.value);
                setTemplateModalOpen(false);
              }}
              className={`w-full rounded-xl border p-4 text-right transition-all duration-200 ${
                template === tpl.value
                  ? "border-luxury-accent ring-1 ring-luxury-accent"
                  : "border-luxury-border hover:border-luxury-accent"
              }`}
            >
              <span className="block text-sm font-medium text-luxury-text">
                {tpl.label}
              </span>
              <span className="mt-1 block text-xs text-luxury-muted font-light leading-5">
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}