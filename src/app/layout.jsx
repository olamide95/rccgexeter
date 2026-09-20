import "./globals.css";
import { getContent } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import { ScrollProgress, CursorGlow, BackToTop } from "@/components/Chrome";

export const metadata = {
  title: "RCCG Glory of God Parish, Exeter",
  description:
    "Sunday Worship 10:00am, Midweek Service Wednesday 6:00pm. Glory House, 37 Northernhay Street, Exeter EX4 3ER.",
  icons: { icon: "/brand/logo.png" }
};

export const viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#05061C"
};

export default async function RootLayout({ children }) {
  const { site } = await getContent();
  return (
    <html lang="en-GB">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <CursorGlow />
        <ScrollProgress />
        <Header site={site} />
        <main id="main">{children}</main>
        <Footer site={site} />
        <BackToTop />
        <Effects />
      </body>
    </html>
  );
}
