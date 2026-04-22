import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import PublicNavbar from "@/components/brutalist/PublicNavbar";
import ScrollToTop from "@/components/ScrollToTop";
import SettingsProvider from "@/components/SettingsProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <PublicNavbar />
          {children}
          <ScrollToTop />
        </SettingsProvider>
      </body>
    </html>
  );
}
