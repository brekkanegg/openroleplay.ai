import { Card, CardHeader, CardTitle } from "@repo/ui/src/components";
import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from "@repo/ui/src/components/avatar";

export default function Chats() {
  return (
    <Card className="w-full shadow-none lg:shadow-xl border-transparent lg:border-border">
      <CardHeader>
        <CardTitle>Chats</CardTitle>
      </CardHeader>
      <ul className="divide-y divide-border">
        <li className="hover:bg-gray-100 dark:hover:bg-gray-900 p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                alt="@johndoe"
                src="/placeholder.svg?height=50&width=50"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  10:42 AM
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hey, are we still on for lunch?
              </p>
            </div>
          </div>
        </li>
        <li className="hover:bg-gray-100 dark:hover:bg-gray-900 p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                alt="@janedoe"
                src="/placeholder.svg?height=50&width=50"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Jane Doe</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Yesterday
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Great! See you tomorrow.
              </p>
            </div>
          </div>
        </li>
      </ul>
    </Card>
  );
}
