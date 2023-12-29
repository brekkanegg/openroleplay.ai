import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const useCurrentUser = () => {
  try {
    const me = useQuery(api.users.me);
    return me;
  } catch (error) {
    return {};
  }
};

export default useCurrentUser;
