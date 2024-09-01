import type { APIRoute } from "astro";
import { prisma } from "~lib/utils/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await prisma.guestbook.findMany();

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

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const body = await request.json();

    await prisma.guestbook.create({
      data: {
        email: body.email,
        username: body.username,
        message: body.message,
      },
    });

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: "Success add new message!",
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
