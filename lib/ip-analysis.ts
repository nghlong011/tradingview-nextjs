import { Reader } from '@maxmind/geoip2-node';
import { readFileSync } from 'fs';
import { join } from 'path';

// Singleton instance cho MaxMind reader
let readerInstance: ReturnType<typeof Reader.openBuffer> | null = null;

/**
 * Khởi tạo và cache MaxMind reader instance
 */
function getMaxMindReader(): ReturnType<typeof Reader.openBuffer> {
  if (readerInstance) {
    return readerInstance;
  }

  try {
    const dbPath = join(process.cwd(), 'db', 'GeoLite2-ASN.mmdb');
    const buffer = readFileSync(dbPath);
    readerInstance = Reader.openBuffer(buffer);
    return readerInstance;
  } catch (error) {
    console.error('Error loading GeoLite2-ASN.mmdb:', error);
    throw error;
  }
}

/**
 * Lấy IP address từ request headers
 * Đơn giản: chỉ bỏ qua Vercel screenshot service, còn lại lấy IP đầu tiên từ headers
 */
export function getClientIp(headers: Headers): string | null {
  // Kiểm tra user-agent để phát hiện Vercel screenshot service
  const userAgent = headers.get('user-agent') || '';
  const isVercelScreenshot = userAgent.includes('vercel-screenshot') || 
                             userAgent.includes('Vercel-Image-Optimization') ||
                             userAgent.includes('vercel-bot');
  
  // Nếu là Vercel screenshot/bot, bỏ qua request này
  if (isVercelScreenshot) {
    return null;
  }
  
  // Với Vercel, IP thật thường ở đầu chuỗi x-forwarded-for
  // Format: "client-ip, proxy1-ip, proxy2-ip, ..."
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip);
    if (ips.length > 0) {
      // Lấy IP đầu tiên (thường là client IP thật)
      return ips[0];
    }
  }

  // Kiểm tra các headers khác theo thứ tự ưu tiên
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const xClientIp = headers.get('x-client-ip');
  if (xClientIp) {
    return xClientIp;
  }

  // Kiểm tra Vercel-specific header (nếu có)
  const xVercelForwardedFor = headers.get('x-vercel-forwarded-for');
  if (xVercelForwardedFor) {
    const ips = xVercelForwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip);
    if (ips.length > 0) {
      return ips[0];
    }
  }

  return null;
}

/**
 * Kiểm tra xem IP có phải là localhost không
 */
function isLocalhost(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('127.') ||
    ip.startsWith('::ffff:127.')
  );
}

/**
 * Lấy thông tin ASN từ GeoLite2-ASN.mmdb
 */
export async function getAsnInfo(ip: string): Promise<{ asn: number | null; organization: string | null }> {
  // Xử lý localhost - không có trong database
  if (isLocalhost(ip)) {
    return {
      asn: null,
      organization: null,
    };
  }

  try {
    const reader = getMaxMindReader();
    const response = reader.asn(ip);

    return {
      asn: response.autonomousSystemNumber ?? null,
      organization: response.autonomousSystemOrganization ?? null,
    };
  } catch (error: any) {
    // Xử lý lỗi khi IP không tìm thấy trong database
    if (error?.message?.includes('not in the database') || error?.message?.includes('Address not found')) {
      console.warn(`IP ${ip} not found in GeoLite2-ASN database`);
      return {
        asn: null,
        organization: null,
      };
    }
    
    console.error(`Error getting ASN info for IP ${ip}:`, error);
    return {
      asn: null,
      organization: null,
    };
  }
}

/**
 * Kiểm tra xem organization có phải là proxy/VPN không
 * Dựa vào keywords trong organization name
 */
export function isProxyOrVpn(organization: string | null): boolean {
  if (!organization) {
    return false;
  }

  const orgLower = organization.toLowerCase();
  const proxyVpnKeywords = [
    'vpn',
    'proxy',
    'datacenter',
    'data center',
    'hosting',
    'server',
    'cloud',
    'hosting provider',
    'isp',
    'network',
    'telecommunications',
    'hosting services',
    'web hosting',
    'cloud provider',
    'data center provider',
    'hosting company',
    'server provider',
    'vpn provider',
    'proxy service',
    'anonymizer',
    'tor',
    'residential proxy',
  ];

  return proxyVpnKeywords.some(keyword => orgLower.includes(keyword));
}

/**
 * Kiểm tra xem organization có phải là ISP (nhà cung cấp mạng cá nhân) không
 * ISP thường cung cấp dịch vụ internet cho người dùng cá nhân
 */
export function isResidentialISP(organization: string | null): boolean {
  if (!organization) {
    return false;
  }

  const orgLower = organization.toLowerCase();
  
  // Whitelist các ISP phổ biến (có thể mở rộng)
  const ispKeywords = [
    'telecom',
    'telecommunications',
    'internet service',
    'broadband',
    'fiber',
    'cable',
    'dsl',
    'isp',
    'internet provider',
    'network provider',
  ];
  
  // Whitelist các ISP cụ thể (Việt Nam và quốc tế)
  const ispNames = [
    'viettel',
    'fpt telecom',
    'vnpt',
    'cmc telecom',
    'vietnamobile',
    'mobifone',
    'vinaphone',
    'at&t',
    'verizon',
    'comcast',
    'time warner',
    'charter',
    'cox',
    'centurylink',
    'frontier',
    't-mobile',
    'sprint',
    'orange',
    'vodafone',
    'bt',
    'sky',
    'talktalk',
  ];
  
  // Kiểm tra keywords ISP
  const hasIspKeyword = ispKeywords.some(keyword => orgLower.includes(keyword));
  
  // Kiểm tra tên ISP cụ thể
  const hasIspName = ispNames.some(name => orgLower.includes(name));
  
  // Nếu có keyword ISP hoặc tên ISP, nhưng KHÔNG có business keywords → là ISP cá nhân
  if (hasIspKeyword || hasIspName) {
    // Kiểm tra xem có phải là business ISP không (như "Business Internet Service")
    const businessIspKeywords = ['business', 'enterprise', 'corporate', 'commercial'];
    const isBusinessIsp = businessIspKeywords.some(keyword => orgLower.includes(keyword));
    
    // Nếu không phải business ISP → là residential ISP
    return !isBusinessIsp;
  }
  
  return false;
}

/**
 * Kiểm tra xem organization có phải là IP doanh nghiệp/công ty không
 * Loại trừ các ISP cá nhân (residential ISP)
 */
export function isBusinessIp(organization: string | null): boolean {
  if (!organization) {
    return false;
  }

  // Nếu là residential ISP → không phải business IP
  if (isResidentialISP(organization)) {
    return false;
  }

  const orgLower = organization.toLowerCase();
  const businessKeywords = [
    'corp',
    'corporation',
    'inc',
    'llc',
    'ltd',
    'limited',
    'company',
    'enterprise',
    'business',
    'group',
    'holdings',
    'industries',
    'co.',
    'co ',
    's.a.',
    's.a ',
    'ag',
    'gmbh',
    'plc',
    'pty',
    'pty ltd',
    'srl',
    'spa',
    'nv',
    'bv',
    'sa',
    'sas',
    'sarl',
    'oy',
    'ab',
    'as',
    'oyj',
    'kk',
    'kabushiki kaisha',
    'zaibatsu',
    'chaebol',
  ];

  return businessKeywords.some(keyword => orgLower.includes(keyword));
}

/**
 * Kiểm tra user-agent có phải là editor/bot cần chặn không
 * Chặn các code editor, development tools, và bot không mong muốn
 */
export function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) {
    return false;
  }

  const uaLower = userAgent.toLowerCase();
  
  // Danh sách các user-agent cần chặn
  const blockedUserAgents = [
    'cursor',           // Cursor editor
    'vscode',          // Visual Studio Code
    'code-server',     // VS Code Server
    'insomnia',        // Insomnia API client
    'postman',         // Postman
    'httpie',          // HTTPie
    'curl',            // cURL (có thể chặn hoặc không tùy nhu cầu)
    'wget',            // wget
    'python-requests', // Python requests library
    'go-http-client',  // Go HTTP client
    'java/',           // Java HTTP clients
    'node-fetch',      // Node.js fetch
    'axios',           // Axios HTTP client
    'okhttp',          // OkHttp (Android/Java)
    'apache-httpclient', // Apache HTTP Client
    'scrapy',          // Scrapy web crawler
    'headless',        // Headless browsers
    'phantomjs',       // PhantomJS
    'selenium',        // Selenium
    'puppeteer',       // Puppeteer
    'playwright',      // Playwright
  ];

  return blockedUserAgents.some(blocked => uaLower.includes(blocked));
}

/**
 * Kết quả phân tích IP access
 */
export interface IpAccessResult {
  allowed: boolean;
  reason?: string;
  details?: {
    ip: string;
    organization?: string | null;
    asn?: number | null;
  };
}

/**
 * Function chính để phân tích IP và quyết định có cho phép truy cập không
 * 
 * Flow:
 * 1. Kiểm tra user-agent → nếu bị chặn → return false
 * 2. Lấy IP từ request headers
 * 3. Nếu không có IP → trả về false (fail-safe)
 * 4. Xử lý localhost - trong development có thể cho phép, production thì không
 * 5. Lấy ASN info từ GeoLite2-ASN.mmdb
 * 6. Kiểm tra proxy/VPN → nếu phát hiện → return false
 * 7. Kiểm tra IP doanh nghiệp → nếu phát hiện → return false
 * 8. Nếu không phát hiện cả hai → return true
 * 
 * @param headers - Next.js headers object
 * @returns Promise<IpAccessResult> - Kết quả phân tích với chi tiết
 */
export async function analyzeIpAccess(headers: Headers): Promise<IpAccessResult> {
  try {
    // 0. Kiểm tra user-agent trước (chặn sớm để tiết kiệm tài nguyên)
    const userAgent = headers.get('user-agent') || '';
    if (isBlockedUserAgent(userAgent)) {
      // Lấy IP để log (có thể là null nếu chưa parse)
      const ip = getClientIp(headers) || 'unknown';
      console.log(`Blocked: Blocked user-agent detected: ${userAgent.substring(0, 100)}`);
      return {
        allowed: false,
        reason: 'BLOCKED_USER_AGENT',
        details: { ip },
      };
    }
    
    // 1. Lấy IP từ request headers
    const ip = getClientIp(headers);
    
    // Debug: Log headers nếu không lấy được IP (chỉ trong development)
    if (!ip && process.env.NODE_ENV === 'development') {
      const xForwardedFor = headers.get('x-forwarded-for') || '';
      console.log('Debug - Could not get IP:', {
        userAgent,
        xForwardedFor,
        xRealIp: headers.get('x-real-ip'),
        cfConnectingIp: headers.get('cf-connecting-ip'),
      });
    }
    
    if (!ip) {
      console.warn('Could not determine client IP address');
      // Vẫn trả về với ip: 'unknown' để có thể lưu log
      // Không return sớm để có thể log request này
      return {
        allowed: false,
        reason: 'NO_IP',
        details: { ip: 'unknown' },
      };
    }

    // 2. Xử lý localhost - trong development có thể cho phép, production thì không
    if (isLocalhost(ip)) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        console.log(`Development mode: Allowing localhost IP ${ip}`);
        return {
          allowed: true,
          details: { ip },
        };
      } else {
        console.warn(`Blocked: Localhost IP detected in production: ${ip}`);
        return {
          allowed: false,
          reason: 'LOCALHOST_PRODUCTION',
          details: { ip },
        };
      }
    }

    // 3. Lấy thông tin ASN
    const asnInfo = await getAsnInfo(ip);
    
    if (!asnInfo.organization) {
      console.warn(`Could not determine ASN organization for IP: ${ip}`);
      return {
        allowed: false,
        reason: 'NO_ASN_ORGANIZATION',
        details: {
          ip,
          organization: null,
          asn: asnInfo.asn,
        },
      };
    }

    // 4. Kiểm tra proxy/VPN
    if (isProxyOrVpn(asnInfo.organization)) {
      console.log(`Blocked: Proxy/VPN detected for IP ${ip}, Organization: ${asnInfo.organization}`);
      return {
        allowed: false,
        reason: 'PROXY_VPN_DETECTED',
        details: {
          ip,
          organization: asnInfo.organization,
          asn: asnInfo.asn,
        },
      };
    }

    // 5. Kiểm tra IP doanh nghiệp
    if (isBusinessIp(asnInfo.organization)) {
      console.log(`Blocked: Business IP detected for IP ${ip}, Organization: ${asnInfo.organization}`);
      return {
        allowed: false,
        reason: 'BUSINESS_IP_DETECTED',
        details: {
          ip,
          organization: asnInfo.organization,
          asn: asnInfo.asn,
        },
      };
    }

    // 6. Không phát hiện user-agent bị chặn, proxy/VPN hoặc doanh nghiệp → cho phép
    console.log(`Allowed: IP ${ip}, Organization: ${asnInfo.organization}`);
    return {
      allowed: true,
      details: {
        ip,
        organization: asnInfo.organization,
        asn: asnInfo.asn,
      },
    };

  } catch (error) {
    console.error('Error in analyzeIpAccess:', error);
    return {
      allowed: false,
      reason: 'ERROR',
      details: { ip: 'unknown' },
    };
  }
}
