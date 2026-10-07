"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Minus, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { BENEFITS, CUSTOMERS, GET_STARTED, SUBNAV_LINKS, USE_CASES } from "./content";

/* eslint-disable @next/next/no-img-element */

const CONTAINER = "mx-auto w-full max-w-[1280px] px-6 md:px-10";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/* Sub navigation pill ("Amazon Route 53 | Overview Features ...")     */
/* ------------------------------------------------------------------ */
function SubNav() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="pointer-events-none sticky top-[110px] z-40">
      <div className={`${CONTAINER} pt-3`}>
        <div className="pointer-events-auto relative flex h-[54px] items-center overflow-x-auto hide-scrollbar rounded-[14px] bg-white px-4 md:px-7 shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
          <span className="mr-6 md:mr-10 shrink-0 text-[14px] md:text-[15px] font-semibold text-[#0f141a]">Amazon Route 53</span>
          <nav className="flex h-full items-stretch gap-4 md:gap-7 text-[13px] md:text-[14px] shrink-0" aria-label="Route 53 sections">
            {SUBNAV_LINKS.map((l, i) => (
              <div key={l.label} className="relative flex h-full items-stretch shrink-0" onMouseLeave={() => l.dropdown && setMenu(false)}>
                <button
                  onClick={() => scrollToId(l.target)}
                  onMouseEnter={() => l.dropdown && setMenu(true)}
                  className={`flex items-center gap-1 border-b-[3px] ${i === 0 ? "border-[#0f141a] font-semibold" : "border-transparent font-medium"} text-[#0f141a] hover:border-[#0f141a]`}
                >
                  {l.label}
                  {l.dropdown && <ChevronDown size={13} />}
                </button>
                {l.dropdown && menu && (
                  <ul className="absolute left-0 top-full z-50 w-[220px] rounded-[10px] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                    {l.dropdown.map((d) => (
                      <li key={d}>
                        <button onClick={() => scrollToId("get-started")} className="block w-full px-4 py-2 text-left text-[14px] hover:bg-[#f2f3f3]">{d}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion ("Benefits of Route 53", "Use cases")                      */
/* ------------------------------------------------------------------ */
function Accordion({ items, bold }: { items: { title: string; body: string }[]; bold?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="border-t border-[#d1d5db]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.title} className="border-b border-[#d1d5db]">
            <button
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-6 py-[22px] text-left"
            >
              <span className={`text-[16px] leading-[1.45] text-[#0f141a] ${bold ? "font-semibold" : "font-semibold"}`}>{it.title}</span>
              {isOpen ? <Minus size={20} className="mt-0.5 shrink-0" /> : <Plus size={20} className="mt-0.5 shrink-0" />}
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <p className="overflow-hidden text-[16px] leading-[1.6] text-[#414d5c]">{it.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function TwoCol({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={`${CONTAINER} grid grid-cols-1 gap-8 py-[72px] md:grid-cols-2 md:gap-16`}>
      <h2 className="text-[28px] font-medium leading-tight text-[#0f141a] md:pt-1 md:text-[30px]">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function MarketingBody() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <main id="aws-page-content-main" className="relative bg-white text-[#0f141a]">
      {/* Hero gradient */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(180deg,#a9f1f8_0%,#d2f8fb_45%,#ffffff_100%)]" />

      <SubNav />

      {/* Hero */}
      <section id="overview" className={`${CONTAINER} relative pb-[84px] pt-8`}>
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px] text-[#0f141a]">
          <a href="#" className="underline">Products</a><span>›</span>
          <a href="#" className="underline">Networking and Content Delivery</a><span>›</span>
        </nav>
        <h1 className="max-w-[780px] text-[32px] font-medium leading-[1.2] md:text-[40px]">Amazon Route 53 - DNS service</h1>
        <p className="mt-4 max-w-[680px] text-[18px] leading-[1.5]">
          A reliable and cost-effective way to route end users to Internet applications
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/login" id="hero-get-started" className="rounded-full bg-[#0f141a] px-6 py-[11px] text-[14px] font-semibold text-white transition-colors hover:bg-[#2e3a4a]">
            Get started with Route 53
          </Link>
          <a href="https://aws.amazon.com/contact-us/sales-support/" id="hero-expert" className="rounded-full border border-[#0f141a] bg-white px-6 py-[11px] text-[14px] font-semibold text-[#0f141a] transition-colors hover:bg-[#f2f3f3]">
            Connect with an expert
          </a>
        </div>
      </section>

      <div className="relative">
        <TwoCol title="Benefits of Route 53"><Accordion items={BENEFITS} /></TwoCol>

        {/* How it works */}
        <TwoCol title="How it works">
          <div className="space-y-5 text-[14px] leading-[1.6] text-[#414d5c] md:text-[15px]">
            <p>
              Amazon Route 53 provides highly available and scalable{" "}
              <a href="#" className="text-[#0972d3] underline">Domain Name System (DNS)</a>,{" "}
              <a href="#" className="text-[#0972d3] underline">domain name registration</a>, and{" "}
              <a href="#" className="text-[#0972d3] underline">health-checking</a> cloud services. It is designed to give developers and businesses an extremely reliable and cost-effective way to route end users to internet applications by translating names like example.com into the numeric IP addresses, such as 192.0.2.1, that computers use to connect to each other. You can combine your DNS with health-checking services to route traffic to healthy endpoints or to independently monitor and alarm on endpoints. You can also use the{" "}
              <a href="#" className="text-[#0972d3] underline">Traffic Flow</a> visual policy builder to simplify the process of creating and maintaining records. Route 53 effectively connects user requests to infrastructure running in AWS, such as EC2 instances, Elastic Load Balancing load balancers, or Amazon S3 buckets, and can also be used to route users to infrastructure outside of AWS.
            </p>
            <p>
              In addition, <a href="#" className="text-[#0972d3] underline">Route 53 Resolver</a> provides a regional DNS service that performs recursive DNS lookups for names hosted in Amazon Elastic Compute Cloud (EC2), as well as public names on the internet. Lastly, the{" "}
              <a href="#" className="text-[#0972d3] underline">Route 53 Resolver DNS Firewall</a> allows you to block queries made for known or suspected malicious domains, and to allow queries for trusted domains when using the Route 53 Resolver for recursive DNS resolution.
            </p>
          </div>
        </TwoCol>

        <TwoCol title="Use cases"><Accordion items={USE_CASES} /></TwoCol>

        {/* Customers - stacked cards */}
        <section id="customers" className={`${CONTAINER} py-[56px]`}>
          <h2 className="mb-10 text-[28px] font-medium md:text-[30px]">Customers</h2>
          <div className="relative">
            {CUSTOMERS.map((c, i) => (
              <a
                key={c.title}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group sticky top-[190px] mb-6 block aspect-[16/8] w-full overflow-hidden rounded-[24px] bg-[#0f141a] shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
                style={{ top: 190 + i * 14 }}
              >
                <img src={c.image} alt={c.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-10">
                  <img src={c.logo} alt="" className="mb-5 h-[44px] w-auto max-w-[200px] object-contain object-left" />
                  <h3 className="max-w-[560px] text-[20px] font-semibold leading-snug text-white md:text-[24px]">{c.title}</h3>
                  <ArrowRight size={20} className="mt-4 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Get started */}
        <section id="get-started" className={`${CONTAINER} py-[56px]`}>
          <h2 className="mb-10 text-[28px] font-medium md:text-[30px]">Get started</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-2">
            {GET_STARTED.map((g, i) => (
              <a
                key={g.title}
                href={g.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative block min-h-[260px] overflow-hidden rounded-[20px] bg-[#0f141a] ${i === 0 ? "min-h-[420px] md:row-span-2" : ""}`}
              >
                <img src={g.image} alt={g.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-[4px] bg-[#0f141a] px-2 py-[3px] font-mono text-[11px] text-white">{g.badge}</span>
                <div className="absolute bottom-0 left-0 p-6 pr-10">
                  <h3 className="text-[18px] font-semibold leading-snug text-white md:text-[20px]">{g.title}</h3>
                  <ArrowRight size={18} className="mt-3 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Feedback banner */}
        <section id="feedback" className={`${CONTAINER} pb-[72px] pt-[24px]`}>
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[linear-gradient(100deg,#b165fb_0%,#2e8bff_55%,#9ceeff_100%)] px-8 py-10 md:flex-row md:items-center md:px-12">
            {feedback ? (
              <p className="text-[18px] font-semibold text-[#0f141a]" role="status">Thanks for your feedback! It helps us improve our pages.</p>
            ) : (
              <>
                <div>
                  <h2 className="text-[18px] font-semibold text-[#0f141a]">Did you find what you were looking for today?</h2>
                  <p className="mt-1 text-[14px] text-[#0f141a]">Let us know so we can improve the quality of the content on our pages</p>
                </div>
                <div className="flex w-full gap-4 md:w-[420px]">
                  <button id="feedback-yes" onClick={() => setFeedback("up")} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f141a] py-[10px] text-[14px] font-semibold text-white transition-colors hover:bg-[#2e3a4a]">
                    Yes <ThumbsUp size={14} />
                  </button>
                  <button id="feedback-no" onClick={() => setFeedback("down")} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f141a] py-[10px] text-[14px] font-semibold text-white transition-colors hover:bg-[#2e3a4a]">
                    No <ThumbsDown size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
