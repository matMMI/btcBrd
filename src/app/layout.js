// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crypto Tax Tracker",
  description: "Suivez vos transactions crypto et calculez vos impôts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Crypto Tax Tracker</h1>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
