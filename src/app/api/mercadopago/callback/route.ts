import { NextRequest, NextResponse } from "next/server"
import { saveMpTokens } from "@/services/users"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https"
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : new URL(request.url).origin
  const code = searchParams.get("code")
  const userId = searchParams.get("state")

  if (!code || !userId) {
    return NextResponse.redirect(`${origin}/onboarding?mp=error`)
  }

  try {
    const tokenRes = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.MP_CLIENT_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.MP_REDIRECT_URI,
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${origin}/onboarding?mp=error`)
    }

    const tokens = await tokenRes.json()

    await saveMpTokens(userId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      mpUserId: String(tokens.user_id),
    })

    return NextResponse.redirect(`${origin}/onboarding?mp=connected`)
  } catch {
    return NextResponse.redirect(`${origin}/onboarding?mp=error`)
  }
}
