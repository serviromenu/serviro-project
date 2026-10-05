import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت - Serviro",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}