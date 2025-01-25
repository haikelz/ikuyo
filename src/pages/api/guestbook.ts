import { prisma } from "@/lib/utils/prisma";

export async function GET() {
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
        status_code: 200,
        message: "Success get guestbook!",
        data: data,
      })
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        status_code: 500,
        message: err.message,
      })
    );
  }
}
