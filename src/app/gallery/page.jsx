import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";

export const metadata = { title: "Gallery — RCCG Glory of God Parish, Exeter" };

export default async function GalleryPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumb="Gallery" heading="Life At Glory House" image={c.media.galleryHero}
        lede="Sundays, conventions, outreach days and the ordinary moments in between." />
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b3" /></div>
        <div className="wrap"><Gallery items={c.gallery} feature /></div>
      </section>
    </>
  );
}
