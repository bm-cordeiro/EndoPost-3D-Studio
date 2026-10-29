import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "EndoPost 3D Studio",
  description: "Simulador didático de pinos de fibra de vidro e anatomia dental em 3D.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
