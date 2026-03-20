import { IMAGEKIT_API_BASE_URL, IMAGEKIT_PRIVATE_KEY } from "@/utils/env";

export interface ImageKitFile {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  size: number;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  tags: string[] | null;
}

export async function getAllPhotos(): Promise<ImageKitFile[]> {
  try {
    const params = new URLSearchParams({
      path: "/photos",
      type: "file",
    });

    const base64Key = btoa(`${IMAGEKIT_PRIVATE_KEY}:`);

    const response = await fetch(
      `${IMAGEKIT_API_BASE_URL}/files?${params.toString()}`,
      {
        headers: {
          Authorization: `Basic ${base64Key}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.json();
  } catch (error) {
    throw new Error(`ImageKit API error: ${error}`);
  }
}
