/**
 * CRM data model — admin operational tracking
 * Stored in Firestore collections: contacts, interactions, tasks
 */

export type ContactType = "vendor" | "district" | "press" | "partner" | "personal" | "other";

export type PipelineStage =
  | "cold"          // not yet contacted
  | "contacted"     // initial outreach sent
  | "responded"     // they replied
  | "conversation"  // in active discussion
  | "trial"         // free trial active
  | "paid"          // paying customer
  | "churned"       // was paying, lost
  | "declined";     // said no

export type InteractionType = "email" | "phone" | "meeting" | "conversation" | "linkedin" | "event" | "other";

export type InteractionOutcome = "positive" | "neutral" | "negative" | "no_response" | "follow_up_needed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface Contact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  contact_type: ContactType;
  stage: PipelineStage;
  tags: string[];
  source?: string;                // where you met them (LinkedIn, conference, inbound, etc.)
  linked_tool_slug?: string;      // if they're a vendor of a directory tool
  last_contact_date?: string;     // ISO date
  next_follow_up?: string;        // ISO date
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface Interaction {
  id?: string;
  contact_id: string;
  type: InteractionType;
  date: string;                   // ISO date
  subject?: string;
  notes: string;
  outcome: InteractionOutcome;
  follow_up_date?: string;        // ISO date
  created_at?: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  due_date?: string;              // ISO date
  priority: TaskPriority;
  status: TaskStatus;
  related_contact_id?: string;
  related_tool_slug?: string;
  created_at?: string;
  completed_at?: string;
}

export const STAGE_ORDER: PipelineStage[] = [
  "cold",
  "contacted",
  "responded",
  "conversation",
  "trial",
  "paid",
  "churned",
  "declined",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  cold: "Cold / Untouched",
  contacted: "Contacted",
  responded: "Responded",
  conversation: "In Conversation",
  trial: "Free Trial",
  paid: "Paid Customer",
  churned: "Churned",
  declined: "Declined",
};

export const STAGE_COLORS: Record<PipelineStage, string> = {
  cold: "bg-muted text-muted-foreground border-border",
  contacted: "bg-[#EEF2F7] text-accent-blue border-accent-blue/20",
  responded: "bg-[#F3F0FF] text-[#7C3AED] border-[#7C3AED]/20",
  conversation: "bg-warning-bg text-warning border-warning/20",
  trial: "bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]/20",
  paid: "bg-success-bg text-success border-success/20",
  churned: "bg-danger-bg text-danger border-danger/20",
  declined: "bg-muted text-muted-foreground border-border opacity-60",
};
