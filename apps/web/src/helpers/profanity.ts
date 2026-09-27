import { createDetector } from "profanity-kit/core";
import { english } from "profanity-kit/languages/en";
import { indonesian } from "profanity-kit/languages/id";

export function hideProfanity(text: string): string {
  const detector = createDetector({
    languages: [english, indonesian],
  });

  return detector.filter(text);
}
