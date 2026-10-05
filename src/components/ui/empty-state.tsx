import { HiOutlineInbox, HiOutlineSearch, HiOutlineShoppingBag, HiOutlineBell } from "react-icons/hi";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-luxury-bg flex items-center justify-center mb-4 text-luxury-muted/30">
        {icon || <HiOutlineInbox className="text-4xl" />}
      </div>
      <h3 className="text-lg font-light text-luxury-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-luxury-muted font-light max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// نمونه‌های آماده برای استفاده سریع
export function EmptySearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<HiOutlineSearch className="text-4xl" />}
      title="نتیجه‌ای یافت نشد"
      description={
        query
          ? `برای "${query}" چیزی پیدا نکردیم`
          : "غذایی با این شرایط وجود ندارد"
      }
    />
  );
}

export function EmptyCart() {
  return (
    <EmptyState
      icon={<HiOutlineShoppingBag className="text-4xl" />}
      title="سبد خرید خالی است"
      description="غذاهای مورد علاقه‌تان را به سبد اضافه کنید"
    />
  );
}

export function EmptyFoods() {
  return (
    <EmptyState
      icon={<HiOutlineInbox className="text-4xl" />}
      title="هنوز غذایی اضافه نشده"
      description="از دکمه بالای صفحه اولین غذای منو را ثبت کنید"
    />
  );
}

export function EmptyCategories() {
  return (
    <EmptyState
      icon={<HiOutlineInbox className="text-4xl" />}
      title="دسته‌بندی‌ای وجود ندارد"
      description="ابتدا یک دسته‌بندی مثل «پیش‌غذا» یا «نوشیدنی» بسازید"
    />
  );
}

export function EmptyWaiterCalls() {
  return (
    <EmptyState
      icon={<HiOutlineBell className="text-4xl" />}
      title="درخواست گارسونی ثبت نشده"
      description="وقتی مشتری گارسون را فراخوانی کند، این‌جا نمایش داده می‌شود"
    />
  );
}