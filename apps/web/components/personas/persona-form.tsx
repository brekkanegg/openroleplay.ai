import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@repo/ui/src/components/card";
import { Label } from "@repo/ui/src/components/label";
import { Input } from "@repo/ui/src/components/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/src/components/alert-dialog";
import { Textarea } from "@repo/ui/src/components/textarea";
import { Button } from "@repo/ui/src/components/button";
import { ArrowLeft, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/src/components/form";
import { useUser } from "@clerk/nextjs";
import { RadioGroup, RadioGroupItem } from "@repo/ui/src/components/radio";
import { Checkbox } from "@repo/ui/src/components/checkbox";
import useCurrentUser from "../../app/lib/hooks/use-current-user";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  isPrivate: z.boolean(),
  isDefault: z.boolean(),
});

interface PersonaProps {
  id?: Id<"personas">;
  name?: string;
  description?: string;
  cardImageUrl?: string;
  isEdit?: boolean;
  isPrivate?: boolean;
  onClickGoBack: any;
}

export default function PersonaForm({
  id,
  name = "",
  description = "",
  cardImageUrl = "",
  isEdit = false,
  isPrivate = true,
  onClickGoBack,
}: PersonaProps) {
  const create = useMutation(api.personas.create);
  const update = useMutation(api.personas.update);
  const remove = useMutation(api.personas.remove);
  const generateUploadUrl = useMutation(api.characters.generateUploadUrl);
  const { user } = useUser();
  const currentUser = useCurrentUser();

  const imageInput = useRef<HTMLInputElement>(null);
  const [personaId, setPersonaId] = useState<Id<"personas"> | undefined>(id);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [visibility, setVisibility] = useState(
    isPrivate ? "private" : "public"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ? name : (user?.fullName as string),
      description: description,
      isPrivate: visibility === "private",
      isDefault: personaId && currentUser?.primaryPersonaId === personaId,
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
          onClickGoBack();
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
          await update({
            id: personaId as Id<"personas">,
            cardImageStorageId: storageId,
          });
        } else {
          return create({
            isPrivate: false,
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

  const imageUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : cardImageUrl;

  return (
    <>
      <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border overflow-hidden h-full rounded-b-none">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="flex items-center gap-2">
              {onClickGoBack && (
                <Button variant="ghost" onClick={onClickGoBack} size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              {isEdit ? `Edit persona` : "My persona"}
            </div>
            {personaId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground">
                    Delete persona
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {`This action cannot be undone. This will permanently delete
                     persona ${name}.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const promise = remove({
                          id: personaId as Id<"personas">,
                        });
                        toast.promise(promise, {
                          loading: "Deleting persona...",
                          success: () => {
                            onClickGoBack();
                            return `Persona has been deleted.`;
                          },
                          error: (error) => {
                            return error
                              ? (error.data as { message: string }).message
                              : "Unexpected error occurred";
                          },
                        });
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardTitle>
          <CardDescription>Configure persona details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center my-4">
            <Label
              htmlFor="card"
              className="w-[200px] h-[350px] rounded flex items-center justify-center flex-col relative cursor-pointer border hover:border-border duration-200 border-dashed hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus />
              Add persona card
              <span className="text-xs text-muted-foreground">
                Best size: 1024x1792
              </span>
              {imageUrl && (
                <img
                  src={imageUrl}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="space-y-2 flex flex-col">
                <FormLabel>Publish to</FormLabel>
                <span className="text-muted-foreground text-xs">
                  Public persona will be visible to other users.
                </span>
                <RadioGroup
                  defaultValue={visibility}
                  onValueChange={setVisibility}
                >
                  <div className="flex items-center space-x-2 pt-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label className="font-normal" htmlFor="public">
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label className="font-normal" htmlFor="private">
                      Only me
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <div className="space-y-2 flex flex-col">
                    <FormLabel>Default persona</FormLabel>
                    <FormItem className="flex items-center space-x-2 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs">
                          Use this persona as default.
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Characters will recognize your default persona.
                        </FormDescription>
                      </div>
                    </FormItem>
                  </div>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="pb-32">
          <Button className="ml-auto" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
