import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const authParams = new URLSearchParams({
    client_id: process.env.MP_CLIENT_ID!,
    response_type: "code",
    platform_id: "mp",
    state: session.user.id,
    redirect_uri: process.env.MP_REDIRECT_URI!,
  })

  const mpAuthUrl = `https://auth.mercadopago.com/authorization?${authParams}`

  return NextResponse.redirect(mpAuthUrl)
}
