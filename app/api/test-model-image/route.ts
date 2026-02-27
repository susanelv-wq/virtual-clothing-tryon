import { NextRequest, NextResponse } from "next/server"
import { getModelImageUrl } from "@/lib/model-gallery"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pose = searchParams.get("pose") || "standing-front"
    const skinTone = searchParams.get("skinTone") || "medium"
    const bodyType = searchParams.get("bodyType") || "average"

    const modelUrl = getModelImageUrl(pose, skinTone, bodyType)

    if (!modelUrl) {
      return NextResponse.json({
        error: "No model image URL found",
        pose,
        skinTone,
        bodyType,
      })
    }

    // Test if URL is accessible
    try {
      const response = await fetch(modelUrl, { method: "HEAD" })
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        modelUrl,
        pose,
        skinTone,
        bodyType,
        accessible: response.ok,
      })
    } catch (err) {
      return NextResponse.json({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        modelUrl,
        pose,
        skinTone,
        bodyType,
        accessible: false,
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
