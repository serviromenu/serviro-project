"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import FoodCard from "./FoodCard";

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

interface FoodsListProps {
  foods: Food[];
  selectedFoods: Set<string>;
  isBulkMode: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (food: Food) => void;
  onDelete: (id: string) => void;
  onReorder: (event: DragEndEvent) => void;
}

export default function FoodsList({
  foods,
  selectedFoods,
  isBulkMode,
  onToggleSelect,
  onEdit,
  onDelete,
  onReorder,
}: FoodsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (foods.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onReorder}
    >
      <SortableContext
        items={foods.map((food) => food.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              isSelected={selectedFoods.has(food.id)}
              onToggleSelect={onToggleSelect}
              isBulkMode={isBulkMode}
              onEdit={() => onEdit(food)}
              onDelete={() => onDelete(food.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}