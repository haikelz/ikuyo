import { api } from "@/configs/axios";
import type { GuestbookProps } from "@/types";
import { GUESTBOOK_API_URL } from "@/utils/env";

export async function getGuestbook(): Promise<GuestbookProps[]> {
  try {
    const response = await api.get(GUESTBOOK_API_URL);
    return response.data[0].result.data as GuestbookProps[];
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
