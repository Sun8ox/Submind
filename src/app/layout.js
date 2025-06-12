import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "SubMind",
  description: "A video freedom platform",
  openGraph: {
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
