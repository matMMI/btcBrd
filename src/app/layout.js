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
    <html lang="fr" className="dark">
      <body
        className={`${inter.className} bg-dark-bg text-dark-text min-h-screen`}
      >
        <main className="container mx-auto p-4">{children}</main>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastClassName="bg-dark-card text-dark-text border border-dark-border"
        />
      </body>
    </html>
  );
}
