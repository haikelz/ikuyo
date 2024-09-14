import type { APIRoute } from "astro";
import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "~lib/utils/graphql";
import { prisma } from "~lib/utils/prisma";

export const prerender = false;

const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      getGuestbook: async () => {
        const data = await prisma.guestbook.findMany({
          select: {
            id: true,
            created_at: true,
            email: false,
            username: true,
            message: true,
          },
        });

        return {
          statusCode: 200,
          message: "Success get guestbook!",
          data: data,
        };
      },
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

export const POST: APIRoute = async (context) => {
  const { request } = context;
  return handleRequest(request, context as any);
};
