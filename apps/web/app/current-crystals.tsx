import { SignedIn } from "@clerk/nextjs";
import useCurrentUser from "./lib/hooks/use-current-user";
import { Crystal } from "@repo/ui/src/components/icons";

const CurrentCrystals = () => {
  const currentUser = useCurrentUser();
  return (
    <SignedIn>
      {currentUser?.crystals && (
        <div className="text-xs font-medium flex gap-0.5">
          <Crystal className="w-4 h-4" />
          {currentUser.crystals}
        </div>
      )}
    </SignedIn>
  );
};

export default CurrentCrystals;
