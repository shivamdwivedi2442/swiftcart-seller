import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seller_token")?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      redirect("/dashboard");
    } catch {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }
}