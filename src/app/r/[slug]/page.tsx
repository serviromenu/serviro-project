"use client";

import { useParams } from "next/navigation";
import MenuPage from "@/app/menu/page";

export default function RestaurantMenuPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ? decodeURIComponent(params.slug) : undefined;

  return <MenuPage slug={slug} />;
}