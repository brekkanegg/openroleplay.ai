import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const calSans = localFont({
  variable: "--font-cal",
  src: "./CalSans-SemiBold.otf",
});
