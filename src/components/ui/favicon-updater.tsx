import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, ExternalLink, Loader2 } from "lucide-react";

export function FaviconUpdater() {
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateFavicon = async () => {
    if (!faviconUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a favicon URL",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Create a link element to test if the URL is valid
      const testImg = new Image();
      testImg.onload = () => {
        // Update the favicon
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = faviconUrl;
        } else {
          // Create new favicon link if it doesn't exist
          const newFavicon = document.createElement("link");
          newFavicon.rel = "icon";
          newFavicon.href = faviconUrl;
          document.head.appendChild(newFavicon);
        }

        toast({
          title: "Success",
          description: "Favicon updated successfully! The new icon should appear in your browser tab.",
        });
        setFaviconUrl("");
      };
      
      testImg.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load the favicon from the provided URL. Please check the URL and try again.",
          variant: "destructive"
        });
      };
      
      testImg.src = faviconUrl;
    } catch (error) {
      console.error('Error updating favicon:', error);
      toast({
        title: "Error",
        description: "Failed to update favicon",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Update Favicon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="favicon-url">Favicon URL</Label>
          <Input
            id="favicon-url"
            type="url"
            placeholder="https://example.com/favicon.png"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">
            <strong>Note:</strong> Use PNG/JPG files. ICO files are not supported.
          </p>
        </div>
        
        <Button 
          onClick={updateFavicon} 
          disabled={isUpdating || !faviconUrl.trim()}
          className="w-full"
        >
          {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <ExternalLink className="w-4 h-4 mr-2" />
          Update Favicon
        </Button>
      </CardContent>
    </Card>
  );
}