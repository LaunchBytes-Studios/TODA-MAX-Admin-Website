import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Megaphone, Send } from "lucide-react";
import { toast } from "sonner";

export function BroadcastAlert() {
  const [message, setMessage] = useState("");

  const handleBroadcast = () => {
    if (!message.trim()) {
      toast.error("Please enter a message to broadcast");
      return;
    }

    toast.success("Alert broadcast to all users!");
    setMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="size-5 text-blue-600" />
          Broadcast Alert to All Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alert-message">Alert Message</Label>
          <Textarea
            id="alert-message"
            placeholder="Enter alert message to send to all users..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={handleBroadcast}
          className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700"
          disabled={!message.trim()}
        >
          <Send className="mr-2 size-4" />
          Broadcast Alert to All Users
        </Button>
      </CardContent>
    </Card>
  );
}
