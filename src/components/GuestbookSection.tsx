import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {
  PUBLIC_DEVELOPMENT_URL,
  PUBLIC_PRODUCTION_URL,
} from "~lib/utils/constants";
import { messageSchema } from "~lib/utils/zod";
import type { GuestbookProps } from "~types";
import IsPending from "./IsPending";

export default function GuestbookSection() {
  const newQueryClient = new QueryClient();

  async function getGuestbook() {
    try {
      const response = await fetch(
        `${
          import.meta.env.MODE === "development"
            ? PUBLIC_DEVELOPMENT_URL
            : PUBLIC_PRODUCTION_URL
        }/api/guestbook`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  const { isPending, isError, data, refetch, isRefetching } = useQuery(
    {
      queryKey: ["guestbook"],
      queryFn: () => getGuestbook(),
    },
    newQueryClient
  );

  if (isPending || isRefetching) return <IsPending />;
  if (isError)
    return <p className="font-bold">There is no message right now!</p>;

  const guestbook: { data: GuestbookProps[] } = data;

  return (
    <QueryClientProvider client={newQueryClient}>
      <GuestbookForm refetch={refetch} />
      {guestbook.data ? (
        <section className="mt-8 flex w-full flex-col items-start justify-start space-y-6">
          {guestbook.data
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((item) => (
              <div key={item.id}>
                <h3 className="my-0">{item.message}</h3>
                <p className="mb-0 mt-2">
                  {item.username}. {format(item.created_at, "MMMM d, y")}
                </p>
              </div>
            ))}
        </section>
      ) : (
        <p className="font-bold">There is no message right now!</p>
      )}
    </QueryClientProvider>
  );
}

function GuestbookForm({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
}) {
  const queryClient = useQueryClient();

  const {
    getValues,
    setValue,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
    resolver: zodResolver(messageSchema),
  });

  async function postGuestbook({
    email,
    name,
    message,
  }: {
    email: string;
    name: string;
    message: string;
  }): Promise<void> {
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: name,
          message: message,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (err: any) {
      throw new Error(`Error! ${err.message}`);
    }
  }

  const { mutateAsync } = useMutation({
    mutationKey: ["post-guestbook"],
    mutationFn: postGuestbook,
    onSettled: () => queryClient.invalidateQueries(),
  });

  function onSubmit() {
    mutateAsync({
      email: getValues("email"),
      name: getValues("name"),
      message: getValues("message"),
    }).then(() => refetch());
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-2 border-dashed mt-4 border-base-0 p-4"
    >
      <div className="w-full space-y-4">
        <div className="flex w-full items-center justify-center space-x-4">
          <div className="w-1/2">
            <input
              {...register("name", { required: true })}
              className={twMerge(
                "block w-full border-2 border-base-0",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                "rounded-md",
                "px-4 py-1.5 font-medium outline-none"
              )}
              type="text"
              name="name"
              required
              placeholder="Your Name...."
            />
            {errors.name ? <span>{errors.name.message}</span> : null}
          </div>
          <div className="w-1/2">
            <input
              {...register("email", { required: true })}
              className={twMerge(
                "block w-full border-2 border-base-0",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                "rounded-md",
                "px-4 py-1.5 font-medium outline-none"
              )}
              type="email"
              name="email"
              required
              placeholder="Your Email...."
            />
            {errors.email ? <span>{errors.email.message}</span> : null}
          </div>
        </div>
        <div className="w-full">
          <textarea
            {...register("message", { required: true })}
            placeholder="Your Message...."
            className={twMerge(
              "block h-32 w-full border-2 border-base-0",
              "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              "rounded-md",
              "px-4 py-1.5 font-medium outline-none"
            )}
          />
          {errors.message ? <span>{errors.message.message}</span> : null}
        </div>
        <div className="w-full flex justify-end items-center">
          <button
            type="submit"
            className="font-bold bg-base-0 px-4 py-1.5 rounded-md text-base-5"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
