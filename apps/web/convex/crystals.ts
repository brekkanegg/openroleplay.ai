import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCrystalPrice } from "./constants";

export const price = query({
  args: {
    modelName: v.string(),
  },
  handler: async (ctx, args) => {
    return getCrystalPrice(args.modelName);
  },
});
