import { NextResponse } from "next/server";

const feedbackWebAppUrl = "https://script.google.com/macros/s/AKfycbwJx9qjIPU5kBt5qsnHjL7L16XWHoBMX2uaZpmKLsNv5gCEVTHh5B-Gfse6O_mxj58/exec";

type FeedbackPayload = {
  businessType?: string;
  rating?: string;
  wouldUseAgain?: string;
  feedback?: string;
};

export async function POST(request: Request) {
  try {
    const payload = await request.json() as FeedbackPayload;
    const rating = payload.rating?.trim();
    const wouldUseAgain = payload.wouldUseAgain?.trim();

    if (!rating) {
      return NextResponse.json({ error: "Rating is required." }, { status: 400 });
    }

    if (!wouldUseAgain) {
      return NextResponse.json({ error: "Would you use this again is required." }, { status: 400 });
    }

    const response = await fetch(feedbackWebAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessType: payload.businessType?.trim() || "",
        rating,
        wouldUseAgain,
        feedback: payload.feedback?.trim() || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script feedback save failed: ${await response.text()}`);
    }

    const text = await response.text();
    if (text) {
      try {
        const data = JSON.parse(text) as { ok?: boolean; success?: boolean; error?: string };
        if (data.ok === false || data.success === false || data.error) {
          throw new Error(data.error || "Google Apps Script feedback save failed.");
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Some Apps Script deployments return plain text on success.
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      row: [
        new Date().toISOString(),
        payload.businessType?.trim() || "",
          rating,
          wouldUseAgain,
        payload.feedback?.trim() || "",
      ],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Feedback could not be saved. Please try again later." }, { status: 500 });
  }
}
