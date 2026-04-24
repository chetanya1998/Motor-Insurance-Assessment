import type { Metadata } from "next";
import "./globals.css";
import { TrackingProvider } from "@/context/TrackingContext";
import { LeadProvider } from "@/context/LeadContext";

export const metadata: Metadata = {
  title: "Motor Insurance Quote - Get an Estimate in 60s",
  description: "Calculate your motor insurance premium quickly and easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TrackingProvider>
          <LeadProvider>
            {children}
          </LeadProvider>
        </TrackingProvider>
      </body>
    </html>
  );
}
