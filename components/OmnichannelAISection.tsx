
// "use client";

// import {
//   ArrowRight,
//   Check,
//   Facebook,
//   Instagram,
//   MessageCircle,
//   Users,
//   Zap,
// } from "lucide-react";

// const channels = [
//   {
//     name: "WhatsApp",
//     description: "Talk to prospects instantly",
//     icon: MessageCircle,
//   },
//   {
//     name: "Instagram",
//     description: "Capture leads from DMs",
//     icon: Instagram,
//   },
//   {
//     name: "Facebook",
//     description: "Respond to Messenger leads",
//     icon: Facebook,
//   },
// ];

// export default function OmnichannelAISection() {
//   return (
//     <section className="overflow-hidden bg-[#08090c] px-6 py-24 text-white lg:px-8 lg:py-32">
//       <div className="mx-auto max-w-7xl">
//         {/* Heading */}
//         <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
//           <div>
//             <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/60">
//               <Zap className="h-3.5 w-3.5 text-blue-400" />
//               OMNICHANNEL AI
//             </div>

//             <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
//               Every conversation.
//               <span className="block text-white/40">
//                 One intelligent system.
//               </span>
//             </h2>
//           </div>

//           <p className="max-w-xl text-base leading-7 text-white/50 lg:pb-1 lg:text-lg">
//             Your AI talks to customers wherever they reach you. From WhatsApp
//             and Instagram DMs to Facebook Messenger and web chat, every
//             conversation can become a qualified lead.
//           </p>
//         </div>

//         {/* Main visual */}
//         <div className="relative mt-16 overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0f14]">
//           {/* Background grid */}
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.035]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
//               backgroundSize: "48px 48px",
//             }}
//           />

//           <div className="relative grid min-h-[540px] lg:grid-cols-[1fr_1.1fr]">
//             {/* Left side */}
//             <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
//               <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
//                 Meet your AI sales team
//               </p>

//               <h3 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
//                 Your leads are already talking.
//                 <span className="text-white/40">
//                   {" "}
//                   Make sure someone answers.
//                 </span>
//               </h3>

//               <p className="mt-5 max-w-lg text-sm leading-6 text-white/45 sm:text-base">
//                 Our AI responds to incoming conversations, understands what
//                 prospects want, asks the right questions, and captures the
//                 information your sales team actually needs.
//               </p>

//               <div className="mt-8 space-y-3">
//                 {[
//                   "Respond instantly to new enquiries",
//                   "Qualify leads automatically",
//                   "Capture budget, intent & requirements",
//                   "Push qualified leads into your CRM",
//                 ].map((item) => (
//                   <div
//                     key={item}
//                     className="flex items-center gap-3 text-sm text-white/65"
//                   >
//                     <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
//                       <Check className="h-3 w-3 text-blue-400" />
//                     </span>
//                     {item}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right visual */}
//             <div className="relative flex items-center justify-center p-8 sm:p-12">
//               {/* Glow */}
//               <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />

//               <div className="relative w-full max-w-xl">
//                 {/* Central AI */}
//                 <div className="relative z-20 mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-blue-400/20 bg-[#11151d] shadow-2xl shadow-blue-900/20">
//                   <div className="absolute inset-3 rounded-2xl border border-white/5" />

//                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10">
//                     <Zap className="h-7 w-7 text-blue-400" />
//                   </div>

//                   <span className="absolute -bottom-3 rounded-full border border-white/10 bg-[#0d0f14] px-3 py-1 text-[10px] font-medium text-white/60">
//                     AI ENGINE
//                   </span>
//                 </div>

//                 {/* Connecting lines */}
//                 <div className="absolute left-1/2 top-1/2 h-[1px] w-[80%] -translate-x-1/2 rotate-[18deg] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

//                 <div className="absolute left-1/2 top-1/2 h-[1px] w-[80%] -translate-x-1/2 rotate-[-18deg] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

//                 {/* Channels */}
//                 <div className="mt-20 grid grid-cols-3 gap-3">
//                   {channels.map((channel) => {
//                     const Icon = channel.icon;

//                     return (
//                       <div
//                         key={channel.name}
//                         className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center transition duration-300 hover:border-white/20 hover:bg-white/[0.06]"
//                       >
//                         <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
//                           <Icon className="h-5 w-5 text-white/70" />
//                         </div>

//                         <p className="mt-3 text-xs font-medium text-white/80">
//                           {channel.name}
//                         </p>

//                         <p className="mt-1 text-[10px] leading-4 text-white/35">
//                           {channel.description}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Lead captured card */}
//                 <div className="mx-auto mt-5 flex max-w-[360px] items-center gap-3 rounded-2xl border border-green-400/10 bg-green-400/[0.035] px-4 py-3">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-400/10">
//                     <Users className="h-4 w-4 text-green-400" />
//                   </div>

//                   <div className="min-w-0">
//                     <p className="text-xs font-medium text-white/75">
//                       Qualified lead captured
//                     </p>
//                     <p className="mt-0.5 truncate text-[10px] text-white/35">
//                       Budget • Location • Intent • Timeline
//                     </p>
//                   </div>

//                   <span className="ml-auto shrink-0 text-[10px] font-medium text-green-400">
//                     +1 Lead
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom stats */}
//         <div className="mt-5 grid gap-4 sm:grid-cols-3">
//           <InfoCard
//             number="01"
//             title="Capture"
//             text="Turn conversations across your channels into actionable leads."
//           />

//           <InfoCard
//             number="02"
//             title="Understand"
//             text="AI extracts intent, requirements, budget and buying timeline."
//           />

//           <InfoCard
//             number="03"
//             title="Convert"
//             text="Route qualified prospects to your sales team at the right moment."
//           />
//         </div>

//         {/* CTA */}
//         <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center">
//           <p className="text-sm text-white/40">
//             One inbox. Every channel. Smarter conversations.
//           </p>

//           <button className="group flex items-center gap-2 text-sm font-medium text-white transition hover:text-blue-400">
//             Explore AI conversations
//             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// function InfoCard({
//   number,
//   title,
//   text,
// }: {
//   number: string;
//   title: string;
//   text: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
//       <span className="text-xs font-medium text-blue-400">{number}</span>

//       <h4 className="mt-5 text-base font-medium text-white">{title}</h4>

//       <p className="mt-2 text-sm leading-6 text-white/40">{text}</p>
//     </div>
//   );
// }



import { ArrowDown, Bot, CheckCircle2, Sparkles } from "lucide-react";

const channels = [
  {
    name: "WhatsApp",
    slug: "whatsapp",
    color: "25D366",
    description: "Talk to prospects instantly",
    detail: "AI handles incoming WhatsApp conversations and captures enquiry details.",
  },
  {
    name: "Instagram",
    slug: "instagram",
    color: "E4405F",
    description: "Capture leads from DMs",
    detail: "Turn Instagram conversations and DMs into qualified business leads.",
  },
  {
    name: "Facebook",
    slug: "facebook",
    color: "1877F2",
    description: "Respond to Messenger leads",
    detail: "Capture enquiries from Facebook conversations and route them into your system.",
  },
];

export default function LeadFlow() {
  return (
    <section className="w-full bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1C49B3]/15 bg-[#1C49B3]/5 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#1C49B3]">
            <Sparkles className="h-3.5 w-3.5" />
            OMNICHANNEL AI
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Every conversation.
            <span className="block text-[#1C49B3]">
              One intelligent lead flow.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
            Bring conversations from your social channels into one intelligent
            system that understands, qualifies and routes every enquiry.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="relative mt-20">
          {/* Central LEADS node */}
          <div className="relative z-30 mx-auto flex w-fit flex-col items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-[#1C49B3]/20 bg-white px-7 py-4 shadow-[0_15px_45px_rgba(28,73,179,0.12)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C49B3] shadow-lg shadow-[#1C49B3]/20">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400">
                  CENTRAL SYSTEM
                </p>
                <p className="mt-0.5 text-lg font-bold tracking-tight text-[#1C49B3]">
                  LEADS
                </p>
              </div>
            </div>

            {/* Down arrow */}
            <div className="mt-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#F5B942]/40 bg-[#F5B942]/10 text-[#B47B00]">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Desktop connector system */}
          <div className="pointer-events-none absolute left-1/2 top-[104px] hidden h-10 w-px -translate-x-1/2 bg-[#1C49B3]/35 md:block" />

          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[144px] hidden h-px bg-[#1C49B3]/25 md:block" />

          {/* Channel cards */}
          <div className="relative mt-10 grid gap-16 md:grid-cols-3 md:gap-6 md:pt-12">
            {channels.map((channel, index) => (
              <div key={channel.name} className="relative">
                {/* Vertical branch */}
                <div className="pointer-events-none absolute left-1/2 -top-12 hidden h-12 w-px -translate-x-1/2 bg-[#1C49B3]/35 md:block" />

                {/* Junction */}
                <div className="pointer-events-none absolute left-1/2 -top-[51px] z-20 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-[#F5B942] shadow-[0_0_0_4px_rgba(245,185,66,0.12)] md:block" />

                {/* Card */}
                <div className="group relative h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#1C49B3]/25 hover:shadow-[0_24px_60px_rgba(28,73,179,0.12)] sm:p-8">
                  {/* Accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1C49B3] via-[#1C49B3] to-[#F5B942]" />

                  <div className="flex items-start justify-between gap-4">
                    {/* Large brand icon */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-[24px] border border-slate-100 bg-slate-50 shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={`https://cdn.simpleicons.org/${channel.slug}/${channel.color}`}
                        alt={`${channel.name} logo`}
                        className="h-14 w-14 object-contain"
                      />
                    </div>

                    <span className="rounded-full bg-[#F5B942]/12 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#9A6A00]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold tracking-tight text-slate-950">
                    {channel.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#1C49B3]">
                    {channel.description}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {channel.detail}
                  </p>

                  <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-[#1C49B3]" />
                    Lead captured automatically
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom explanation */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl border border-[#1C49B3]/10 bg-[#F7F9FC] px-6 py-5 text-center sm:flex-row sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5B942]/15">
              <Bot className="h-5 w-5 text-[#B47B00]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                One place for every enquiry
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                AI understands the conversation, collects the important
                information and sends qualified leads to your sales workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}