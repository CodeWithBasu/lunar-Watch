import { NextResponse } from "next/server"
import { Resend } from "resend"
import twilio from "twilio"

// Initialize SDKs (They will fail gracefully if env keys are missing)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

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
        subject: "Welcome to Moon Tracker Alerts! 🌕",
        html: "<p>You have successfully subscribed to <strong>Lunar Alerts</strong>! We will notify you about upcoming Supermoons and Eclipses.</p>",
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 })
      }
    } 
    
    else if (type === "sms") {
      if (!twilioClient) {
        console.log(`[MOCK SMS] To: ${contact} - Keys not configured`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return NextResponse.json({ success: true, message: `Mock SMS sent to ${contact}` })
      }

      const message = await twilioClient.messages.create({
        body: "Welcome to Moon Tracker Alerts! 🌕 You are now subscribed.",
        from: process.env.TWILIO_PHONE_NUMBER, // e.g., "+1234567890"
        to: contact
      });
      
      if (message.errorMessage) {
        return NextResponse.json({ error: message.errorMessage }, { status: 400 })
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

