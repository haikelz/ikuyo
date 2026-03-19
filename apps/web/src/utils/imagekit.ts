import { IMAGEKIT_API_BASE_URL, IMAGEKIT_PRIVATE_KEY } from "@/utils/env";

export interface ImageKitFile {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  tags: string[] | null;
}

export async function getAllPhotos(): Promise<ImageKitFile[]> {
  const params = new URLSearchParams({
    path: "/photos",
    type: "file",
  });

  const response = await fetch(
    `${IMAGEKIT_API_BASE_URL}/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Basic ${btoa(`${IMAGEKIT_PRIVATE_KEY}:`)}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `ImageKit API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
