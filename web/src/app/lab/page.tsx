import type { Metadata } from "next";
import { LabClient } from "./LabClient";

export const metadata: Metadata = {
  title: "The Workstation — 3D Lab",
  description:
    "An interactive 3D workstation exploring Gunratna Borkar's ML pipelines.",
};

export default function LabPage() {
  return <LabClient />;
}
