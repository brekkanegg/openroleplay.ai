import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@repo/ui/src/components/card";
import { Input } from "@repo/ui/src/components/input";
import { Textarea } from "@repo/ui/src/components/textarea";
import { Button } from "@repo/ui/src/components/button";
import { Plus, UploadCloud } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/src/components/form";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
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
import { Id } from "../convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  greetings: z.string(),
});

export default function Create() {
  const upsert = useMutation(api.characters.upsert);
  const publish = useMutation(api.characters.publish);
  const generateUploadUrl = useMutation(api.characters.generateUploadUrl);

  const [characterId, setCharacterId] = useState<Id<"characters">>();

  const imageInput = useRef<HTMLInputElement>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      greetings: "",
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
  return (
    <>
      <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            New Character
            {form.formState.isSubmitting ? (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg
                  className="mr-1.5 h-2 w-2 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Saving
              </span>
            ) : form.formState.isDirty ? (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <svg
                  className="mr-1.5 h-2 w-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Draft
              </span>
            ) : null}
          </CardTitle>
          <CardDescription>Configure your character details.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full flex justify-center my-4">
            <Label
              htmlFor="card"
              className="w-[200px] h-[350px] rounded bg-muted flex items-center justify-center flex-col relative cursor-pointer"
            >
              <Plus />
              Add character card
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
            <form
              onSubmit={form.handleSubmit(debouncedSubmitHandle)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name your character" {...field} />
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
    </>
  );
}
