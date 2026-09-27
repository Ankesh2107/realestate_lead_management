import './globals.css';


export const metadata = {
  title: 'Realty AI — Multilingual Real Estate Sales Agent & CRM',
  description: 'AI-powered real estate employee across WhatsApp, Instagram, Facebook, and Voice, connected with Supabase.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
