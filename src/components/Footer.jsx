import Link from "next/link";

export default function Footer({ site }) {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="aurora" style={{ opacity: .32 }}><i className="b1" /></div>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <img className="fl" src="/brand/logo-white.png" alt={site?.name} />
            <p className="fbl">An arm of the Redeemed Christian Church of God, commissioned to preach the gospel of
              Jesus Christ and to meet the needs of Exeter and its environs.</p>
            <div className="socials">
              <a href={site?.socials?.facebook || "#"} aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13 22v-8h3l1-4h-4V8c0-1.1.3-1.8 1.9-1.8H17V2.8C16.4 2.7 15.3 2.6 14 2.6c-2.8 0-4.6 1.7-4.6 4.8V10H6v4h3.4v8H13z"/></svg></a>
              <a href={site?.socials?.youtube || "#"} aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23 12s0-3.4-.4-5c-.2-.9-.9-1.6-1.8-1.8C19.1 4.8 12 4.8 12 4.8s-7.1 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 8.6 1 12 1 12s0 3.4.4 5c.2.9.9 1.6 1.8 1.8 1.7.4 8.8.4 8.8.4s7.1 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-5 .4-5zM9.8 15.4V8.6l6 3.4-6 3.4z"/></svg></a>
              <a href={site?.socials?.instagram || "#"} aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z"/></svg></a>
            </div>
          </div>
          <div>
            <p className="fh">Explore</p>
            <ul className="fl-list">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/leadership">Leadership</Link></li>
              <li><Link href="/ministries">Ministries</Link></li>
              <li><Link href="/sermons">Sermons</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/events">Events</Link></li>
            </ul>
          </div>
          <div>
            <p className="fh">Get Involved</p>
            <ul className="fl-list">
              <li><Link href="/live">Watch Live</Link></li>
              <li><Link href="/give">Give Online</Link></li>
              <li><Link href="/prayer">Prayer Request</Link></li>
              <li><Link href="/contact">Plan A Visit</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <p className="fh">Find Us</p>
            <p className="fbody">Sunday 10:00am<br />Wednesday 6:00pm<br /><br />
              {site?.venue}<br />{site?.address1}<br />{site?.address2}<br /><br />
              <a href={`tel:${site?.officeTel}`} style={{ color: "var(--dim)", textDecoration: "none" }}>{site?.office}</a></p>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {year} {site?.name}. All rights reserved.</span>
          <span><Link href="/contact">Privacy</Link> &nbsp;&nbsp; <Link href="/contact">Safeguarding</Link> &nbsp;&nbsp; <Link href="/admin">Admin</Link></span>
        </div>
      </div>
    </footer>
  );
}
