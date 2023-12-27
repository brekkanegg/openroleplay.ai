import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@repo/ui/src/components/card";
import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from "@repo/ui/src/components/avatar";
import { Label } from "@repo/ui/src/components/label";
import { Input } from "@repo/ui/src/components/input";
import { Textarea } from "@repo/ui/src/components/textarea";
import { Button } from "@repo/ui/src/components/button";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/src/components/form";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  isPrivate: z.boolean(),
});

export default function Persona() {
  const create = useMutation(api.personas.create);
  const update = useMutation(api.personas.update);
  const generateUploadUrl = useMutation(api.characters.generateUploadUrl);
  const { user } = useUser();

  const imageInput = useRef<HTMLInputElement>(null);
  const [personaId, setPersonaId] = useState<Id<"personas">>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.fullName as string,
      description: "",
      isPrivate: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (personaId) {
      const promise = update({
        id: personaId as Id<"personas">,
        ...values,
      });
      toast.promise(promise, {
        loading: "Updating persona...",
        success: () => {
          return `Persona has been updated.`;
        },
        error: (error) => {
          return error
            ? (error.data as { message: string }).message
            : "Unexpected error occurred";
        },
      });
    } else {
      const promise = create({
        ...values,
      });
      toast.promise(promise, {
        loading: "Creating persona...",
        success: (persona) => {
          persona && setPersonaId(persona);
          return `Persona has been created.`;
        },
        error: (error) => {
          return error
            ? (error.data as { message: string }).message
            : "Unexpected error occurred";
        },
      });
    }
  }

  async function handleUploadImage(uploadedImage: File) {
    const promise = generateUploadUrl()
      .then((postUrl) =>
        fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": uploadedImage!.type },
          body: uploadedImage,
        })
      )
      .then((result) => result.json())
      .then(async ({ storageId }) => {
        if (personaId) {
          return create({
            isPrivate: false,
            cardImageStorageId: storageId,
          });
        } else {
          await update({
            id: personaId as Id<"personas">,
            cardImageStorageId: storageId,
          });
        }
      });

    toast.promise(promise, {
      loading: "Uploading persona card...",
      success: (persona) => {
        persona && setPersonaId(persona);
        return `Persona card has been uploaded.`;
      },
      error: (error) => {
        return error
          ? (error.data as { message: string }).message
          : "Unexpected error occurred";
      },
    });
  }

  return (
    <>
      <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border">
        <CardHeader>
          <CardTitle>Your persona</CardTitle>
          <CardDescription>Configure your persona details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center my-4">
            <Label
              htmlFor="card"
              className="w-[200px] h-[350px] rounded bg-muted flex items-center justify-center flex-col relative cursor-pointer"
            >
              <Plus />
              Add persona card
              <span className="text-xs text-muted-foreground">
                Best size: 1024x1792
              </span>
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt={"Preview of character card"}
                  className="absolute w-full h-full object-cover rounded pointer-events-none"
                />
              )}
            </Label>
            <Input
              id="card"
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(event: any) => {
                setSelectedImage(event.target.files![0]);
                handleUploadImage(event.target.files![0]);
              }}
              disabled={selectedImage !== null}
              className="hidden"
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 flex flex-col">
                      <FormLabel>Name</FormLabel>
                      <span className="text-muted-foreground text-xs">
                        What do characters refer to you as?
                      </span>
                    </div>
                    <FormControl>
                      <Input placeholder="Name your persona" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 flex flex-col">
                      <FormLabel>Description</FormLabel>
                      <span className="text-muted-foreground text-xs">
                        What information would you like to share with
                        Characters?
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        className="min-h-[128px]"
                        {...field}
                        placeholder={`Name: Alexa
Gender: Female
Age: 28
Height: 5'6"
Weight: 145 lbs
Hair: Short, Straight, and Black
Eye Color: Blue
Personality: Introverted, thoughtful, analytical, creative
Likes: Hiking, Gardening, Painting, Solving Puzzles, Cooking, Classical Music, and Traveling.
Dislikes: Fast food, Hot weather, and Reality TV.
Talents: Painting, Cooking, and Chess.
`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
