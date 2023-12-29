import useCurrentUser from "./lib/hooks/use-current-user";
import { Crystal } from "@repo/ui/src/components/icons";

const CurrentCrystals = () => {
  const currentUser = useCurrentUser();
  return (
    <div className="text-xs font-medium flex gap-0.5">
      <Crystal className="w-4 h-4" />
      {currentUser?.crystals}
    </div>
  );
};

export default CurrentCrystals;
