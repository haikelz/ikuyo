import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import Content from "./dropdown-menu-content.svelte";
import Item from "./dropdown-menu-item.svelte";
import Root from "./dropdown-menu.svelte";

const Trigger = DropdownMenuPrimitive.Trigger;

export {
  Content,
  Item,
  Root,
  Trigger,
  Root as DropdownMenu,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
  Trigger as DropdownMenuTrigger,
};
