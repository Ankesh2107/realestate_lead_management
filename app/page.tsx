// import { redirect } from 'next/navigation';

// export default function RootPage() {
//   redirect('/dashboard');
// }


import AIReceptionistPage from "@/components/AIReceptionistPage";
import HeroSection from "@/components/Hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <AIReceptionistPage />
      
    </main>
  );
}