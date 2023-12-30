"use client";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Tooltip,
} from "@repo/ui/src/components";
import { Crystal } from "@repo/ui/src/components/icons";
import { useAction, useConvexAuth } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import useCurrentUser from "../lib/hooks/use-current-user";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOut } from "../lib/utils";
import { useRouter } from "next/navigation";
import Footer from "../footer";

const Package = ({
  src,
  amount,
  bonus,
  price,
  handlePurchaseClick,
}: {
  src: string;
  amount: 300 | 1650 | 5450 | 11200 | 19400 | 90000;
  bonus: number;
  price: number;
  handlePurchaseClick?: any;
}) => {
  const router = useRouter();
  return (
    <Tooltip
      content={`Buy ${amount - bonus} ${
        bonus > 0 ? `(+ Bonus ${bonus})` : ""
      } crystals`}
      desktopOnly
    >
      <Card
        className="hover:shadow-lg aspect-square rounded-lg duration-200 relative md:w-64 md:h-64 w-[23rem] h-[23rem] tabular-nums"
        role="button"
        onClick={
          handlePurchaseClick
            ? (e) => handlePurchaseClick(e)
            : () => router.push("/sign-in")
        }
      >
        <Image
          src={src}
          width={256}
          height={256}
          alt={"image for pricing"}
          className="absolute top-0 h-full w-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 h-[50%] w-full bg-gradient-to-b from-transparent via-white/95 to-white rounded-b-lg" />
        <div className="pt-[70%] flex flex-col gap-1">
          <CardHeader className="flex items-center justify-center py-1">
            <CardTitle className="z-10 text-xl">
              {(amount - bonus).toLocaleString()} Crystals
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center w-full justify-center">
            <p className="font-semibold z-10 w-full text-center bg-sky-100 text-sky-900 rounded-full">
              {price}$
            </p>
          </CardFooter>
        </div>
        {bonus > 0 && (
          <div className="absolute -top-2 -left-2 w-fit p-1 bg-rose-500 rounded-full px-2 text-sm flex items-center gap-0.5 text-white font-medium">
            <span className="text-amber-200">{"Bonus "}</span>
            <Crystal className="w-4 h-4" /> {bonus}
          </div>
        )}
      </Card>
    </Tooltip>
  );
};

const PackageWrapper = ({
  src,
  amount,
  bonus,
  price,
}: {
  src: string;
  amount: 300 | 1650 | 5450 | 11200 | 19400 | 90000;
  bonus: number;
  price: number;
}) => {
  const buyCrystal = useAction(api.stripe.pay);
  const currentUser = useCurrentUser();
  async function handlePurchaseClick(event: any) {
    event.preventDefault();
    const promise = buyCrystal({
      numCrystals: amount,
      userId: currentUser._id,
    });
    toast.promise(promise, {
      loading: "Redirecting to purchase page...",
      success: (paymentUrl) => {
        console.log("paymentUrl::", paymentUrl);
        window.location.href = paymentUrl!;
        return `Now you can proceed to purchase.`;
      },
      error: (error) => {
        return error
          ? (error.data as { message: string }).message
          : "Unexpected error occurred";
      },
    });
  }

  return (
    <Package
      src={src}
      amount={amount}
      bonus={bonus}
      price={price}
      handlePurchaseClick={handlePurchaseClick}
    />
  );
};

export default function Page() {
  const { isAuthenticated } = useConvexAuth();
  const packages = [
    { src: "/shop/tier1.png", amount: 300, bonus: 0, price: 0.99 },
    { src: "/shop/tier2.png", amount: 1650, bonus: 150, price: 4.99 },
    { src: "/shop/tier3.png", amount: 5450, bonus: 550, price: 14.99 },
    { src: "/shop/tier4.png", amount: 11200, bonus: 1300, price: 29.99 },
    { src: "/shop/tier5.png", amount: 19400, bonus: 3000, price: 49.99 },
    { src: "/shop/tier6.png", amount: 90000, bonus: 8000, price: 99.99 },
  ];
  return (
    <div className="w-full max-w-screen-xl flex flex-col justify-self-start items-center gap-16 pt-16 pb-32 px-2">
      <div className="flex flex-col gap-4 items-start md:items-center px-5">
        <h1 className="text-5xl font-display">Shop</h1>
        <h2 className="text-3xl font-display bg-gradient-to-b from-gray-400 to-gray-600 text-transparent bg-clip-text">
          Crystal Top-Up
        </h2>
        <p className="text-muted-foreground text-sm flex gap-1 items-center">
          <Crystal className="w-4 h-4 hidden md:inline" />
          Crystal is an universal currency for calling AI features in
          openroleplay.ai.
        </p>
      </div>
      <AnimatePresence>
        {isAuthenticated ? (
          <motion.section
            {...FadeInOut}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <PackageWrapper
                key={pkg.src}
                src={pkg.src}
                amount={pkg.amount as any}
                bonus={pkg.bonus}
                price={pkg.price}
              />
            ))}
          </motion.section>
        ) : (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Package
                key={pkg.src}
                src={pkg.src}
                amount={pkg.amount as any}
                bonus={pkg.bonus}
                price={pkg.price}
              />
            ))}
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
