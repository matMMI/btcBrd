import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Crypto Tax Tracker",
  description: "Suivez vos transactions crypto et calculez vos impôts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${GeistSans.className} bg-background text-foreground min-h-screen antialiased`}>
        <main className="container mx-auto p-6">{children}</main>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastClassName="bg-card text-card-foreground border border-border"
        />
      </body>
    </html>
  );
}
