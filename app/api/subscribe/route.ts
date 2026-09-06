import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { contact, type } = body

    if (!contact) {
      return NextResponse.json({ error: "Contact information is required" }, { status: 400 })
    }

    if (type === "email") {
      if (!resend) {
        console.log(`[MOCK EMAIL] To: ${contact} - Keys not configured`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return NextResponse.json({ success: true, message: `Mock email sent to ${contact}` })
      }
      
      const { data, error } = await resend.emails.send({
        from: "Moon Tracker <onboarding@resend.dev>",
        to: [contact],
        subject: "Welcome to Moon Tracker Alerts by BASUDEV! 🌕",
        html: "<p>Hello! You have successfully subscribed to <strong>Lunar Alerts by BASUDEV</strong>!</p><p>We will notify you about upcoming Supermoons, Eclipses, and special stargazing conditions.</p>",
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 })
      }
    } 

    return NextResponse.json({ 
      success: true, 
      message: `Successfully subscribed ${contact} to lunar alerts!` 
    })
  } catch (error: any) {
    console.error("Subscription Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

