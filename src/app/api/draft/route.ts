import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");

    // Check the secret and validate the slug
    if (secret !== process.env.PAYLOAD_SECRET) {
        return new Response("Invalid token", { status: 401 });
    }

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Redirect to the path from the fetched post
    redirect(slug || "/");
}
