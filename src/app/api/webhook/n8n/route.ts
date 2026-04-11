import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhook/n8n
 *
 * Webhook endpoint for n8n workflow integration.
 * Validates shared secret, routes to appropriate handler.
 *
 * Actions:
 *   - "new_submission" — trigger new tool intake
 *   - "update_tool" — push tool updates from n8n
 *   - "log_execution" — log workflow execution results
 */
export async function POST(req: NextRequest) {
  // Authenticate via shared secret
  const secret = req.headers.get("x-webhook-secret");
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action as string;

    switch (action) {
      case "new_submission":
        return handleNewSubmission(body.data);

      case "update_tool":
        return handleToolUpdate(body.data);

      case "log_execution":
        return handleLogExecution(body.data);

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

async function handleNewSubmission(data: Record<string, unknown>) {
  // In production: validate and insert into submissions table via Supabase
  console.log("[n8n] New submission received:", data);
  return NextResponse.json({ status: "received", action: "new_submission" });
}

async function handleToolUpdate(data: Record<string, unknown>) {
  // In production: update tool record via Supabase service role
  console.log("[n8n] Tool update received:", data);
  return NextResponse.json({ status: "received", action: "update_tool" });
}

async function handleLogExecution(data: Record<string, unknown>) {
  // In production: insert into automation_logs via Supabase
  console.log("[n8n] Execution log received:", data);
  return NextResponse.json({ status: "logged", action: "log_execution" });
}
