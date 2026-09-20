// "use client";

// import { ArrowRight, Bot, Phone, Sparkles, Clock3, MessageSquare, Zap } from "lucide-react";

// export default function AIReceptionistPage() {
//   return (
//     <main className="min-h-screen bg-[#08090c] text-white">
//       {/* Hero */}
//       <section className="relative overflow-hidden">
//         {/* Background glow */}
//         <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />

//         <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-8 lg:pb-28 lg:pt-36">
//           <div className="mx-auto max-w-4xl text-center">
//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
//               <Sparkles className="h-4 w-4 text-blue-400" />
//               AI Receptionist
//             </div>

//             <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
//               Your business,
//               <span className="block bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
//                 always ready to answer.
//               </span>
//             </h1>

//             <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
//               An AI receptionist that answers calls, handles customer
//               questions, captures leads, and keeps your business available
//               around the clock.
//             </p>

//             <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
//               <button className="group flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
//                 See how it works
//                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//               </button>

//               <button className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition hover:bg-white/[0.08]">
//                 <Phone className="h-4 w-4" />
//                 Talk to AI Receptionist
//               </button>
//             </div>
//           </div>

//           {/* Video */}
//           <div className="relative mx-auto mt-16 max-w-6xl">
//             <div className="absolute -inset-4 rounded-[32px] bg-blue-500/10 blur-3xl" />

//             <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111318] shadow-2xl shadow-black/40">
//               {/* <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
//                 <span className="h-2 w-2 rounded-full bg-green-400" />
//                 AI Receptionist Live
//               </div> */}

//               <video
//                 className="aspect-video w-full object-cover"
//                 src="https://www.pexels.com/download/video/7706945/"
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 controls={false}
//               />

//               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

//               <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-white">
//                     Every call handled.
//                   </p>
//                   <p className="mt-1 text-xs text-white/50">
//                     Without putting your customers on hold.
//                   </p>
//                 </div>

//                 <div className="hidden rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md sm:block">
//                   24 / 7 availability
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }

// function FeatureCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:border-white/15 hover:bg-white/[0.045]">
//       <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-blue-400">
//         {icon}
//       </div>

//       <h3 className="text-lg font-medium">{title}</h3>

//       <p className="mt-3 text-sm leading-6 text-white/45">
//         {description}
//       </p>
//     </div>
//   );
// }

// function Step({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7">
//       <span className="text-sm font-medium text-blue-400">{number}</span>

//       <h3 className="mt-8 text-xl font-medium">{title}</h3>

//       <p className="mt-3 text-sm leading-6 text-white/45">
//         {description}
//       </p>
//     </div>
//   );
// }




//       <section className="border-y border-white/[0.06] bg-[#0c0d11]">
//         <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
//           <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
//             <div>
//               <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
//                 Built for your business
//               </p>

//               <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
//                 More than answering calls.
//                 <span className="text-white/40">
//                   {" "}
//                   It works like your front desk.
//                 </span>
//               </h2>
//             </div>

//             <p className="max-w-2xl text-base leading-7 text-white/50">
//               Your AI receptionist can greet callers naturally, understand
//               what they need, answer common questions, collect important
//               information, and route conversations to the right place.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
//         <div className="mb-14 max-w-2xl">
//           <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
//             What it can do
//           </p>

//           <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//             A receptionist that never clocks out.
//           </h2>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <FeatureCard
//             icon={<Phone />}
//             title="Answer every call"
//             description="Handle incoming calls instantly so customers are never left waiting."
//           />

//           <FeatureCard
//             icon={<MessageSquare />}
//             title="Natural conversations"
//             description="Understand customer questions and respond conversationally instead of using rigid menus."
//           />

//           <FeatureCard
//             icon={<Bot />}
//             title="Handle routine tasks"
//             description="Collect customer details, answer FAQs, qualify leads, and handle repetitive requests."
//           />

//           <FeatureCard
//             icon={<Clock3 />}
//             title="Available 24/7"
//             description="Your business stays responsive outside office hours, weekends, and holidays."
//           />

//           <FeatureCard
//             icon={<Zap />}
//             title="Instant response"
//             description="Customers get an immediate response without waiting for someone from your team."
//           />

//           <FeatureCard
//             icon={<Sparkles />}
//             title="Built around your business"
//             description="Train the receptionist around your services, information, workflows, and customer needs."
//           />
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="bg-[#0c0d11]">
//         <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
//           <div className="mx-auto max-w-2xl text-center">
//             <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
//               Simple workflow
//             </p>

//             <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//               From incoming call to useful action.
//             </h2>
//           </div>

//           <div className="mt-16 grid gap-5 md:grid-cols-3">
//             <Step
//               number="01"
//               title="Customer calls"
//               description="A customer calls your business just like they normally would."
//             />

//             <Step
//               number="02"
//               title="AI understands"
//               description="The receptionist understands the customer's intent and responds naturally."
//             />

//             <Step
//               number="03"
//               title="Action happens"
//               description="The AI collects information, answers questions, qualifies the lead, or routes the call."
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="px-6 py-24 lg:px-8">
//         <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-8 py-16 text-center sm:px-12">
//           <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />

//           <div className="relative">
//             <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
//               <Bot className="h-6 w-6 text-blue-400" />
//             </div>

//             <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//               Let AI handle the front desk.
//             </h2>

//             <p className="mx-auto mt-4 max-w-xl text-white/50">
//               Give your customers a faster response while your team focuses
//               on the conversations that actually need them.
//             </p>

//             <button className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
//               Get started
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </button>
//           </div>
//         </div>
//       </section>

"use client";

import {
  ArrowRight,
  Bot,
  Phone,
  Sparkles,
  Clock3,
  MessageSquare,
  Zap,
} from "lucide-react";

export default function AIReceptionistPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#1C49B3]/10 blur-[140px]" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-8 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1C49B3]/15 bg-[#1C49B3]/5 px-4 py-2 text-sm text-[#1C49B3]">
              <Sparkles className="h-4 w-4" />
              AI Receptionist
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-7xl">
              Your business,
              <span className="block bg-gradient-to-r from-[#1C49B3] via-[#2864D7] to-[#647FF2] bg-clip-text text-transparent">
                always ready to answer.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              An AI receptionist that answers calls, handles customer
              questions, captures leads, and keeps your business available
              around the clock.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="group flex h-12 items-center gap-2 rounded-full bg-[#1C49B3] px-6 text-sm font-semibold text-white shadow-lg shadow-[#1C49B3]/20 transition hover:bg-[#163D99]">
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#1C49B3]/30 hover:bg-[#1C49B3]/5">
                <Phone className="h-4 w-4 text-[#1C49B3]" />
                Talk to AI Receptionist
              </button>
            </div>
          </div>

          {/* ================= VIDEO ================= */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="absolute -inset-4 rounded-[32px] bg-[#1C49B3]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-900/10">

              <video
                className="aspect-video w-full object-cover"
                src="https://www.pexels.com/download/video/7706945/"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />

              {/* Video overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/60 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Every call handled.
                  </p>

                  <p className="mt-1 text-xs text-white/70">
                    Without putting your customers on hold.
                  </p>
                </div>

                <div className="hidden rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md sm:block">
                  24 / 7 availability
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================= INTRO ================= */}
      <section className="border-y border-slate-200 bg-[#F7F9FC]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">

            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#1C49B3]">
                Built for your business
              </p>

              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                More than answering calls.
                <span className="text-slate-400">
                  {" "}
                  It works like your front desk.
                </span>
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Your AI receptionist can greet callers naturally, understand
              what they need, answer common questions, collect important
              information, and route conversations to the right place.
            </p>
          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#1C49B3]">
            What it can do
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A receptionist that never clocks out.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<Phone />}
            title="Answer every call"
            description="Handle incoming calls instantly so customers are never left waiting."
          />

          <FeatureCard
            icon={<MessageSquare />}
            title="Natural conversations"
            description="Understand customer questions and respond conversationally instead of using rigid menus."
          />

          <FeatureCard
            icon={<Bot />}
            title="Handle routine tasks"
            description="Collect customer details, answer FAQs, qualify leads, and handle repetitive requests."
          />

          <FeatureCard
            icon={<Clock3 />}
            title="Available 24/7"
            description="Your business stays responsive outside office hours, weekends, and holidays."
          />

          <FeatureCard
            icon={<Zap />}
            title="Instant response"
            description="Customers get an immediate response without waiting for someone from your team."
          />

          <FeatureCard
            icon={<Sparkles />}
            title="Built around your business"
            description="Train the receptionist around your services, information, workflows, and customer needs."
          />

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-[#F7F9FC]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#1C49B3]">
              Simple workflow
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              From incoming call to useful action.
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">

            <Step
              number="01"
              title="Customer calls"
              description="A customer calls your business just like they normally would."
            />

            <Step
              number="02"
              title="AI understands"
              description="The receptionist understands the customer's intent and responds naturally."
            />

            <Step
              number="03"
              title="Action happens"
              description="The AI collects information, answers questions, qualifies the lead, or routes the call."
            />

          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="px-6 py-24 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-[#1C49B3]/15 bg-gradient-to-br from-[#1C49B3]/5 via-white to-[#EAF1FF] px-8 py-16 text-center shadow-xl shadow-[#1C49B3]/5 sm:px-12">

          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-[#1C49B3]/10 blur-[100px]" />

          <div className="relative">

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1C49B3]/15 bg-[#1C49B3]/5">
              <Bot className="h-6 w-6 text-[#1C49B3]" />
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Let AI handle the front desk.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Give your customers a faster response while your team focuses
              on the conversations that actually need them.
            </p>

            <button className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#1C49B3] px-6 text-sm font-semibold text-white shadow-lg shadow-[#1C49B3]/20 transition hover:bg-[#163D99]">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

          </div>
        </div>
      </section>

    </main>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1C49B3]/20 hover:shadow-lg hover:shadow-[#1C49B3]/5">

      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C49B3]/15 bg-[#1C49B3]/5 text-[#1C49B3] transition group-hover:bg-[#1C49B3] group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-lg font-medium text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1C49B3]/20 hover:shadow-lg hover:shadow-[#1C49B3]/5">

      <span className="text-sm font-semibold text-[#1C49B3]">
        {number}
      </span>

      <h3 className="mt-8 text-xl font-medium text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}