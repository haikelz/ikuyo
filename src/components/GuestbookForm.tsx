import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { messageSchema } from "~lib/utils/zod";

export default function GuestbookForm() {
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

  async function onSubmit(): Promise<void> {
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        body: JSON.stringify({
          email: getValues("email"),
          username: getValues("name"),
          message: getValues("message"),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setValue("email", "");
      setValue("name", "");
      setValue("message", "");

      window.location.reload();
    } catch (err: any) {
      throw new Error(`Error! ${err.message}`);
    }
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
