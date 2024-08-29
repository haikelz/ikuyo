/*import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { prisma } from "~lib/utils/prisma";
import { messageSchema } from "~lib/utils/zod";

export default function GuestbookSection() {
  const [isShowLoginGuestbookMethod, setIsShowLoginGuestbookMethod] =
    useState<boolean>(false);

  const [id, setId] = useState<number>(0);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const {
    getValues,
    setValue,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: { message: "" },
    resolver: zodResolver(messageSchema),
  });

  async function onSubmit() {
    // detect if value are edited
    if (isEdited) {
      await prisma.guestbook.update({
        where: { id: id },
        data: { message: getValues("message") },
      });
    } else {
      await prisma.guestbook.create({
        data: {
          message: getValues("message"),
          username: "",
          email: "",
        },
      });
    }
    /*match({ isEdited: isEdited })
      .with({ isEdited: true }, () =>
        updateMutation
          .mutateAsync({
            id: id,
            message: getValues("message"),
          })
          .then(() => get.refetch())
      )
      .otherwise(() =>
        postMutation
          .mutateAsync({
            message: getValues("message"),
            username: session?.user.name as string,
            email: session?.user.email as string,
          })
          .then(() => get.refetch())
      );

    setValue("message", "");
  }

  return (
    <>
      <div className="my-4 w-fit flex items-center justify-center space-x-3">
        <SignInWithGithub />
        <span className="text-base">or</span>
        <SignInWithGoogle />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 w-full relative">
          <input
            {...register("message")}
            className={twMerge(
              "block w-full border-2 border-base-0",
              "focus:border-blue-500 focus:ring-blue-500 focus:ring-1",
              "dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-1",
              "dark:border-base-5 bg-white dark:bg-base-0",
              "rounded-md",
              "px-4 py-1.5 font-medium outline-none"
            )}
            type="text"
            name="message"
            required
            placeholder="Add your message...."
          />
          {errors.message ? (
            <p className="mt-2">{errors.message.message}</p>
          ) : null}
        </div>
      </form>
    </>
  );
}
*/
