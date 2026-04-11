"use client";

import { useState } from "react";
import { Mail, MessageSquare, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="rounded-xl border border-success/20 bg-success-bg p-12 text-center max-w-md">
          <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold text-navy mb-2">Message Received</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for reaching out. We typically respond within 1–2 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          <p className="mt-4 text-base text-navy-200">Questions, partnerships, or feedback — we&apos;d love to hear from you.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email", detail: "hello@districtaiindex.com", sub: "General inquiries and support" },
              { icon: Building2, title: "Vendor Relations", detail: "vendors@districtaiindex.com", sub: "Listing plans, featured placements, partnerships" },
              { icon: MessageSquare, title: "Editorial", detail: "editorial@districtaiindex.com", sub: "Tool reviews, corrections, and methodology questions" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-navy">{item.title}</h2>
                </div>
                <p className="text-sm text-accent-blue font-medium">{item.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-navy mb-2">Send a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-charcoal-light mb-1.5">
                    Name <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input id="contact-name" type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-charcoal-light mb-1.5">
                    Email <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input id="contact-email" type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" placeholder="you@school.edu" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-charcoal-light mb-1.5">Subject</label>
                <select id="contact-subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue">
                  <option value="general">General Inquiry</option>
                  <option value="vendor">Vendor / Listing Plans</option>
                  <option value="editorial">Editorial / Tool Review</option>
                  <option value="accessibility">Accessibility Issue</option>
                  <option value="partnership">Partnership</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-charcoal-light mb-1.5">
                  Message <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <textarea id="contact-message" required rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-y" placeholder="How can we help?" />
              </div>

              <button type="submit" className="w-full rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
