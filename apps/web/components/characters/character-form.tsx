import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@repo/ui/src/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/src/components/select";
import { Input } from "@repo/ui/src/components/input";
import { Textarea } from "@repo/ui/src/components/textarea";
import { Button } from "@repo/ui/src/components/button";
import { ArrowLeft, Plus, UploadCloud } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/src/components/form";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/src/components/popover";
import { RadioGroup, RadioGroupItem } from "@repo/ui/src/components/radio";
import { Label } from "@repo/ui/src/components/label";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
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
import DraftBadge from "./saving-badge";
import SavingBadge from "./saving-badge";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  greetings: z.string(),
  model: z.union([
    z.literal("mistral-7b-instruct"),
    z.literal("mixtral-8x7b-instruct"),
    z.literal("gpt-3.5-turbo-1106"),
    z.literal("gpt-4-1106-preview"),
    z.literal("pplx-7b-online"),
    z.literal("accounts/fireworks/models/qwen-14b-chat"),
  ]),
});

interface CreateProps {
  id?: Id<"characters">;
  name?: string;
  description?: string;
  instructions?: string;
  greetings?: string;
  cardImageUrl?: string;
  model?: any;
  isEdit?: boolean;
  isDraft?: boolean;
  onClickGoBack: any;
}

export default function CharacterForm({
  id,
  name = "",
  description = "",
  instructions = "",
  greetings = "",
  cardImageUrl = "",
  model = "gpt-3.5-turbo-1106",
  isEdit = false,
  isDraft = false,
  onClickGoBack,
}: CreateProps) {
  const upsert = useMutation(api.characters.upsert);
  const publish = useMutation(api.characters.publish);
  const archive = useMutation(api.characters.archive);
  const generateUploadUrl = useMutation(api.characters.generateUploadUrl);

  const [characterId, setCharacterId] = useState<Id<"characters"> | undefined>(
    id
  );

  const imageInput = useRef<HTMLInputElement>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      description,
      instructions,
      greetings: Array.isArray(greetings) ? greetings[0] : greetings,
      model,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { greetings, ...otherValues } = values;
    const character = await upsert({
      ...(characterId ? { id: characterId } : {}),
      greetings: [greetings],
      ...otherValues,
    });
    character && setCharacterId(character);
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
      .then(({ storageId }) =>
        upsert({
          ...(characterId ? { id: characterId } : {}),
          cardImageStorageId: storageId,
        })
      );

    toast.promise(promise, {
      loading: "Uploading character card...",
      success: (character) => {
        character && setCharacterId(character);
        return `Character card has been uploaded.`;
      },
      error: (error) => {
        return error
          ? (error.data as { message: string }).message
          : "Unexpected error occurred";
      },
    });
  }

  const debouncedSubmitHandle = useDebouncedCallback(onSubmit, 1000);

  const imageUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : cardImageUrl;
  return (
    <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border overflow-hidden h-full rounded-b-none">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            {onClickGoBack && (
              <Button variant="ghost" onClick={onClickGoBack} size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            {isEdit ? "Edit Character" : "New Character"}
            {form.formState.isSubmitting ? (
              <SavingBadge />
            ) : form.formState.isDirty && isDraft ? (
              <DraftBadge />
            ) : null}
          </div>
          {characterId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground">
                  Archive character
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This action cannot be undone. Archived characters are not discoverable from the homepage. Users who already interacted with the characters can still see their messages.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const promise = archive({
                        id: characterId as Id<"characters">,
                      });
                      toast.promise(promise, {
                        loading: "Archiving character...",
                        success: () => {
                          onClickGoBack();
                          return `Character has been archived.`;
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
        <CardDescription>Configure your character details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center my-4">
          <Label
            htmlFor="card"
            className="w-[200px] h-[350px] rounded flex items-center justify-center flex-col relative cursor-pointer border hover:border-border duration-200 border-dashed hover:-translate-y-1 hover:shadow-lg"
          >
            <Plus />
            Add character card
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
          <form
            onSubmit={form.handleSubmit(debouncedSubmitHandle)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name your character"
                      {...field}
                      onBlur={form.handleSubmit(debouncedSubmitHandle)}
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add a short description about this character"
                      {...field}
                      onBlur={form.handleSubmit(debouncedSubmitHandle)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="What does this character do? How does they behave? What should they avoid doing?"
                      {...field}
                      onBlur={form.handleSubmit(debouncedSubmitHandle)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="greetings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greetings</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="The first message from character to user"
                      {...field}
                      onBlur={form.handleSubmit(debouncedSubmitHandle)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? field.value : model}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI model for character." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo-1106">
                        GPT-3.5 Turbo - Capable of generating realistic text,
                        16,384 Context Length, provided by OpenAI
                      </SelectItem>
                      <SelectItem value="gpt-4-1106-preview">
                        GPT-4 Turbo - Capable of generating realistic text,
                        32,768 Context Length, provided by OpenAI
                      </SelectItem>
                      <SelectItem value="mistral-7b-instruct">
                        Mistral 7B Instruct - Not for chat, Fastest response,
                        4096 Context Length, provided by Perplexity AI
                      </SelectItem>
                      <SelectItem value="mixtral-8x7b-instruct">
                        Mixtral 8x7B Instruct - Not for chat, Faster response,
                        4096 Context Length, provided by Perplexity AI
                      </SelectItem>
                      <SelectItem value="pplx-7b-online">
                        Perplexity 7B Online - Latest Internet Knowledge, Faster
                        response, 4096 Context Length, provided by Perplexity AI
                      </SelectItem>
                      <SelectItem value="accounts/fireworks/models/qwen-14b-chat">
                        Qwen 14B Online - Fluent in English and Chinese, Fast
                        response, provided by Fireworks AI
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Customize the AI model for your characters. Each model has
                    unique performance characteristics, response speeds, and
                    conversation domains.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="pb-32">
        <Popover
          open={openPopover}
          onOpenChange={() => setOpenPopover(!openPopover)}
        >
          <PopoverContent asChild>
            <div className="w-full rounded-lg bg-white p-4 sm:w-40">
              <RadioGroup defaultValue="public" className="p-1">
                <span className="text-muted-foreground text-sm font-medium">
                  Publish to
                </span>
                <div className="flex items-center space-x-2">
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
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    onSubmit(form.getValues());
                    characterId &&
                      (() => {
                        const promise = publish({
                          id: characterId,
                          visibility: "public",
                        });
                        toast.promise(promise, {
                          loading: "Publishing character...",
                          success: (data) => {
                            onClickGoBack();
                            return `Character has been saved.`;
                          },
                          error: (error) => {
                            return error
                              ? (error.data as { message: string }).message
                              : "Unexpected error occurred";
                          },
                        });
                      })();
                  }}
                  className="h-7 flex gap-1 text-xs w-full"
                >
                  <UploadCloud className="w-4 h-4 text-foreground-primary" />
                  Publish
                </Button>
              </div>
            </div>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button
              className="ml-auto"
              onClick={() => {
                setOpenPopover(!openPopover);
              }}
              disabled={!form.formState.isDirty}
            >
              Save
            </Button>
          </PopoverTrigger>
        </Popover>
      </CardFooter>
    </Card>
  );
}
