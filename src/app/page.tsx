"use client";
import InfiniteCarousel from "@/components/ui/infinite-carousel";
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
HiOutlineQrcode,
HiOutlineDeviceMobile,
HiOutlineTemplate,
HiOutlineShieldCheck,
HiOutlineSparkles,
HiOutlineChartBar,
HiOutlineUserGroup,
HiX,
HiOutlinePaperAirplane,
HiOutlineCamera,
HiOutlineChat,
HiOutlineChevronRight,
HiOutlineChevronLeft,
HiOutlineChevronDown,
HiStar,
} from "react-icons/hi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


const features = [
{
icon: HiOutlineQrcode,
title: "منوی QR هوشمند",
description:
"هر میز یک کد QR اختصاصی دارد",
},
{
icon: HiOutlineDeviceMobile,
title: "فراخوانی گارسون",
description:
"مشتری با یک کلیک گارسون را فرا می‌خواند",
},
{
icon: HiOutlineTemplate,
title: "پنل مدیریت ساده",
description:
"همه چیز را در یک پنل زیبا مدیریت کنید",
},
{
icon: HiOutlineSparkles,
title: "طراحی مینیمال",
description:
"تجربه‌ای به‌یادماندنی برای مشتریان خلق کنید",
},
];

const pricingPlans = [
{
duration: "ماهانه",
price: "۲۹۹",
period: "ماه",
features: [
"منوی QR نامحدود",
"فراخوانی گارسون",
"پنل مدیریت",
"سفارش‌گیری آنلاین (به‌زودی)",
"گزارش‌های فروش (به‌زودی)",
],
},
{
duration: "شش‌ماهه",
price: "۱,۴۹۹",
period: "۶ ماه",
features: [
"تمام امکانات ماهانه",
"۱۵٪ تخفیف نسبت به ماهانه",
"پشتیبانی سریع",
],
},
{
duration: "یکساله",
price: "۲,۶۹۹",
period: "سال",
features: [
"تمام امکانات ماهانه",
"۲۵٪ تخفیف نسبت به ماهانه",
"پشتیبانی اختصاصی",
"مدیریت چند شعبه (به‌زودی)",
],
},
];

const testimonials = [
{
name: "مریم مهدوی",
role: "مدیر کافه",
image: "/images/testimonial3.jpg", // ← مسیر عکس خودت را بگذار
text: "با Serviro دیگه نیازی به چاپ منو نیست. مشتری‌ها با اسکن QR سریع منو رو می‌بینن و گارسون رو صدا می‌زنن. واقعاً کارمون راحت شده.",
rating: 5,
},
{
name: "مهدی عباس زاده",
role: "رستوران‌دار",
image: "/images/testimonial3.jpg",
text: "طراحی منو فوق‌العاده شیک و مدرنه. پنل مدیریتش هم خیلی ساده‌ست. تونستم کل منو رو توی چند دقیقه آپلود کنم.",
rating: 5,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
{
name: "سیدحسین حسینی",
role: "فست‌فود",
image: "/images/testimonial3.jpg",
text: "سرعت بارگذاری منو عالیه و مشتری‌ها خیلی راضی هستن. امکان شخصی‌سازی رنگ و فونت هم عالیه، دقیقاً شبیه برند خودمون.",
rating: 4,
},
// برای بیشتر شدن، فقط آیتم‌های جدید اینجا اضافه کن
// { name: "...", role: "...", image: "...", text: "...", rating: 5 },
];

const fadeInUp = {
hidden: { opacity: 0, y: 30 },
visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
hidden: {},
visible: { transition: { staggerChildren: 0.1 } },
};

const adminScreenshots = [
{
id: "foods",
name: "مدیریت غذاها",
description: "افزودن، ویرایش و مرتب‌سازی غذاها با Drag & Drop",
image: "/screenshots/dashboard-foods.png",
},
{
id: "settings",
name: "تنظیمات رستوران",
description: "مدیریت اطلاعات، آدرس، شبکه‌های اجتماعی و لوگو",
image: "/screenshots/dashboard-settings.png",
},
{
id: "qr",
name: "مدیریت QR Code",
description: "ساخت و دانلود QR Code اختصاصی برای هر میز",
image: "/screenshots/dashboard-qr.png",
},
{
id: "waiter",
name: "فراخوانی گارسون",
description: "مشاهده و تأیید درخواست‌های زندهٔ گارسون",
image: "/screenshots/dashboard-waiter.png",
},
{
id: "categories",
name: "دسته‌بندی‌ها",
description: "مدیریت و مرتب‌سازی دسته‌بندی‌های منو",
image: "/screenshots/categories.png",
},
{
id: "customize",
name: "شخصی‌سازی",
description: "تغییر رنگ، فونت و ظاهر منو",
image: "/screenshots/customize.png",
},
];

const trustAvatars = [
"/images/avatar1.jpg",  // ← مسیر عکس‌های خودت رو بذار
"/images/avatar2.jpg",
"/images/avatar3.jpg",
"/images/avatar4.jpg",
];

const partnerLogos = [
"/logos/1.png",
"/logos/2.png",
"/logos/3.png",
"/logos/4.png",
"/logos/5.png",
"/logos/6.png",
"/logos/7.png",
];

const templateMockups: MockupItem[] = [
  { id: "t1", name: "طرح مدرن", image: "/mockups/default.png", description: "قالب مدرن و مینیمال" },
  { id: "t2", name: "کلاسیک نو", image: "/mockups/default.png", description: "ترکیب کلاسیک و امروزی" },
  { id: "t3", name: "تاریک و شیک", image: "/mockups/default.png", description: "پس‌زمینه تیره و لوکس" },
  { id: "t4", name: "طبیعت‌گرا", image: "/mockups/default.png", description: "رنگ‌های گرم و طبیعی" },
  { id: "t5", name: "الگانس", image: "/mockups/default.png", description: "ظرافت و سادگی" },
  { id: "t6", name: "پویا و بازیگوش", image: "/mockups/default.png", description: "رنگ‌های شاد و پرانرژی" },
  { id: "t7", name: "صنعتی", image: "/mockups/default.png", description: "سبک صنعتی و خشن" },
  { id: "t8", name: "هنری", image: "/mockups/default.png", description: "خلاقانه و هنری" },
  { id: "t9", name: "فشرده", image: "/mockups/default.png", description: "چیدمان فشرده و کاربردی" },
  { id: "t10", name: "آینده‌نگر", image: "/mockups/default.png", description: "طراحی آینده‌نگر" },
];

// ─── کامپوننت انیمیشن شمارش ─────────────────────────────────
function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
const [count, setCount] = useState(0);
const [hasStarted, setHasStarted] = useState(false);
const ref = useRef<HTMLSpanElement>(null);

useEffect(() => {
const observer = new IntersectionObserver(
([entry]) => {
if (entry.isIntersecting && !hasStarted) {
setHasStarted(true);
}
},
{ threshold: 0.5 }
);
if (ref.current) observer.observe(ref.current);
return () => observer.disconnect();
}, [hasStarted]);

useEffect(() => {
if (!hasStarted) return;
let startTime: number;
let animationFrame: number;

const step = (timestamp: number) => {
  if (!startTime) startTime = timestamp;
  const progress = Math.min((timestamp - startTime) / duration, 1);
  setCount(Math.floor(progress * end));
  if (progress < 1) {
    animationFrame = requestAnimationFrame(step);
  }
};

animationFrame = requestAnimationFrame(step);
return () => cancelAnimationFrame(animationFrame);

}, [hasStarted, end, duration]);

const formatted = count.toLocaleString("fa-IR");

return (
<span ref={ref} className="tabular-nums">
{formatted}
{suffix}
</span>
);
}

// بعد از import ها و قبل از PhoneMockupSlider
interface MockupItem {
  id: string;
  name: string;
  image: string;
  description?: string; // اگر بخواهی اختیاری باشد
}

export function PhoneMockupSlider({
templateMockups = [],
}: {
templateMockups: MockupItem[];
}) {
const sliderRef = useRef<HTMLDivElement>(null);

const total = templateMockups.length;
const CLONES = 3;
const realStartIndex = CLONES;

const isTeleporting = useRef(false);
const scrollTimer = useRef<NodeJS.Timeout | null>(null);

const [activeIndex, setActiveIndex] = useState(0);
const [activeExtIndex, setActiveExtIndex] = useState(realStartIndex);

const extendedItems = useMemo(() => {
if (!total) return [];

return [
  ...templateMockups
    .slice(-CLONES)
    .map((item, idx) => ({
      ...item,
      realIndex: total - CLONES + idx,
    })),

  ...templateMockups.map((item, idx) => ({
    ...item,
    realIndex: idx,
  })),

  ...templateMockups
    .slice(0, CLONES)
    .map((item, idx) => ({
      ...item,
      realIndex: idx,
    })),
];

}, [templateMockups, total]);

const scrollToExtendedIndex = useCallback(
(index: number, smooth = true) => {
const slider = sliderRef.current;
if (!slider) return;

  const item = slider.children[index] as HTMLElement;
  if (!item) return;

  const left =
    item.offsetLeft -
    (slider.clientWidth - item.clientWidth) / 2;

  slider.scrollTo({
    left,
    behavior: smooth ? "smooth" : "auto",
  });
},
[]

);

useEffect(() => {
if (!total) return;
setTimeout(() => {
scrollToExtendedIndex(realStartIndex, false);
}, 100);
}, [total, realStartIndex, scrollToExtendedIndex]);

const handleScroll = () => {
const slider = sliderRef.current;
if (!slider || isTeleporting.current) return;

if (scrollTimer.current) clearTimeout(scrollTimer.current);

scrollTimer.current = setTimeout(() => {
  const center = slider.scrollLeft + slider.clientWidth / 2;

  let closest = 0;
  let minDistance = Infinity;

  Array.from(slider.children).forEach((child, index) => {
    const el = child as HTMLElement;
    const elCenter = el.offsetLeft + el.clientWidth / 2;
    const distance = Math.abs(center - elCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  const item = extendedItems[closest];
  if (!item) return;

  setActiveIndex(item.realIndex);
  setActiveExtIndex(closest);

  // teleport
  if (
    closest < CLONES ||
    closest >= realStartIndex + total
  ) {
    const target =
      closest < CLONES
        ? closest + total
        : closest - total;

    isTeleporting.current = true;

    requestAnimationFrame(() => {
      scrollToExtendedIndex(target, false);
      setActiveExtIndex(target);

      setTimeout(() => {
        isTeleporting.current = false;
      }, 80);
    });
  }
}, 80);

};

useEffect(() => {
if (!total) return;

const timer = setInterval(() => {
  setActiveExtIndex((prev) => {
    const next = prev + 1;
    scrollToExtendedIndex(next, true);
    return next;
  });
}, 6000);

return () => clearInterval(timer);

}, [total, scrollToExtendedIndex]);

if (!total) return null;

return (
<div className="relative overflow-hidden py-4">
<div
className="overflow-hidden"
style={{
maskImage:
"linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
WebkitMaskImage:
"linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
}}
>
<div
ref={sliderRef}
onScroll={handleScroll}
className="
flex
overflow-x-auto
snap-x
snap-mandatory
scrollbar-hide
gap-4
md
px-[calc(50%-110px)]
md:px-[calc(50%-130px)]
"
style={{ WebkitOverflowScrolling: "touch" }}
>
{extendedItems.map((mockup, index) => {
const isActive = index === activeExtIndex;

        return (
          <div
            key={index}
            className={`
              snap-center
              flex-shrink-0
              flex
              flex-col
              items-center
              transition-all
              duration-2000
              ease-out

              ${
                isActive
                  ? "scale-100 opacity-100 z-10"
                  : "scale-[0.82] opacity-50"
              }

              w-[240px]
              md:w-[260px]
              max-w-[70vw]
              md:max-w-none
            `}
          >
            <div className="relative w-full aspect-[9/19] overflow-visible">
  <img
    src={mockup.image}
    alt={mockup.name}
    className="w-full h-full object-contain"
  />
</div>

            <div className="mt-9 text-center">
              <h3 className="text-sm md:text-lg font-light text-luxury-text">
                {mockup.name}
              </h3>
              <p className="text-xs text-luxury-muted mt-1 hidden md:block">
                {mockup.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

);
}

function LogoMarquee() {
const logos = [...partnerLogos, ...partnerLogos];

return (
<section className="w-full overflow-hidden py-8 md:py-10">
<div className="mx-auto flex w-full flex-col items-center gap-6 md:gap-8">

    {/* Marquee */}
    <div
      className="relative w-full overflow-hidden"
      dir="ltr"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max items-center"
        style={{
          animation: "marqueeLoop 28s linear infinite",
        }}
      >
        {logos.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="
              flex
              h-8
              md:h-10
              shrink-0
              items-center
              justify-center
              pr-12
              md:pr-16
            "
          >
            <img
              src={logo}
              alt={`همکار ${index + 1}`}
              draggable={false}
              className="
                h-full
                w-auto
                max-w-[120px]
                md:max-w-[150px]
                object-contain
                select-none
                grayscale
                opacity-45
                transition-all
                duration-500
                hover:grayscale-0
                hover:opacity-100
              "
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

);
}

function PricingSlider() {
const sliderRef = useRef<HTMLDivElement>(null);
const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

const total = pricingPlans.length;

const [activeIndex, setActiveIndex] = useState(0);

const extendedPlans = [
...pricingPlans,
...pricingPlans,
...pricingPlans,
];

const scrollToCard = (
index: number,
smooth = true
) => {

const slider = sliderRef.current;

if (!slider) return;


const card =
  slider.children[index] as HTMLElement;


if (!card) return;


const left =
  card.offsetLeft -
  slider.clientWidth / 2 +
  card.clientWidth / 2;


slider.scrollTo({
  left,
  behavior: smooth ? "smooth" : "auto",
});

};



// شروع از کپی وسط
useEffect(() => {

setTimeout(() => {

  scrollToCard(total, false);

},100);

},[]);



// Auto Play
useEffect(() => {

autoPlayRef.current =
  setInterval(() => {


    setActiveIndex(prev => {


      const next =
        (prev + 1) % total;


      scrollToCard(
        total + next
      );


      return next;


    });


  },4000);



return () => {

  if(autoPlayRef.current)
    clearInterval(autoPlayRef.current);

};

},[]);



// تشخیص کارت فعال
const handleScroll = () => {

const slider =
  sliderRef.current;


if(!slider)
  return;



const center =
  slider.scrollLeft +
  slider.clientWidth / 2;



let closest = 0;

let minDistance =
  Infinity;



Array.from(slider.children)
  .forEach((item,index)=>{


    const card =
      item as HTMLElement;



    const cardCenter =
      card.offsetLeft +
      card.clientWidth / 2;



    const distance =
      Math.abs(
        center - cardCenter
      );



    if(distance < minDistance){

      minDistance =
        distance;

      closest =
        index;

    }


  });



const realIndex =
  closest % total;



setActiveIndex(realIndex);



// پرش هوشمند برای لوپ
if(
  closest < total ||
  closest >= total * 2
){

  setTimeout(()=>{

    scrollToCard(
      total + realIndex,
      false
    );


  },50);

}

};



return (

<div className="
  relative
  overflow-hidden
  py-4
">


  <div

    ref={sliderRef}

    onScroll={handleScroll}


    className="
      flex
      overflow-x-auto
      snap-x
      snap-mandatory
      scrollbar-hide
      gap-4
      scroll-smooth
      px-[calc(50%-160px)]
    "


    style={{
      WebkitOverflowScrolling:
      "touch"
    }}

  >


    {
      extendedPlans.map(
        (plan,index)=>{


        const realIndex =
          index % total;



        const isActive =
          realIndex === activeIndex;




        return (

          <div

            key={index}

            className={`
              
              snap-center
              flex-shrink-0

              w-[320px]

              rounded-3xl

              p-8

              text-center


              backdrop-blur-md

              border
              border-white/60


              shadow-xl


              transition-all
              duration-500
              ease-out


              ${
                isActive

                ?

                `
                bg-white/90
                scale-100
                opacity-100
                z-10
                `

                :

                `
                bg-white/40
                scale-[0.94]
                opacity-50
                `
              }

            `}

          >



            <p className="
              text-xs
              font-light
              uppercase
              tracking-widest
              mb-3
              text-luxury-muted
            ">
              {plan.duration}
            </p>



            <p className="
              text-5xl
              font-light
              mb-4
              text-luxury-accent
            ">

              {plan.price}

              <span className="
                text-xl
                font-light
                text-luxury-muted
              ">
                /{plan.period}
              </span>

            </p>




            <ul className="
              text-sm
              space-y-3
              mb-8
              font-light
              text-luxury-muted
            ">

              {
                plan.features.map(
                  (feature,i)=>(

                  <li key={i}>
                    ✓ {feature}
                  </li>

                ))
              }


            </ul>




            <a

              href="#contact"

              className="
                inline-block
                w-full
                py-3
                rounded-full
                text-lg
                font-light

                bg-luxury-accent
                text-white

                hover:bg-luxury-accent-dark

                transition-colors
              "

            >

              تماس با ما

            </a>



          </div>

        );


      })

    }



  </div>




  {/* Dots */}

  <div className="
    flex
    justify-center
    gap-2
    mt-5
  ">


    {
      pricingPlans.map(
        (_,index)=>(


        <button

          key={index}

          onClick={()=>{

            setActiveIndex(index);

            scrollToCard(
              total + index
            );

          }}


          className={`
            
            h-2

            rounded-full

            transition-all
            duration-300


            ${
              index === activeIndex

              ?

              `
              w-6
              bg-luxury-accent
              `

              :

              `
              w-2
              bg-luxury-muted/30
              `
            }

          `}


        />


      ))
    }


  </div>



</div>

);
}

function TemplateCarousel({ items }: { items: typeof templateMockups }) {
const [centerIndex, setCenterIndex] = useState(0);
const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
const touchStartX = useRef(0);
const touchEndX = useRef(0);

const total = items.length;

// محاسبه ایندکس‌های قبلی و بعدی (حلقه‌ای)
const getPrevIndex = (index: number) => (index - 1 + total) % total;
const getNextIndex = (index: number) => (index + 1) % total;

const prevIndex = getPrevIndex(centerIndex);
const nextIndex = getNextIndex(centerIndex);

const handleNext = () => {
setDirection(1);
setCenterIndex((prev) => (prev + 1) % total);
};

const handlePrev = () => {
setDirection(-1);
setCenterIndex((prev) => (prev - 1 + total) % total);
};

// Swipe handlers
const handleTouchStart = (e: React.TouchEvent) => {
touchStartX.current = e.touches[0].clientX;
};
const handleTouchMove = (e: React.TouchEvent) => {
touchEndX.current = e.touches[0].clientX;
};
const handleTouchEnd = () => {
const diff = touchStartX.current - touchEndX.current;
if (Math.abs(diff) > 50) {
if (diff > 0) handleNext();
else handlePrev();
}
};

return (
<div
   className="relative w-full max-w-5xl mx-auto overflow-hidden select-none"
   onTouchStart={handleTouchStart}
   onTouchMove={handleTouchMove}
   onTouchEnd={handleTouchEnd}
 >
<div className="flex items-center justify-center h-[550px] md:h-[600px] gap-4">
{/* Previous Item */}
<div className="hidden md:flex w-[200px] flex-shrink-0 transform scale-90 opacity-60">
<div className="flex flex-col items-center w-full">
<div className="relative w-full aspect-[9/19] rounded-[2rem] border-[6px] border-gray-700 shadow-lg overflow-hidden">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-700 rounded-b-xl z-10" />
<img
             src={items[prevIndex].image}
             alt={items[prevIndex].name}
             className="w-full h-full object-cover"
           />
</div>
<p className="text-xs text-luxury-muted mt-2">{items[prevIndex].name}</p>
</div>
</div>

    {/* Active Item */}
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={centerIndex}
        custom={direction}
        initial={{ x: direction * 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction * -150, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-[260px] flex-shrink-0 z-10"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-[9/19] rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-b-xl z-10" />
            <img
              src={items[centerIndex].image}
              alt={items[centerIndex].name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-light text-luxury-text">{items[centerIndex].name}</h3>
            <p className="text-sm text-luxury-muted mt-1">{items[centerIndex].description}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* Next Item */}
    <div className="hidden md:flex w-[200px] flex-shrink-0 transform scale-90 opacity-60">
      <div className="flex flex-col items-center w-full">
        <div className="relative w-full aspect-[9/19] rounded-[2rem] border-[6px] border-gray-700 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-700 rounded-b-xl z-10" />
          <img
            src={items[nextIndex].image}
            alt={items[nextIndex].name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-luxury-muted mt-2">{items[nextIndex].name}</p>
      </div>
    </div>
  </div>

  {/* Navigation Buttons */}
  <button
    onClick={handlePrev}
    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md backdrop-blur flex items-center justify-center hover:bg-white transition"
  >
    <HiOutlineChevronLeft className="text-xl text-luxury-text" />
  </button>
  <button
    onClick={handleNext}
    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md backdrop-blur flex items-center justify-center hover:bg-white transition"
  >
    <HiOutlineChevronRight className="text-xl text-luxury-text" />
  </button>
</div>

);
}

function FAQAccordion() {
const [openIndex, setOpenIndex] = useState<number | null>(null);

const faqs = [
{
q: "Serviro چیست؟",
a: "Serviro یک پلتفرم منوی دیجیتال برای کافه‌ها، رستوران‌ها و فست‌فودها است. با اسکن QR Code، مشتریان شما بدون نیاز به نصب اپلیکیشن، منو را می‌بینند و می‌توانند گارسون را فراخوانی کنند.",
},
{
q: "آیا برای استفاده نیاز به نصب اپلیکیشن است؟",
a: "خیر. مشتریان فقط با اسکن QR Code وارد منوی شما می‌شوند و همه‌چیز به‌صورت آنلاین و بدون نصب نرم‌افزار کار می‌کند.",
},
{
q: "چطور منوی QR بسازم؟",
a: "بعد از ورود به پنل مدیریت، غذاها و دسته‌بندی‌ها را اضافه کنید، سپس از بخش «کیوآر کدها» برای هر میز یک کد اختصاصی بسازید و دانلود کنید.",
},
{
q: "آیا می‌توانم ظاهر منو را شخصی‌سازی کنم؟",
a: "بله، در پنل مدیریت می‌توانید رنگ‌ها، فونت، چیدمان و حتی قالب منو را تغییر دهید تا دقیقاً مطابق برند شما باشد.",
},
{
q: "آیا امکان فراخوانی گارسون وجود دارد؟",
a: "بله، مشتری با یک کلیک گارسون را به میز فرا می‌خواند و درخواست به‌صورت زنده در پنل مدیریت شما نمایش داده می‌شود.",
},
{
q: "هزینه سرویس چگونه محاسبه می‌شود؟",
a: "تعرفه‌ها بر اساس اشتراک ماهانه، شش‌ماهه یا سالانه است و شامل تمام امکانات می‌شود. برای جزئیات بیشتر به بخش قیمت‌گذاری مراجعه کنید.",
},
{
q: "آیا پشتیبانی دارید؟",
a: "بله، تیم پشتیبانی ما از طریق تلگرام، اینستاگرام و پیامک پاسخگوی سوالات شما هستند.",
},
];

return (
<div className="w-full">
{faqs.map((item, index) => {
const isOpen = openIndex === index;

    return (
      <div
        key={index}
        className="border-b border-luxury-border/40 last:border-0"
      >
        <button
          onClick={() => setOpenIndex(isOpen ? null : index)}
          className="flex w-full items-center justify-between py-6 text-right text-lg font-light text-luxury-text hover:text-luxury-accent transition-colors"
        >
          <span>{item.q}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-luxury-muted"
          >
            <HiOutlineChevronDown className="h-5 w-5" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden text-sm text-luxury-muted font-light leading-7 pb-6"
            >
              {item.a}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  })}
</div>

);
}

export default function LandingPage() {
const [showLogin, setShowLogin] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginLoading, setLoginLoading] = useState(false);
const [loginError, setLoginError] = useState("");
const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();
setLoginLoading(true);
setLoginError("");

const { error } = await supabase.auth.signInWithPassword({
  email: loginEmail,
  password: loginPassword,
});

if (error) {
  setLoginError("ورود ناموفق. ایمیل یا رمز عبور اشتباه است.");
  setLoginLoading(false);
} else {
  window.location.href = "/admin/dashboard";
}

};

const getCardTranslate = (index: number) => {
if (index === 1) {
if (hoveredPlan === 0 || hoveredPlan === 2) return "translate-y-0";
return "-translate-y-6";
} else {
if (hoveredPlan === index) return "-translate-y-6";
return "translate-y-0";
}
};

return (
<div className="min-h-screen bg-[#FBFAFB] text-luxury-text font-yekan selection:bg-luxury-accent selection:text-white">
{/* Navigation */}

<nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBFAFB]/70 backdrop-blur-xl border-b border-black/5">
  <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

{/* Logo - Left */}
<div className="flex items-center gap-3 order-1">
  <span className="text-2xl font-light tracking-[0.25em] text-luxury-text">
    SERVIRO
  </span>
</div>


<div className="hidden md:flex items-center gap-10 order-2">
  <Link
    href="/"
    className="inline-block text-sm text-luxury-muted hover:text-luxury-text transition-all duration-300 hover:scale-105"
  >
    خانه
  </Link>

  <Link
    href="/templates"
    className="inline-block text-sm text-luxury-muted hover:text-luxury-text transition-all duration-300 hover:scale-105"
  >
    قالب‌ها
  </Link>

  <Link
    href="#features"
    className="inline-block text-sm text-luxury-muted hover:text-luxury-text transition-all duration-300 hover:scale-105"
  >
    قابلیت‌ها
  </Link>

  <Link
    href="#pricing"
    className="inline-block text-sm text-luxury-muted hover:text-luxury-text transition-all duration-300 hover:scale-105"
  >
    قیمت‌گذاری
  </Link>

  <Link
    href="#contact"
    className="inline-block text-sm text-luxury-muted hover:text-luxury-text transition-all duration-300 hover:scale-105"
  >
    تماس با ما
  </Link>
</div>


{/* Login Button - Right */}
<div className="order-3">

  <button
  onClick={() => setShowLogin(true)}
  className="
    px-7
    py-3
    rounded-full
    bg-black
    text-white
    border
    border-black
    text-sm
    font-light
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]
  "
>
  ورود به پنل
</button>

</div>

  </div>
</nav>

{/* Hero Section */}

<section className="pt-20 pb-10 px-6">
  <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

{/* ستون چپ: تصویر بدون هیچ بک‌گراند، با انیمیشن شناور */}
<motion.div
  className="w-full pt-14 lg:w-1/2 flex justify-center"
  animate={{ y: [0, -12, 0] }}           // حرکت نرم بالا و پایین
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <img
    src="/images/hero-image.jpg"          // ← مسیر عکس خودت را بگذار
    alt="Serviro Hero"
    className="w-full h-auto object-contain"
  />
</motion.div>

 {/* ستون راست: متن و دکمه با فاصلهٔ بیشتر از لبه */}
<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
  className="w-full lg:w-1/2 text-center lg:text-center"   // ← فاصلهٔ جدید
>
  <motion.div variants={fadeInUp}>
    <span className="inline-block px-6 py-1.5 bg-[#EFEDEF] text-luxury-muted text-xs font-light rounded-full mb-6 tracking-wide">
      پلتفرم منوی دیجیتال برای کافه و رستوران
    </span>
  </motion.div>

  <motion.h1
    variants={fadeInUp}
    className="text-4xl md:text-6xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6"
  >
    منوی دیجیتال
    <br />
    <span className="text-luxury-accent">فراتر از یک برگه کاغذ</span>
  </motion.h1>

  <motion.p
    variants={fadeInUp}
    className="text-luxury-muted text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-16 text-center"
  >
    با Serviro، کافه یا رستوران شما یک منوی QR اختصاصی، مدیریت آسان
    غذاها، و ارتباط مستقیم با گارسون را به مشتریان هدیه می‌دهد.
  </motion.p>

  <motion.div
  variants={fadeInUp}
  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
>
  <Link
    href="/templates"
    className="w-full max-w-xs sm:w-auto px-6 py-3 bg-black text-white border border-black rounded-full text-base sm:text-lg font-light transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
  >
    مشاهده قالب‌ها
  </Link>
  <Link
    href="/contact"
    className="w-full max-w-xs sm:w-auto px-6 py-3 border border-luxury-accent text-luxury-accent rounded-full text-base sm:text-lg font-light transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
  >
    تماس با ما
  </Link>
</motion.div>

  {/* بخش اعتمادسازی */}
  <motion.div
    variants={fadeInUp}
    className="flex justify-center mt-6"
  >
    <div className="flex items-center gap-3">
      <div className="flex flex-row-reverse items-center">
        {trustAvatars.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`w-7 h-7 rounded-full border-2 border-white object-cover ${
              i !== trustAvatars.length - 1 ? "-mr-2" : ""
            }`}
          />
        ))}
      </div>
      <span className="text-black/80 text-xs font-light whitespace-nowrap">
        ۲۰۰+ رستوران و کافه فعال به Serviro اعتماد کرده‌اند
      </span>
    </div>
  </motion.div>
</motion.div>

  </div>
</section>

{/* Features Section */}

<section className="py-20 px-6 bg-[#FBFAFB]">
  <div className="max-w-7xl mx-auto">

{/* باکس اصلی */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="bg-white rounded-2xl shadow-sm overflow-hidden"
>
  <div className="flex flex-wrap md:flex-nowrap">
    {features.map((feature, index) => {
      const Icon = feature.icon;
      return (
        <React.Fragment key={index}>
          <motion.div
            variants={fadeInUp}
            className="flex-1 min-w-[200px] flex flex-col items-center text-center py-10 px-6 transition-all duration-300 hover:bg-luxury-bg/50"
          >
            {/* آیکون بزرگ، بدون بک‌گراند */}
            <Icon className="text-4xl text-luxury-accent mb-5" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-luxury-muted font-light leading-relaxed line-clamp-1">
              {feature.description}
            </p>
          </motion.div>
          {index < features.length - 1 && (
            <div className="w-px h-30 bg-luxury-border/50 self-center hidden md:block" />
          )}
        </React.Fragment>
      );
    })}
  </div>
</motion.div>

  </div>
</section>

{/* Template Phone Mockup Carousel */}

<section className="py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="text-center"
    >
    </motion.div>
    <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="text-center mb-12"
>
  <motion.span
    variants={fadeInUp}
    className="text-[11px] font-medium tracking-[0.18em] text-black/30"
  >
    TEMPLATES
  </motion.span>

  <motion.h2
    variants={fadeInUp}
    className="mt-5 text-4xl md:text-5xl font-medium tracking-[-0.035em] leading-[1.2] text-luxury-text"
  >
    منویی که
    <br />
    <span className="text-black/25">شبیه برند شماست</span>
  </motion.h2>

  <motion.p
    variants={fadeInUp}
    className="mx-auto mt-6 max-w-xl text-sm md:text-base leading-8 text-luxury-muted font-light"
  >
    از میان قالب‌های مختلف انتخاب کنید و ظاهر منوی دیجیتال خود را با هویت برندتان هماهنگ کنید.
  </motion.p>
</motion.div>

<PhoneMockupSlider templateMockups={templateMockups} />

<div className="text-center mt-8">
  <Link
  href="/templates"
  className="inline-block px-8 py-3 bg-black text-white border border-black rounded-full text-lg font-light transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
>
  مشاهده همه قالب‌ها
</Link>
</div>

  </div>
</section>

{/* Logo Marquee Section */}
<section className="py-2 bg-[#FBFAFB] border-y border-luxury-border/50">
<div className="max-w-8xl mx-auto px-6">
<LogoMarquee />
</div>
</section>

{/* Pricing Section */}

<section id="pricing" className="py-20 px-16 md:px-6 bg/50">
  <div className="max-w-6xl mx-auto">
    <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="text-center mb-12 md:mb-16"
>
  <motion.span
    variants={fadeInUp}
    className="text-[11px] font-medium tracking-[0.18em] text-black/30"
  >
    PRICING
  </motion.span>

  <motion.h2
    variants={fadeInUp}
    className="mt-5 text-4xl md:text-5xl font-medium tracking-[-0.035em] leading-[1.2] text-luxury-text"
  >
    تعرفه‌های شفاف
    <br />
    <span className="text-black/25">برای هر اندازه کسب‌وکار</span>
  </motion.h2>

  <motion.p
    variants={fadeInUp}
    className="mx-auto mt-6 max-w-xl text-sm md:text-base leading-8 text-luxury-muted font-light"
  >
    متناسب با نیاز خود، یکی از طرح‌ها را انتخاب کنید.
  </motion.p>
</motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {pricingPlans.map((plan, index) => {
        const isFeatured = index === 1; // پلن وسط به‌عنوان محبوب‌ترین
        return (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col ${
              isFeatured
                ? "bg-white text-luxury-text border border-luxury-border shadow-2xl md:scale-110 z-10"
                : "bg-white text-luxury-text border border-luxury-border shadow-sm hover:shadow-xl hover:-translate-y-1"
            }`}
          >
            {isFeatured && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-luxury-accent text-white text-xs font-light px-4 py-1 rounded-full border border-white/30">
                محبوب‌ترین
              </span>
            )}

            <p
              className={`text-xs font-light uppercase tracking-widest mb-2 ${
                isFeatured ? 'text-luxury-muted' : 'text-luxury-muted'
              }`}
            >
              {plan.duration}
            </p>

            <p
              className={`text-5xl font-light mb-4 ${
                isFeatured ? 'text-luxury-accent' : 'text-luxury-accent'
              }`}
            >
              {plan.price}
              <span
                className={`text-xl font-light ${
                  isFeatured ? 'text-luxury-muted' : 'text-luxury-muted'
                }`}
              >
                /{plan.period}
              </span>
            </p>

            <ul
              className={`text-sm space-y-3 mb-8 flex-1 ${
                isFeatured ? 'text-luxury-muted' : 'text-luxury-muted'
              }`}
            >
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFeatured ? 'bg-luxury-accent' : 'bg-luxury-accent'
                    }`}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`text-center inline-block w-full py-3 rounded-full text-lg font-light transition-all duration-300 ${
                isFeatured
                  ? 'bg-luxury-accent text-white hover:bg-luxury-accent-dark'
                  : 'bg-luxury-accent text-white hover:bg-luxury-accent-dark'
              }`}
            >
              تماس با ما
            </a>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>

{/* Roadmap Section */}

<section className="py-24 md:py-32 px-6 bg-[#FBFAFB]">
  <div className="max-w-[1100px] mx-auto">

    <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-16 lg:gap-24">

      {/* ─────────────────────────
          ستون معرفی
      ───────────────────────── */}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-right"
      >

        {/* Label */}

        <span className="
          text-[11px]
          font-medium
          tracking-[0.18em]
          text-black/30
        ">
          GET STARTED
        </span>

        {/* Title */}

        <h2 className="
          mt-5
          text-4xl
          md:text-5xl
          font-medium
          tracking-[-0.035em]
          leading-[1.2]
          text-luxury-text
        ">
          چطور با Serviro
          <br />
          <span className="text-black/25">
            شروع کنم؟
          </span>
        </h2>

        {/* Description */}

        <p className="
          mt-6
          max-w-md
          text-sm
          md:text-base
          leading-8
          text-luxury-muted
          font-light
        ">
          در پنج مرحله ساده، منوی دیجیتال رستوران خود را
          بسازید و تجربه‌ای مدرن‌تر برای مشتریان خود ایجاد کنید.
        </p>

        {/* Button */}

        <Link
          href="/templates"
          className="
            mt-8
            inline-flex
            h-11
            items-center
            justify-center
            rounded-full
            bg-black
            px-7
            text-sm
            font-light
            text-white
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)]
          "
        >
          همین حالا شروع کنید
        </Link>

      </motion.div>


      {/* ─────────────────────────
          Timeline
      ───────────────────────── */}

      <div className="relative">

        <div className="space-y-3">

          {/* مرحله ۱ */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="
              group
              relative
              flex
              gap-6
              rounded-2xl
              p-5
              md:p-6
              transition-all
              duration-500
              hover:bg-black/[0.025]
            "
          >

            <div className="
              relative
              z-10
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.09]
              bg-[#FBFAFB]
              text-[15px]
              font-extrabold
              text-black
              transition-all
              duration-300
              group-hover:border-black
              group-hover:bg-black
              group-hover:text-white
            ">
              ۱
            </div>

            <div className="pt-1">
              <h3 className="
                text-base
                md:text-lg
                font-semibold
                text-luxury-text
              ">
                ثبت‌نام و ساخت حساب
              </h3>

              <p className="
                mt-2
                text-sm
                leading-7
                text-luxury-muted
                font-light
              ">
                در کمتر از یک دقیقه حساب کاربری رستوران خود را ایجاد کنید.
              </p>
            </div>

          </motion.div>


          {/* مرحله ۲ */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="
              group
              relative
              flex
              gap-6
              rounded-2xl
              p-5
              md:p-6
              transition-all
              duration-500
              hover:bg-black/[0.025]
            "
          >

            <div className="
              relative
              z-10
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.09]
              bg-[#FBFAFB]
              text-[15px]
              font-extrabold
              text-black
              transition-all
              duration-300
              group-hover:border-black
              group-hover:bg-black
              group-hover:text-white
            ">
              ۲
            </div>

            <div className="pt-1">
              <h3 className="
                text-base
                md:text-lg
                font-semibold
                text-luxury-text
              ">
                افزودن غذاها و دسته‌بندی‌ها
              </h3>

              <p className="
                mt-2
                text-sm
                leading-7
                text-luxury-muted
                font-light
              ">
                غذاها، تصاویر، قیمت‌ها و دسته‌بندی‌های منوی خود را اضافه کنید.
              </p>
            </div>

          </motion.div>


          {/* مرحله ۳ */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="
              group
              relative
              flex
              gap-6
              rounded-2xl
              p-5
              md:p-6
              transition-all
              duration-500
              hover:bg-black/[0.025]
            "
          >

            <div className="
              relative
              z-10
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.09]
              bg-[#FBFAFB]
              text-[15px]
              font-extrabold
              text-black
              transition-all
              duration-300
              group-hover:border-black
              group-hover:bg-black
              group-hover:text-white
            ">
              ۳
            </div>

            <div className="pt-1">
              <h3 className="
                text-base
                md:text-lg
                font-semibold
                text-luxury-text
              ">
                شخصی‌سازی رنگ و فونت
              </h3>

              <p className="
                mt-2
                text-sm
                leading-7
                text-luxury-muted
                font-light
              ">
                ظاهر منو را مطابق هویت بصری و برند رستوران خود تنظیم کنید.
              </p>
            </div>

          </motion.div>


          {/* مرحله ۴ */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.21 }}
            className="
              group
              relative
              flex
              gap-6
              rounded-2xl
              p-5
              md:p-6
              transition-all
              duration-500
              hover:bg-black/[0.025]
            "
          >

            <div className="
              relative
              z-10
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.09]
              bg-[#FBFAFB]
              text-[15px]
              font-extrabold
              text-black
              transition-all
              duration-300
              group-hover:border-black
              group-hover:bg-black
              group-hover:text-white
            ">
              ۴
            </div>

            <div className="pt-1">
              <h3 className="
                text-base
                md:text-lg
                font-semibold
                text-luxury-text
              ">
                دریافت QR Code میزها
              </h3>

              <p className="
                mt-2
                text-sm
                leading-7
                text-luxury-muted
                font-light
              ">
                برای هر میز یک QR اختصاصی بسازید و برای چاپ دانلود کنید.
              </p>
            </div>

          </motion.div>


          {/* مرحله ۵ */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="
              group
              relative
              flex
              gap-6
              rounded-2xl
              p-5
              md:p-6
              transition-all
              duration-500
              hover:bg-black/[0.025]
            "
          >

            <div className="
              relative
              z-10
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.09]
              bg-[#FBFAFB]
              text-[15px]
              font-extrabold
              text-black
              transition-all
              duration-300
              group-hover:border-black
              group-hover:bg-black
              group-hover:text-white
            ">
              ۵
            </div>

            <div className="pt-1">
              <h3 className="
                text-base
                md:text-lg
                font-semibold
                text-luxury-text
              ">
                شروع سرویس‌دهی
              </h3>

              <p className="
                mt-2
                text-sm
                leading-7
                text-luxury-muted
                font-light
              ">
                QR را روی میزها قرار دهید و تجربه دیجیتال جدید خود را شروع کنید.
              </p>
            </div>

          </motion.div>

        </div>
      </div>

    </div>
  </div>
</section>

{/* Statistics Section */}

<section className="py-20 px-10 md:px-6 bg-[#FBFAFB]">
  <div className="max-w-sm md:max-w-7xl mx-auto">

{/* باکس اصلی – دقیقاً مانند Features */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="bg-white rounded-2xl shadow-sm overflow-hidden"
>
  <div className="grid grid-cols-1 gap-8 md:gap-0 md:flex md:flex-nowrap">

    {/* آیتم ۱ */}
    <React.Fragment>
      <motion.div
        variants={fadeInUp}
        className="w-full md:flex-1 flex flex-col items-center text-center py-10 px-6 transition-all duration-300 hover:bg-luxury-bg/50"
      >
        <HiOutlineUserGroup className="text-4xl text-luxury-accent mb-5" />
        <div className="text-2xl font-bold text-luxury-accent mb-2">
          <CountUp end={200} suffix="+" />
        </div>
        <p className="text-sm text-luxury-muted font-light leading-relaxed line-clamp-1">
          رستوران و کافه فعال در سراسر ایران
        </p>
      </motion.div>
      <div className="w-px h-30 bg-luxury-border/50 self-center hidden md:block" />
    </React.Fragment>

    {/* آیتم ۲ */}
    <React.Fragment>
      <motion.div
        variants={fadeInUp}
        className="w-full md:flex-1 flex flex-col items-center text-center py-10 px-6 transition-all duration-300 hover:bg-luxury-bg/50"
      >
        <HiOutlineQrcode className="text-4xl text-luxury-accent mb-5" />
        <div className="text-2xl font-bold text-luxury-accent mb-2">
          <CountUp end={50000} suffix="+" />
        </div>
        <p className="text-sm text-luxury-muted font-light leading-relaxed line-clamp-1">
          اسکن QR در ماه
        </p>
      </motion.div>
      <div className="w-px h-30 bg-luxury-border/50 self-center hidden md:block" />
    </React.Fragment>

    {/* آیتم ۳ */}
    <motion.div
      variants={fadeInUp}
      className="w-full md:flex-1 flex flex-col items-center text-center py-10 px-6 transition-all duration-300 hover:bg-luxury-bg/50"
    >
      <HiOutlineShieldCheck className="text-4xl text-luxury-accent mb-5" />
      <div className="text-2xl font-bold text-luxury-accent mb-2">
        <CountUp end={98} suffix="٪" />
      </div>
      <p className="text-sm text-luxury-muted font-light leading-relaxed line-clamp-1">
        رضایت مشتریان از سرعت و طراحی
      </p>
    </motion.div>

  </div>
</motion.div>

  </div>
</section>

{/* Testimonials Carousel */}

<section className="py-20 px-6 bg-[#FBFAFB]">
  <div className="max-w-6xl mx-auto">
    <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="text-center mb-12"
>
  <motion.span
    variants={fadeInUp}
    className="text-[11px] font-medium tracking-[0.18em] text-black/30"
  >
    TESTIMONIALS
  </motion.span>

  <motion.h2
    variants={fadeInUp}
    className="mt-5 text-4xl md:text-5xl font-medium tracking-[-0.035em] leading-[1.2] text-luxury-text"
  >
    مشتری‌ها
    <br />
    <span className="text-black/25">چه می‌گویند؟</span>
  </motion.h2>

  <motion.p
    variants={fadeInUp}
    className="mx-auto mt-6 max-w-xl text-sm md:text-base leading-8 text-luxury-muted font-light"
  >
    آنچه رستوران‌داران درباره Serviro می‌گویند.
  </motion.p>
</motion.div>

<div className="relative">
  {/* دکمه قبلی */}
  <button
    onClick={() => {
      const container = document.getElementById("testimonials-scroll");
      if (container) container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
    }}
    className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md backdrop-blur flex items-center justify-center hover:bg-white transition"
  >
    <HiOutlineChevronLeft className="text-xl text-luxury-text" />
  </button>

  {/* کاروسل اسکرول‌افقی */}
  <div
    id="testimonials-scroll"
    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
    style={{ scrollBehavior: "smooth" }}
  >
    {testimonials.map((testimonial, index) => (
      <div
        key={index}
        className="snap-center flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
      >
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-luxury-bg flex items-center justify-center">
                <span className="text-luxury-accent font-semibold">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-luxury-text">
                {testimonial.name}
              </h4>
              <span className="text-xs text-luxury-muted">
                {testimonial.role}
              </span>
            </div>
          </div>

          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <HiStar
                key={i}
                className={`text-lg ${
                  i < testimonial.rating
                    ? "text-[#FFBB00]"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-luxury-muted font-light leading-7 flex-1">
            {testimonial.text}
          </p>
        </motion.div>
      </div>
    ))}
  </div>

  {/* دکمه بعدی */}
  <button
    onClick={() => {
      const container = document.getElementById("testimonials-scroll");
      if (container) container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    }}
    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md backdrop-blur flex items-center justify-center hover:bg-white transition"
  >
    <HiOutlineChevronRight className="text-xl text-luxury-text" />
  </button>
</div>

  </div>
</section>

{/* FAQ Section */}

<section className="py-20 px-6 bg-[#FBFAFB]">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
      {/* ستون سمت راست – عنوان و توضیح */}
      <div className="flex-1 max-w-2xl">
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="text-[11px] font-medium tracking-[0.18em] text-black/30"
  >
    FAQ
  </motion.span>

  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.035em] leading-[1.15] text-luxury-text"
  >
    سوالات متداول
    <br />
    <span className="text-black/25">پاسخ‌هایی که نیاز دارید</span>
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="mt-6 max-w-sm text-sm md:text-base leading-8 text-luxury-muted font-light"
  >
    همه‌چیز دربارهٔ راه‌اندازی منوی دیجیتال با Serviro.
  </motion.p>
</div>

  {/* ستون سمت چپ – لیست سوالات */}
  <div className="flex-1 w-full">
    <FAQAccordion />
  </div>
</div>

  </div>
</section>


  {/* Contact CTA Section */}
<section id="contact" className="px-6 py-24 md:py-32">
  <div className="max-w-5xl mx-auto text-center">

{/* Heading */}
<motion.span
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: 0.1 }}
  className="text-[10px] font-medium tracking-[0.22em] text-black/30"
>
  LET'S WORK TOGETHER
</motion.span>

<motion.h2
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: 0.1 }}
  className="mx-auto mt-6 max-w-3xl text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-0.035em] leading-[1.15] text-luxury-text"
>
  آماده‌اید منوی رستوران
  <br />
  <span className="text-black/25">خود را متحول کنید؟</span>
</motion.h2>

<motion.p
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="mx-auto mt-6 max-w-xl text-sm md:text-base font-light leading-8 text-luxury-muted"
>
  برای دریافت سرویس، مشاوره و شروع همکاری
  از طریق یکی از راه‌های ارتباطی زیر با ما در تماس باشید.
</motion.p>


{/* Contact Options */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: 0.3 }}
  className="
    mt-12
    grid
    grid-cols-1
    md:grid-cols-3
    gap-3
    max-w-4xl
    mx-auto
  "
>

  {/* Telegram */}
  <motion.a
    href="https://t.me/serviro_ir"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="
      group
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-luxury-border
      bg-white/70
      px-5
      py-4
      text-right
      transition-all
      duration-300
      hover:border-black/15
      hover:bg-white
      hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-luxury-border
          bg-white
        "
      >
        <HiOutlinePaperAirplane className="text-xl text-luxury-text" />
      </div>

      <div className="text-right">
        <p className="text-xs font-light text-luxury-muted">
          تلگرام
        </p>
        <p className="mt-1 text-sm font-light text-luxury-text">
          @serviro_ir
        </p>
      </div>
    </div>

    <HiOutlineChevronLeft
      className="
        text-lg
        text-black/15
        transition-all
        duration-300
        group-hover:-translate-x-1
        group-hover:text-black/50
      "
    />
  </motion.a>

  {/* Instagram */}
  <motion.a
    href="https://instagram.com/serviro.ir"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="
      group
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-luxury-border
      bg-white/70
      px-5
      py-4
      text-right
      transition-all
      duration-300
      hover:border-black/15
      hover:bg-white
      hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-luxury-border
          bg-white
        "
      >
        <HiOutlineCamera className="text-xl text-luxury-text" />
      </div>

      <div className="text-right">
        <p className="text-xs font-light text-luxury-muted">
          اینستاگرام
        </p>
        <p className="mt-1 text-sm font-light text-luxury-text">
          @serviro.ir
        </p>
      </div>
    </div>

    <HiOutlineChevronLeft
      className="
        text-lg
        text-black/15
        transition-all
        duration-300
        group-hover:-translate-x-1
        group-hover:text-black/50
      "
    />
  </motion.a>

  {/* SMS */}
  <motion.div
    whileHover={{ y: -4 }}
    className="
      group
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-luxury-border
      bg-white/70
      px-5
      py-4
      text-right
      transition-all
      duration-300
      hover:border-black/15
      hover:bg-white
      hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-luxury-border
          bg-white
        "
      >
        <HiOutlineChat className="text-xl text-luxury-text" />
      </div>

      <div className="text-right">
        <p className="text-xs font-light text-luxury-muted">
          پیامک
        </p>
        <p className="mt-1 text-sm font-light text-luxury-text">
          09211211209
        </p>
      </div>
    </div>

    <span className="text-xs font-light text-black/20">
      تماس
    </span>
  </motion.div>
</motion.div>

  </div>
</section>


  {/* Footer */}
  <footer className="border-t border-luxury-border py-8 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <span className="text-sm text-luxury-muted font-light">
        © {new Date().getFullYear()} Serviro. تمام حقوق محفوظ است.
      </span>
      <div className="flex items-center gap-6 text-sm text-luxury-muted font-light">
        <Link href="/templates" className="hover:text-luxury-text transition-colors">
          قالب‌ها
        </Link>
        <button
          onClick={() => setShowLogin(true)}
          className="hover:text-luxury-text transition-colors"
        >
          پنل مدیریت
        </button>
        <span className="text-luxury-muted/40">|</span>
        <span className="text-luxury-muted/60">طراحی شده با ❤️</span>
      </div>
    </div>
  </footer>

  {/* Login Modal */}
  {showLogin && (
  <div
    className="fixed inset-0 z-50 flex min-h-[100dvh] w-full items-center justify-center bg-black/40 backdrop-blur-md"
    onClick={() => setShowLogin(false)}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl p-6 w-full max-w-sm sm:max-w-md mx-8 sm:mx-auto shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 text-luxury-muted hover:text-luxury-text transition-colors"
        >
          <HiX className="text-xl" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <span className="text-3xl font-extralight tracking-[.25em] text-luxury-accent">
            SERVIRO
          </span>
          <h2 className="text-lg font-light text-luxury-text mt-2">
            ورود به پنل مدیریت
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-light text-luxury-text mb-1">
              ایمیل
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-luxury-text mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-luxury-border text-sm font-light focus:outline-none focus:border-luxury-accent transition-colors"
              placeholder="••••••"
            />
          </div>

          {loginError && (
            <p className="text-red-500 text-sm font-light text-center">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2.5 bg-luxury-accent text-white rounded-xl font-light shadow-sm hover:bg-luxury-accent-dark transition-colors disabled:opacity-50"
          >
            {loginLoading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </motion.div>
    </div>
  )}
</div>

);
}