// Page titles display as dictionary pronunciations, in the American respelling that Oxford
// Languages and Google use (adjective: /ˈajəktiv/). Titles without an entry, such as error pages
// and tag archives, keep their words.
export const pronunciations = {
  About: "/əˈbout/",
  Guestbook: "/ˈɡes(t)ˌbo͝ok/",
  "Market Index": "/ˈmärkət ˈinˌdeks/",
  Notes: "/nōts/",
  Tags: "/taɡz/",
  Tools: "/to͞olz/",
  Wakatime: "/ˈwäkəˌtīm/",
  Works: "/wərks/",
} as const;

export type PronouncedTitle = keyof typeof pronunciations;

export function hasPronunciation(title: string): title is PronouncedTitle {
  return Object.hasOwn(pronunciations, title);
}
