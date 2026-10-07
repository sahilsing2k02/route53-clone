"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Database, 
  Layers, 
  Globe, 
  ArrowRight,
  Code2,
  Info,
  Server
} from "lucide-react";

export default function AssignmentModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [interceptedUrl, setInterceptedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"summary" | "scope" | "criteria">("summary");

  useEffect(() => {
    setMounted(true);

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Allow normal internal page navigation and legitimate in-page section jump anchors
      if (
        href.startsWith("/") || 
        href.startsWith("#overview") ||
        href.startsWith("#customers") ||
        href.startsWith("#feedback") ||
        href.startsWith("#get-started") ||
        href.startsWith("#marketing-header")
      ) {
        return;
      }

      // Intercept external AWS / Amazon / off-site links or placeholder '#'
      const isExternalAws = 
        href.includes("amazon.com") || 
        href.includes("aws.") || 
        href.includes("awsstatic.com") ||
        href.includes("youtube.com") ||
        href.startsWith("http://") || 
        href.startsWith("https://");

      const isDummyHash = href === "#";

      if (isExternalAws || isDummyHash) {
        e.preventDefault();
        e.stopPropagation();
        setInterceptedUrl(href === "#" ? "https://aws.amazon.com/route53/" : href);
        setIsOpen(true);
      }
    };

    // Intercept third-party browser extension errors (e.g. Bitdefender M_ID error) so they don't break Next dev overlay
    const handleError = (e: ErrorEvent) => {
      const isExtension =
        (e.filename && (e.filename.includes("chrome-extension://") || e.filename.includes("moz-extension://"))) ||
        (e.message && (e.message.includes("M_ID") || e.message.includes("bis_")));
      if (isExtension) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      const isExtension =
        (e.reason?.stack && (e.reason.stack.includes("chrome-extension://") || e.reason.stack.includes("moz-extension://"))) ||
        (e.reason?.message && (e.reason.message.includes("M_ID") || e.reason.message.includes("bis_")));
      if (isExtension) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection, true);

    // Capture clicks before native browser navigation initiates
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#d5dbdb] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2e3a4a] bg-[#232F3E] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#EC7211] font-bold text-white shadow-sm">
              <Globe size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight">AWS Route 53 Prototype</h3>
                <span className="rounded bg-[#EC7211]/20 px-2 py-0.5 text-[11px] font-semibold text-[#f8a867] border border-[#EC7211]/40">
                  MOCK REPLICA • ASSIGNMENT
                </span>
              </div>
              <p className="text-[12px] text-[#b6bec9]">Full-Stack Technical Evaluation Project</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded p-1.5 text-[#b6bec9] hover:bg-[#344254] hover:text-white transition-colors"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informative Notice Banner */}
        <div className="border-b border-[#f3c88a] bg-[#fff8eb] px-6 py-3.5 text-[#734300]">
          <div className="flex items-start gap-3">
            <Info size={19} className="mt-0.5 flex-shrink-0 text-[#EC7211]" />
            <div className="text-[13px] leading-relaxed">
              <p className="font-semibold text-[#874d00]">
                External Link Intercepted: Prototype Notice
              </p>
              <p className="mt-0.5 text-[#6c4004]">
                You clicked an external destination (<code className="rounded bg-[#ffeac2] px-1.5 py-0.5 text-[12px] font-mono text-[#4e2d00]">{interceptedUrl}</code>). 
                External redirection was paused so you can stay in this interactive environment.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e9ebed] bg-[#f9fafb] px-6">
          <button
            onClick={() => setActiveTab("summary")}
            className={`border-b-2 py-3 px-4 text-[13px] font-semibold transition-colors ${
              activeTab === "summary"
                ? "border-[#EC7211] text-[#EC7211]"
                : "border-transparent text-[#414d5c] hover:text-[#0f141a]"
            }`}
          >
            Project Context &amp; Purpose
          </button>
          <button
            onClick={() => setActiveTab("scope")}
            className={`border-b-2 py-3 px-4 text-[13px] font-semibold transition-colors ${
              activeTab === "scope"
                ? "border-[#EC7211] text-[#EC7211]"
                : "border-transparent text-[#414d5c] hover:text-[#0f141a]"
            }`}
          >
            Implemented Features
          </button>
          <button
            onClick={() => setActiveTab("criteria")}
            className={`border-b-2 py-3 px-4 text-[13px] font-semibold transition-colors ${
              activeTab === "criteria"
                ? "border-[#EC7211] text-[#EC7211]"
                : "border-transparent text-[#414d5c] hover:text-[#0f141a]"
            }`}
          >
            Evaluation &amp; Architecture
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-[14px] leading-relaxed text-[#0f141a]">
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#d5dbdb] bg-[#fcfcfd] p-4.5">
                <h4 className="text-[15px] font-bold text-[#0f141a]">
                  Why this application was built
                </h4>
                <p className="mt-2 text-[#414d5c] text-[13.5px] leading-relaxed">
                  This application was developed as a technical challenge from a startup to construct an end-to-end, high-fidelity mock clone of 
                  <strong> AWS Route 53</strong>. Rather than just creating static markup, the mandate was to replicate the authentic Route 53 console experience,
                  data density, and DNS configuration workflows, powered by a live RESTful API and persistent storage.
                </p>
              </div>

              {/* Stack Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-[#e9ebed] p-3.5 bg-white shadow-xs">
                  <div className="font-semibold text-[#0972d3] flex items-center gap-1.5 text-[13px]">
                    <Layers size={15} /> Next.js Frontend
                  </div>
                  <div className="mt-1 font-medium text-[13px]">TypeScript + Tailwind</div>
                  <p className="text-[12px] text-[#545b64] mt-1">
                    Accurate AWS console tokens (`#232F3E`, `#EC7211`), global `Alt+S` search, toast notifications, and modular component hierarchy.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e9ebed] p-3.5 bg-white shadow-xs">
                  <div className="font-semibold text-[#1D8102] flex items-center gap-1.5 text-[13px]">
                    <Code2 size={15} /> FastAPI Backend
                  </div>
                  <div className="mt-1 font-medium text-[13px]">Python REST API</div>
                  <p className="text-[12px] text-[#545b64] mt-1">
                    Complete RESTful endpoints with Pydantic validation, structured CRUD architecture, and interactive Swagger documentation at <code>/docs</code>.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e9ebed] p-3.5 bg-white shadow-xs">
                  <div className="font-semibold text-[#7300e5] flex items-center gap-1.5 text-[13px]">
                    <Database size={15} /> Relational DB
                  </div>
                  <div className="mt-1 font-medium text-[13px]">SQLite + SQLAlchemy</div>
                  <p className="text-[12px] text-[#545b64] mt-1">
                    Full persistent storage with foreign keys and cascade deletions (deleting a hosted zone cleanly deletes all associated DNS records).
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[#f0fbff] border border-[#bce3f7] p-3.5 text-[13px] text-[#00527c] flex items-start gap-2.5">
                <Server size={16} className="mt-0.5 flex-shrink-0 text-[#0972d3]" />
                <div>
                  <strong>Live Prototype Ready:</strong> You can enter the mock console to create hosted zones, manage 9 DNS record types (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA), perform bulk deletions, and export zone records as JSON.
                </div>
              </div>
            </div>
          )}

          {activeTab === "scope" && (
            <div className="space-y-3.5">
              <div className="rounded-lg border border-[#e9ebed] p-3.5">
                <h5 className="font-semibold text-[13.5px] text-[#0f141a] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1D8102]" /> 
                  1. Mocked Authentication &amp; Sessions
                </h5>
                <p className="mt-1 text-[13px] text-[#545b64]">
                  Simulates AWS IAM authentication with persistent cookie-based sessions, account switcher, and secure dashboard redirection.
                </p>
              </div>

              <div className="rounded-lg border border-[#e9ebed] p-3.5">
                <h5 className="font-semibold text-[13.5px] text-[#0f141a] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1D8102]" /> 
                  2. Hosted Zones Management (Full CRUD)
                </h5>
                <p className="mt-1 text-[13px] text-[#545b64]">
                  Real-time creation, viewing, instant search filtering, editing, single and bulk deletion of hosted zones. Automatic initialization of default SOA and NS records.
                </p>
              </div>

              <div className="rounded-lg border border-[#e9ebed] p-3.5">
                <h5 className="font-semibold text-[13.5px] text-[#0f141a] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1D8102]" /> 
                  3. DNS Resource Records (Full CRUD)
                </h5>
                <p className="mt-1 text-[13px] text-[#545b64]">
                  Comprehensive management of 9 standard Route 53 DNS types: <strong>A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA</strong> with TTL, record values, and routing validation.
                </p>
              </div>

              <div className="rounded-lg border border-[#e9ebed] p-3.5">
                <h5 className="font-semibold text-[13.5px] text-[#0f141a] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1D8102]" /> 
                  4. Bonus &amp; UX Enhancements
                </h5>
                <p className="mt-1 text-[13px] text-[#545b64]">
                  Zone export to structured JSON, bulk delete operations, global <kbd className="rounded border border-[#c6c6cd] bg-[#f2f3f3] px-1 py-0.5 font-mono text-[11px]">Alt + S</kbd> shortcut, and realistic AWS placeholder sections (Traffic Policies, Resolver, Health Checks).
                </p>
              </div>
            </div>
          )}

          {activeTab === "criteria" && (
            <div className="space-y-3.5">
              <div className="rounded-lg border border-[#d5dbdb] p-4 bg-[#fafbfc]">
                <h5 className="font-bold text-[14px] text-[#0f141a]">Evaluation Criteria Alignment</h5>
                <ul className="mt-2.5 space-y-2.5 text-[13px] text-[#414d5c]">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#EC7211]">•</span>
                    <span><strong>UI/UX Fidelity:</strong> Meticulously matches AWS console hex codes, typography weights, layout structure, and dense information tables.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#EC7211]">•</span>
                    <span><strong>Frontend Engineering:</strong> Next.js App Router, TypeScript types, React Context state management, and zero layout shifts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#EC7211]">•</span>
                    <span><strong>Backend Architecture:</strong> Clean separation of concerns with FastAPI (routers in <code>main.py</code>, database layer in <code>database.py</code>, schema validation in <code>schemas.py</code>, queries in <code>crud.py</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#EC7211]">•</span>
                    <span><strong>Database Integrity:</strong> SQLite relational schema with foreign key enforcement and automated cascade cleanups.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e9ebed] bg-[#f9fafb] px-6 py-4">
          <div className="flex items-center gap-2 text-[12px] text-[#545b64]">
            {interceptedUrl.startsWith("http") && (
              <a 
                href={interceptedUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-[#0972d3] hover:underline"
              >
                Proceed to real external AWS link <ExternalLink size={12} />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#8d99a8] bg-white px-5 py-2 text-[13px] font-semibold text-[#0f141a] transition-colors hover:bg-[#f2f3f3]"
            >
              Stay on Page
            </button>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-full bg-[#EC7211] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#d6650d] shadow-sm"
            >
              Explore Route 53 Console <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
