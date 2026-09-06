import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { contact, type } = body

    if (!contact) {
      return NextResponse.json({ error: "Contact information is required" }, { status: 400 })
    }

    // In a real app, this would save to Supabase and trigger a Twilio/Resend workflow
    // For now, we simulate a successful database insertion
    console.log(`[Mock DB] New subscription added: ${contact} for ${type} alerts`)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({ 
      success: true, 
      message: `Successfully subscribed ${contact} to lunar alerts!` 
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

