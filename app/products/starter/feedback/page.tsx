"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VvaiProductShell } from "@/components/vvai-product-shell";

export default function StarterFeedbackPage() {
  const [businessType, setBusinessType] = useState("");
  const [rating, setRating] = useState("");
  const [wouldUseAgain, setWouldUseAgain] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          rating,
          wouldUseAgain,
          feedback,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Unable to save feedback right now." })) as { error?: string };
        throw new Error(data.error || "Unable to save feedback right now.");
      }

      setSubmitted(true);
      setFeedback("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save feedback right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/products/starter" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={15} /> Back to dashboard</Link>
        <p className="mt-8 text-xs font-bold tracking-[.2em] text-cyan">VVAI FEEDBACK</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Help us improve VvAI Business Health Dashboard</h1>
        <p className="mt-5 leading-7 text-slate-400">Your feedback is saved to the VvAI Feedback Database so we can improve the product for real business owners.</p>
        <Card className="mt-8 border-white/[.09] bg-white/[.025] p-5 md:p-6">
          {submitted && <div className="mb-5 rounded-lg border border-cyan/20 bg-cyan/[.08] p-5">
            <h2 className="text-xl font-semibold text-white">Thank you for the feedback.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Your response has been recorded.</p>
          </div>}
          <form className="grid gap-5" onSubmit={submitFeedback}>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              Business Type <span className="font-normal text-slate-500">Optional</span>
              <Input value={businessType} onChange={(event) => setBusinessType(event.target.value)} placeholder="Restaurant, retail, e-commerce..." />
            </label>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-slate-300">Rating <span className="text-cyan">*</span></legend>
              <div className="grid gap-2 sm:grid-cols-5">
                {["1", "2", "3", "4", "5"].map((value) => <label key={value} className="rounded-lg border border-white/[.08] bg-black/20 px-3 py-3 text-center text-sm text-slate-400">
                  <input required className="mr-2" type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
                  {value}
                </label>)}
              </div>
            </fieldset>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-slate-300">Would you use this again? <span className="text-cyan">*</span></legend>
              <div className="flex gap-3">
                {["Yes", "Maybe", "No"].map((value) => <label key={value} className="flex items-center gap-2 rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm text-slate-400">
                  <input required type="radio" name="would-use-again" value={value} checked={wouldUseAgain === value} onChange={() => setWouldUseAgain(value)} />
                  {value}
                </label>)}
              </div>
            </fieldset>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              Feedback <span className="font-normal text-slate-500">Optional</span>
              <Textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="What should VvAI improve or explain better?" />
            </label>
            <Button className="w-full md:w-fit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Feedback"}</Button>
            {error && <p className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">Feedback could not be saved. Please try again later.</p>}
          </form>
        </Card>
      </div>
    </section>
  </VvaiProductShell>;
}
