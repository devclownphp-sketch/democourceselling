import { Inter } from "next/font/google";
import "./globals.css";
import PublicNavbar from "@/components/PublicNavbar";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WEBCOM — 100% Free Computer Courses",
  description: "Learn computer skills for free. Courses, PDF Notes, Quizzes and more.",
  openGraph: {
    title: "WEBCOM — 100% Free Computer Courses",
    description: "Learn computer skills for free. Courses, PDF Notes, Quizzes and more.",
    siteName: "WEBCOM",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicNavbar />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
