import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FOOTER_COLUMNS } from "./content";

const SOCIAL = [
  { name: "X", d: "M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.1L5.9 22H3l7-8L2 2h6.1l4.3 5.7L18.2 2Zm-1 18h1.6L7 3.9H5.3L17.2 20Z" },
  { name: "Facebook", d: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.6V14h2.7v8h3.2Z" },
  { name: "LinkedIn", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6c.6-1 1.9-1.9 3.9-1.9 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21h-4V9.5Z" },
  { name: "Instagram", d: "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM17.2 5.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1-3.2.1-4.7 1.7-4.9 4.9C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.2 1.7 4.7 4.9 4.9 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.2-.1 4.7-1.7 4.9-4.9.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.2-1.7-4.7-4.9-4.9C14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.7 0 3.6.1 2.3.1 3.4 1.2 3.5 3.5.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.3-1.2 3.4-3.5 3.5-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.3-.1-3.4-1.2-3.5-3.5-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.3 1.2-3.4 3.5-3.5.9-.1 1.2-.1 3.6-.1Z" },
  { name: "Twitch", d: "M4 3 3 6.5V19h4.2v2.5H10L12.5 19H16l5-5V3H4Zm15 10.2-2.6 2.6h-4.2l-2.2 2.2v-2.2H7.5V4.7H19v8.5ZM16.5 7.5H15v4.2h1.5V7.5Zm-4.2 0h-1.5v4.2h1.5V7.5Z" },
  { name: "YouTube", d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
  { name: "Podcasts", d: "M12 2a8 8 0 0 0-3 15.4V16a3 3 0 1 1 6 0v1.4A8 8 0 0 0 12 2Zm0 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM10.5 18h3l-.5 4h-2l-.5-4Z" },
  { name: "Email", d: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.2 7v10.5h15.6V7L12 12.2Z" },
];

export default function MarketingFooter() {
  return (
    <footer id="marketing-footer" className="bg-white pb-6">
      <div className="mx-auto max-w-[1600px] rounded-[28px] bg-[#0f141a] px-8 pb-10 pt-12 text-white md:px-14">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/login" className="rounded-full bg-white px-5 py-[9px] text-[13px] font-semibold text-[#0f141a] transition-colors hover:bg-[#e9ebed]">
            Create an AWS account
          </Link>
          <button className="flex items-center gap-2 rounded-full border border-[#8d99a8] px-4 py-[8px] text-[13px] hover:border-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
            English <ChevronDown size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-[12px] font-semibold text-white">{col.heading}</h4>
              <ul className="space-y-[10px]">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-[11px] text-[#b6bec9] hover:text-white hover:underline">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="#marketing-header" className="flex items-center gap-1 text-[12px] text-[#b6bec9] hover:text-white">Back to top <span aria-hidden>↑</span></a>
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t border-[#2e3a4a] pt-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[760px]">
            <p className="text-[10px] leading-relaxed text-[#b6bec9]">
              Amazon is an equal opportunity employer and does not discriminate on the basis of protected veteran status, disability or other legally protected status. Veterans, military spouses, and people with disabilities are encouraged to apply.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-[#b6bec9]">
              <a href="#" className="hover:text-white hover:underline">Privacy</a>
              <a href="#" className="hover:text-white hover:underline">Site terms</a>
              <a href="#" className="hover:text-white hover:underline">Your Privacy Choices</a>
              <span>© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <a key={s.name} href="#" aria-label={s.name} className="text-white opacity-90 hover:opacity-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
