import { api } from "@/configs/axios";
import type { GuestbookProps } from "@/types";

export async function getGuestbook(): Promise<GuestbookProps[]> {
  try {
    const response = await api.get(process.env.GUESTBOOK_API_URL as string);
    return response.data[0].result.data as GuestbookProps[];
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
