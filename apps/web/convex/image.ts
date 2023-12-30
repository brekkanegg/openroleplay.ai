"use node";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { STABILITY_AI_API_URL } from "./constants";
import { Buffer } from "buffer";

export const generate = internalAction(
  async (
    ctx,
    {
      userId,
      characterId,
      name,
      description,
    }: {
      userId: Id<"users">;
      characterId: Id<"characters">;
      name: string;
      description: string;
    }
  ) => {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      "Content-Type": "application/json",
    };

    const body = {
      steps: 40,
      width: 768,
      height: 1344,
      seed: 0,
      cfg_scale: 5,
      samples: 1,
      text_prompts: [
        {
          text: name,
          weight: 1,
        },
        {
          text: description,
          weight: 1,
        },
      ],
    };

    await ctx.runMutation(internal.serve.useCrystal, {
      userId,
      name: "stable-diffusion-xl-1024-v1-0",
    });

    const response = await fetch(STABILITY_AI_API_URL, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    // Store the image to Convex storage.
    const responseJSON = await response.json();

    const base64Data = responseJSON.artifacts[0].base64;
    const binaryData = Buffer.from(base64Data, "base64");
    const image = new Blob([binaryData], { type: "image/png" });

    // Update storage.store to accept whatever kind of Blob is returned from node-fetch
    const cardImageStorageId = await ctx.storage.store(image as Blob);

    // Write storageId as the body of the message to the Convex database.
    await ctx.runMutation(internal.characterCard.uploadImage, {
      characterId,
      cardImageStorageId,
    });
  }
);
