import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const useCurrentUser = () => {
  const me = useQuery(api.users.me);
  return me;
};

export default useCurrentUser;
