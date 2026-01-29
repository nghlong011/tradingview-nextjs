import BotdGate from "@/components/botd-gate";
import { createApiToken } from "@/lib/auth-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Insight Blog - Alternative View",
  description: "Tech Insight Blog alternative view",
};

export default async function Home() {
  let apiToken = "";
  try {
    apiToken = await createApiToken();
  } catch (e) {
    console.error("[page] createApiToken failed:", e);
  }
  return (
    <div className="min-h-screen flex flex-col">
      <main className="overflow-hidden">
        <BotdGate apiToken={apiToken} />
      </main>
    </div>
  );
}
