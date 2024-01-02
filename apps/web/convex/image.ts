"use node";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { STABILITY_AI_API_URL, getAPIKey, getBaseURL } from "./constants";
import { Buffer } from "buffer";
import { OpenAI } from "openai";

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
          text: `${name}, ${description}`,
          weight: 1,
        },
      ],
    };

    const { currentCrystals } = await ctx.runMutation(
      internal.serve.useCrystal,
      {
        userId,
        name: "stable-diffusion-xl-1024-v1-0",
      }
    );

    const response = await fetch(STABILITY_AI_API_URL, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      await ctx.runMutation(internal.serve.refundCrystal, {
        userId,
        currentCrystals,
        name: "stable-diffusion-xl-1024-v1-0",
      });
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

export const generateWithDalle3 = internalAction(
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
    const { currentCrystals } = await ctx.runMutation(
      internal.serve.useCrystal,
      {
        userId,
        name: "dalle-3",
      }
    );
    const baseURL = getBaseURL("dalle-3");
    const apiKey = getAPIKey("dalle-3");
    const openai = new OpenAI({
      baseURL,
      apiKey,
    });
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `a portrait image for ${name}, ["${description}"]. when style is not defined, use anime style.`,
      n: 1,
      quality: "standard",
      size: "1024x1792",
      response_format: "b64_json",
    });
    const base64Data =
      response && response.data && response.data[0]
        ? (response.data[0].b64_json as string)
        : "";
    const binaryData = Buffer.from(base64Data, "base64");
    const image = new Blob([binaryData], { type: "image/png" });

    try {
      // Update storage.store to accept whatever kind of Blob is returned from node-fetch
      const cardImageStorageId = await ctx.storage.store(image as Blob);
      // Write storageId as the body of the message to the Convex database.
      await ctx.runMutation(internal.characterCard.uploadImage, {
        characterId,
        cardImageStorageId,
      });
    } catch (error) {
      await ctx.runMutation(internal.serve.refundCrystal, {
        userId,
        name: "dalle-3",
        currentCrystals,
      });
    }
  }
);
