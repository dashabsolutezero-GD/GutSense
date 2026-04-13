import { SupabaseClient } from "@supabase/supabase-js";

// Free tier limits
export const FREE_LIMITS = {
  scans_per_day: 3,
  chats_per_day: 5,
};

export const PLUS_LIMITS = {
  scans_per_day: 20,
  chats_per_day: 50,
};

export const PRO_LIMITS = {
  scans_per_day: 999,
  chats_per_day: 999,
};

export function getLimits(tier: string) {
  if (tier === "pro") return PRO_LIMITS;
  if (tier === "plus") return PLUS_LIMITS;
  return FREE_LIMITS;
}

export async function getUsage(supabase: SupabaseClient, userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage_tracking")
    .select("scan_count, chat_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  return {
    scan_count: data?.scan_count ?? 0,
    chat_count: data?.chat_count ?? 0,
  };
}

export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  type: "scan" | "chat"
) {
  const today = new Date().toISOString().split("T")[0];
  const column = type === "scan" ? "scan_count" : "chat_count";

  // Try to upsert — increment if exists, create if not
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, scan_count, chat_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({ [column]: (existing[column] ?? 0) + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      scan_count: type === "scan" ? 1 : 0,
      chat_count: type === "chat" ? 1 : 0,
    });
  }
}

export async function checkLimit(
  supabase: SupabaseClient,
  userId: string,
  type: "scan" | "chat",
  tier: string = "free"
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const usage = await getUsage(supabase, userId);
  const limits = getLimits(tier);
  const used = type === "scan" ? usage.scan_count : usage.chat_count;
  const limit =
    type === "scan" ? limits.scans_per_day : limits.chats_per_day;

  return { allowed: used < limit, used, limit };
}
