
// "use client";

// import {
//   ArrowRight,
//   Bot,
//   CheckCircle2,
//   MessageCircle,
//   Phone,
//   Sparkles,
// } from "lucide-react";

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-[90vh] overflow-hidden bg-[#08090c] px-6 text-white lg:px-8">
//       {/* Ambient background */}
//       <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.09] blur-[150px]" />

//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.025]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <div className="relative mx-auto flex max-w-7xl flex-col items-center pb-20 pt-28 lg:min-h-[90vh] lg:flex-row lg:gap-16 lg:pb-16 lg:pt-32">
//         {/* LEFT */}
//         <div className="w-full max-w-2xl lg:w-[52%]">
//           {/* Badge */}
//           <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/60">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
//             </span>

//             AI SALES & RECEPTIONIST PLATFORM
//           </div>

//           {/* Heading */}
//           <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
//             Turn every
//             <span className="block">conversation into</span>

//             <span className="block text-white/35">
//               a qualified lead.
//             </span>
//           </h1>

//           {/* Description */}
//           <p className="mt-7 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
//             AI that answers your calls, talks to customers across WhatsApp,
//             Instagram and Facebook, qualifies prospects, and sends your sales
//             team the leads that matter.
//           </p>

//           {/* CTA */}
//           <div className="mt-9 flex flex-col gap-3 sm:flex-row">
//             <button className="group flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
//               See AI in action
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </button>

//             <button className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-6 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white">
//               <Phone className="h-4 w-4" />
//               Talk to our AI
//             </button>
//           </div>

//           {/* Trust points */}
//           <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
//             {[
//               "24/7 response",
//               "Multi-channel",
//               "Automatic lead qualification",
//             ].map((item) => (
//               <div
//                 key={item}
//                 className="flex items-center gap-2 text-xs text-white/40"
//               >
//                 <CheckCircle2 className="h-3.5 w-3.5 text-blue-400/70" />
//                 {item}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT — AI conversation visual */}
//         <div className="relative mt-20 w-full lg:mt-0 lg:w-[48%]">
//           {/* Glow */}
//           <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[110px]" />

//           <div className="relative mx-auto max-w-[500px]">
//             {/* Main interface */}
//             <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/50">
//               {/* Header */}
//               <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
//                     <Bot className="h-5 w-5 text-blue-400" />

//                     <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0f14] bg-green-400" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-medium text-white/80">
//                       AI Sales Agent
//                     </p>
//                     <p className="mt-0.5 text-[10px] text-green-400/80">
//                       Online · Responding instantly
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   <span className="h-7 w-7 rounded-lg border border-white/[0.07] bg-white/[0.025]" />
//                   <span className="h-7 w-7 rounded-lg border border-white/[0.07] bg-white/[0.025]" />
//                 </div>
//               </div>

//               {/* Conversation */}
//               <div className="space-y-5 p-5">
//                 {/* Incoming */}
//                 <div className="flex items-end gap-2">
//                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
//                     <MessageCircle className="h-3.5 w-3.5 text-white/40" />
//                   </div>

//                   <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
//                     <p className="text-xs leading-5 text-white/65">
//                       Hi, I&apos;m looking for a 3 BHK in Noida. My budget is
//                       around ₹1.5 crore.
//                     </p>

//                     <p className="mt-2 text-[9px] text-white/25">
//                       WhatsApp · Just now
//                     </p>
//                   </div>
//                 </div>

//                 {/* AI */}
//                 <div className="flex justify-end">
//                   <div className="max-w-[82%] rounded-2xl rounded-br-md bg-blue-600/10 px-4 py-3 ring-1 ring-blue-500/10">
//                     <div className="mb-2 flex items-center gap-2">
//                       <Bot className="h-3 w-3 text-blue-400" />
//                       <span className="text-[9px] font-medium text-blue-400">
//                         AI AGENT
//                       </span>
//                     </div>

//                     <p className="text-xs leading-5 text-white/70">
//                       Absolutely. I can help with that. Are you looking for
//                       the property primarily for end-use or investment?
//                     </p>
//                   </div>
//                 </div>

//                 {/* User */}
//                 <div className="flex items-end gap-2">
//                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
//                     <MessageCircle className="h-3.5 w-3.5 text-white/40" />
//                   </div>

//                   <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
//                     <p className="text-xs text-white/65">
//                       For my family. Need possession soon.
//                     </p>
//                   </div>
//                 </div>

//                 {/* AI typing */}
//                 <div className="flex items-center gap-2 px-1">
//                   <div className="flex gap-1">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-400/60" />
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-400/40" />
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-400/20" />
//                   </div>

//                   <span className="text-[10px] text-white/25">
//                     AI is qualifying the lead...
//                   </span>
//                 </div>
//               </div>

//               {/* Lead captured */}
//               <div className="border-t border-white/[0.07] bg-white/[0.018] p-5">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <Sparkles className="h-3.5 w-3.5 text-blue-400" />

//                       <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
//                         Lead intelligence
//                       </span>
//                     </div>

//                     <p className="mt-2 text-sm font-medium text-white/80">
//                       Qualified prospect
//                     </p>
//                   </div>

//                   <span className="rounded-full border border-green-400/10 bg-green-400/[0.06] px-2.5 py-1 text-[10px] font-medium text-green-400">
//                     HOT LEAD
//                   </span>
//                 </div>

//                 <div className="mt-4 grid grid-cols-3 gap-2">
//                   <LeadData label="Budget" value="₹1.5 Cr" />
//                   <LeadData label="BHK" value="3 BHK" />
//                   <LeadData label="Intent" value="End-use" />
//                 </div>
//               </div>
//             </div>

//             {/* Floating call card */}
//             <div className="absolute -bottom-7 -left-5 hidden w-48 rounded-2xl border border-white/10 bg-[#111318] p-4 shadow-xl shadow-black/40 sm:block">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10">
//                   <Phone className="h-3.5 w-3.5 text-green-400" />
//                 </div>

//                 <div>
//                   <p className="text-[10px] font-medium text-white/70">
//                     AI Receptionist
//                   </p>
//                   <p className="text-[9px] text-green-400/70">
//                     Call answered
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Floating lead card */}
//             <div className="absolute -right-5 -top-6 hidden w-44 rounded-2xl border border-white/10 bg-[#111318] p-4 shadow-xl shadow-black/40 sm:block">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400/10">
//                   <CheckCircle2 className="h-4 w-4 text-blue-400" />
//                 </div>

//                 <div>
//                   <p className="text-[10px] font-medium text-white/70">
//                     Lead captured
//                   </p>
//                   <p className="text-[9px] text-white/30">
//                     Added to CRM
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom statement */}
//       <div className="relative mx-auto max-w-7xl border-t border-white/[0.06] py-6">
//         <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//           <p className="text-xs text-white/25">
//             One AI layer across your customer conversations.
//           </p>

//           <div className="flex items-center gap-5 text-[10px] text-white/25">
//             <span>WhatsApp</span>
//             <span>Instagram</span>
//             <span>Facebook</span>
//             <span>Web</span>
//             <span>Voice</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function LeadData({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
//       <p className="text-[9px] text-white/25">{label}</p>
//       <p className="mt-1 text-[10px] font-medium text-white/65">{value}</p>
//     </div>
//   );
// }



"use client";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#08090c] px-6 pb-24 text-white lg:px-8 lg:pb-12 lg:pt-14">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/[0.10] blur-[150px]" />


      <div className="relative mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>

            AI SALES & CUSTOMER CONVERSATION PLATFORM
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[82px]">
            Turn conversations
            <span className="block">
              into{" "}
              <span className="text-white/35">real opportunities.</span>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
            AI that talks to your customers across calls, WhatsApp, Instagram,
            Facebook and web — answering questions, capturing intent and
            qualifying every lead automatically.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="group flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:bg-white/90">
              See AI in action
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-7 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white">
              <Phone className="h-4 w-4" />
              Talk to our AI
            </button>
          </div>


        </div>

        {/* ================= MAIN SHOWCASE ================= */}
        <div className="relative mx-auto mt-20 max-w-5xl sm:mt-4">
          {/* Large glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />

          {/* Floating channel labels */}
          <div className="absolute -left-5 top-20 z-20 hidden rounded-2xl border border-white/10 bg-[#111318]/90 px-4 py-3 shadow-xl backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-400/10">
                <MessageCircle className="h-4 w-4 text-green-400" />
              </div>

              <div>
                <p className="text-[10px] font-medium text-white/70">
                  WhatsApp
                </p>
                <p className="text-[9px] text-white/30">
                  Lead conversation
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 top-40 z-20 hidden rounded-2xl border border-white/10 bg-[#111318]/90 px-4 py-3 shadow-xl backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-400/10">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>

              <div>
                <p className="text-[10px] font-medium text-white/70">
                  AI Receptionist
                </p>
                <p className="text-[9px] text-green-400/70">
                  Call answered
                </p>
              </div>
            </div>
          </div>

          {/* Browser / Product frame */}
         {/* Browser / Product frame */}
<div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/50">


  {/* REAL DASHBOARD IMAGE */}
  
</div>
<div className="relative overflow-hidden max-w-7xl">
    <img
      src="https://cdn.dribbble.com/userupload/46598325/file/006d2d6da8d2eddb209a0ad12d3fc6c3.png?resize=1504x1128&vertical=center.png"
      alt="AI Sales Dashboard"
      className="w-full"
    />
  </div>
      
        </div>

      
      </div>
    </section>
  );
}

function Data({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[8px] uppercase tracking-wider text-white/25">
        {label}
      </p>
      <p className="mt-1 text-[10px] font-medium text-white/65">{value}</p>
    </div>
  );
}
