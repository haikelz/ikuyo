import type { APIRoute } from "astro";
import { prisma } from "~lib/utils/prisma";

export const GET: APIRoute = async () => {
  try {
    const data = await prisma.guestbook.findMany({
      select: {
        id: true,
        created_at: true,
        email: false,
        username: true,
        message: true,
      },
    });

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: "Success get guestbook!",
        data: data,
      })
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err.message,
      })
    );
  }
};
