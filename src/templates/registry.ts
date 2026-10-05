import DefaultTemplate from "./DefaultTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MoonTemplate from "./MoonTemplate"; // ← این خط را اضافه کن

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  image: string; // ← اضافه شده
}

const templates: TemplateInfo[] = [
  {
    id: "default",
    name: "پیش‌فرض",
    description: "قالب اصلی سرویرو با طراحی مینیمال، سایدبار و چیدمان کارت‌های مربعی",
    component: DefaultTemplate,
    image: "/templates/default.png",
  },
  {
    id: "classic",
    name: "کلاسیک",
    description: "قالب کلاسیک سرویرو با طراحی مینیمال، سایدبار و چیدمان کارت‌های مربعی",
    component: ClassicTemplate,
    image: "/templates/classic.png",
  },
  {
  id: "moon",
  name: "ماه",
  description: "قالب ماه با هدر الهام‌گرفته از کافه مون",
  component: MoonTemplate,
  image: "/templates/moon.png",
},
  // در آینده قالب‌های دیگر اینجا اضافه می‌شوند
];

export default templates;