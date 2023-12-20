import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { calSans, inter } from "./fonts";
import { Providers } from "./providers";
import NavBar from "./navbar";
import { constructMetadata } from "./lib/utils";

export const metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <body className={cx(calSans.variable, inter.variable)}>
        <Providers>
          <NavBar />
          <main className="flex min-h-screen w-full flex-col items-center justify-center py-32 font-default">
            {children}
          </main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
