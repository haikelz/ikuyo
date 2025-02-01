import { libsql } from "@/utils/libsql";

export async function GET() {
  try {
    const { rows } = await libsql.execute(
      "SELECT id, created_at, username, message FROM guestbook"
    );

    return new Response(
      JSON.stringify({
        status_code: 200,
        message: "Success get guestbook!",
        data: rows,
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
