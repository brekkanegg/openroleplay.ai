"use client";
import { Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <Link href={href} className="duration-200 hover:opacity-50 underline">
    {children}
  </Link>
);

export default function Footer() {
  const pathname = usePathname();
  const showFooter = pathname === "/" || pathname === "/shop";
  if (!showFooter) return null;
  return (
    <footer className="flex w-full items-center justify-center px-6 py-2 2xl:px-0 text-xs">
      <div className="flex w-full flex-col gap-8 items-center">
        <div className="flex flex-col gap-8 sm:flex-row xl:gap-24">
          <div className="flex gap-2">
            <div className="text-muted-foreground">
              © {new Date().getFullYear()} Empty Canvas, Inc.
            </div>
            <FooterLink href="/github">
              <Github className="w-4 h-4 p-[2px] inline" />
              Star on GitHub
            </FooterLink>
            <FooterLink href="/privacy.html">Privacy Policy</FooterLink>
            <FooterLink href="/terms.html">Terms of Service</FooterLink>
            <FooterLink href="/crystal/terms">
              Crystal Terms and Conditions
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
