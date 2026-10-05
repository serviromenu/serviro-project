"use client";

import { HiCheck, HiMenu, HiPencil, HiTrash } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Food {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  is_available: boolean;
}

interface FoodCardProps {
  food: Food;
  isSelected: boolean;
  isBulkMode: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FoodCard({
  food,
  isSelected,
  isBulkMode,
  onToggleSelect,
  onEdit,
  onDelete,
}: FoodCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: food.id,
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
      className={`bg-white rounded-xl luxury-shadow p-4 flex gap-3 ${
        isSelected ? "ring-2 ring-luxury-accent" : ""
      }`}
    >
      {isBulkMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(food.id);
          }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center self-center flex-shrink-0 transition-colors ${
            isSelected
              ? "bg-luxury-accent border-luxury-accent text-white"
              : "border-gray-300 hover:border-luxury-accent"
          }`}
        >
          {isSelected && <HiCheck className="text-xs" />}
        </button>
      )}

      <button
        type="button"
        className="p-1 text-luxury-muted/40 hover:text-luxury-text cursor-grab active:cursor-grabbing self-center touch-none"
        {...attributes}
        {...listeners}
        aria-label="جابجایی غذا"
      >
        <HiMenu className="text-lg" />
      </button>

      <div
        className={`w-16 h-16 rounded-lg bg-white flex-shrink-0 overflow-hidden ${
          !food.is_available ? "grayscale" : ""
        }`}
      >
        {food.image_url ? (
          <img
            src={food.image_url}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-luxury-muted/30 bg-white">
            {food.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {!food.is_available && (
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          )}

          <h3 className="font-medium truncate text-luxury-text">
            {food.name}
          </h3>
        </div>

        <p className="text-xs text-luxury-muted mt-1">
          {food.price.toLocaleString()} تومان
        </p>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="p-2 text-luxury-muted hover:text-luxury-accent transition-colors"
          aria-label="ویرایش غذا"
        >
          <HiPencil />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-luxury-muted hover:text-red-500 transition-colors"
          aria-label="حذف غذا"
        >
          <HiTrash />
        </button>
      </div>
    </div>
  );
}