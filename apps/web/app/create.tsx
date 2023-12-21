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
import { Checkbox } from "@repo/ui/src/components/checkbox";

export default function Create() {
  return (
    <>
      <Card className="w-full shadow-none lg:shadow-sm border-transparent lg:border-border">
        <CardHeader>
          <CardTitle>New Character</CardTitle>
          <CardDescription>Configure your character details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center">
            <Avatar>
              <AvatarImage
                alt="Character Avatar"
                src="/placeholder.svg?height=300&width=200"
              />
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name your character" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Add a short description about this character"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              className="min-h-[100px]"
              id="instructions"
              placeholder="What does this character do? How does it behave? What should it avoid doing?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="greeting1">Greetings</Label>
            <Input
              id="greeting1"
              placeholder="The first message from character to user"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="starter1">Conversation starters</Label>
            <Input
              id="starter1"
              placeholder="Example for users to start the conversation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="knowledge">Knowledge</Label>
            <Textarea
              className="min-h-[200px]"
              id="knowledge"
              placeholder="If you enter Knowledge, conversations with your character may include its contents."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capabilities">Capabilities</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Checkbox id="capability1" disabled />
                <Label className="ml-2" htmlFor="capability1">
                  Image generation
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="capability1" disabled />
                <Label className="ml-2" htmlFor="capability1">
                  Web search
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}
