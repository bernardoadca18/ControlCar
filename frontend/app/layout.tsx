import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ControlCar",
  description: "Sistema de Gestão de Oficinas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-100">

          <aside className="w-64 bg-slate-800 text-white p-6 hidden md:block">
            <h1 className="text-2xl font-bold mb-8 text-blue-400">ControlCar</h1>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="hover:text-blue-300">Dashboard</Link>
              <Link href="/clients" className="hover:text-blue-300">Clientes</Link>
              <Link href="/os" className="hover:text-blue-300">Ordens de Serviço</Link>
            </nav>
          </aside>
          
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}