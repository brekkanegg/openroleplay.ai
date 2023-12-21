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

export default function Persona() {
  return (
    <>
      <Card className="w-full shadow-none lg:shadow-sm border-transparent lg:border-border">
        <CardHeader>
          <CardTitle>Your persona</CardTitle>
          <CardDescription>Configure your persona details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center">
            <Avatar>
              <AvatarImage
                alt="Character Avatar"
                src="/placeholder.svg?height=300&width=200"
              />
              <AvatarFallback>
                <Plus />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="name">Name</Label>
            <span className="text-muted-foreground text-xs">
              What do characters refer to you as?
            </span>
            <Input id="name" placeholder="Name your persona" />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="instructions">Description</Label>
            <span className="text-muted-foreground text-xs">
              What information would you like to share with Characters?
            </span>
            <Textarea
              className="min-h-[100px]"
              id="instructions"
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
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}
