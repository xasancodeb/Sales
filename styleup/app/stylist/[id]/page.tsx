import { STYLISTS } from "@/lib/data";
import StylistClient from "./StylistClient";

export function generateStaticParams() {
  return STYLISTS.map((s) => ({ id: s.id }));
}

export default function StylistPage() {
  return <StylistClient />;
}
