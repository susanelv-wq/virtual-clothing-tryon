import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Check environment variables (safely - don't expose full key)
  const hasFashnKey = !!process.env.FASHN_API_KEY
  const keyLength = process.env.FASHN_API_KEY?.length || 0
  const keyPrefix = process.env.FASHN_API_KEY?.substring(0, 10) || ""

  return NextResponse.json({
    hasFashnKey,
    keyLength,
    keyPrefix: keyPrefix + "...",
    message: hasFashnKey 
      ? "✅ FASHN_API_KEY is set" 
      : "❌ FASHN_API_KEY is NOT set - check .env.local",
  })
}
