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
