"use client";

import { HiMenu, HiPencil, HiTrash } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Category {
  id: string;
  name: string;
  sort_order: number;
  image_url?: string | null;
}

interface CategoryRowProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryRow({
  category,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl luxury-shadow p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="p-1 text-luxury-muted/40 hover:text-luxury-text cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
          aria-label="جابجایی دسته‌بندی"
        >
          <HiMenu className="text-lg" />
        </button>

        {category.image_url ? (
          <img
            src={category.image_url}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-sm text-luxury-muted flex-shrink-0">
            {category.name.charAt(0)}
          </div>
        )}

        <span className="font-light text-luxury-text truncate">
          {category.name}
        </span>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-2 text-luxury-muted hover:text-luxury-accent transition-colors"
          aria-label="ویرایش دسته‌بندی"
        >
          <HiPencil />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-luxury-muted hover:text-red-500 transition-colors"
          aria-label="حذف دسته‌بندی"
        >
          <HiTrash />
        </button>
      </div>
    </div>
  );
}