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
 * Kiểm tra các headers phổ biến: x-forwarded-for, x-real-ip, cf-connecting-ip, x-client-ip
 */
export function getClientIp(headers: Headers): string | null {
  // Kiểm tra x-forwarded-for (thường có nhiều IP, lấy IP đầu tiên)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // Kiểm tra các headers khác
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xClientIp = headers.get('x-client-ip');
  if (xClientIp) return xClientIp;

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
 * Kiểm tra xem organization có phải là IP doanh nghiệp/công ty không
 * Dựa vào keywords trong organization name
 */
export function isBusinessIp(organization: string | null): boolean {
  if (!organization) {
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
 * Function chính để phân tích IP và quyết định có cho phép truy cập không
 * 
 * Flow:
 * 1. Lấy IP từ request headers
 * 2. Nếu không có IP → trả về false (fail-safe)
 * 3. Lấy ASN info từ GeoLite2-ASN.mmdb
 * 4. Kiểm tra proxy/VPN → nếu phát hiện → return false
 * 5. Kiểm tra IP doanh nghiệp → nếu phát hiện → return false
 * 6. Nếu không phát hiện cả hai → return true
 * 
 * @param headers - Next.js headers object
 * @returns Promise<boolean> - true nếu cho phép truy cập, false nếu không
 */
export async function analyzeIpAccess(headers: Headers): Promise<boolean> {
  try {
    // 1. Lấy IP từ request headers
    const ip = getClientIp(headers);
    
    if (!ip) {
      console.warn('Could not determine client IP address');
      return false; // Fail-safe: không có IP → không cho phép
    }

    // 2. Xử lý localhost - trong development có thể cho phép, production thì không
    if (isLocalhost(ip)) {
      // Trong development mode, có thể cho phép localhost để test
      // Trong production, nên block localhost
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        console.log(`Development mode: Allowing localhost IP ${ip}`);
        return true;
      } else {
        console.warn(`Blocked: Localhost IP detected in production: ${ip}`);
        return false;
      }
    }

    // 3. Lấy thông tin ASN
    const asnInfo = await getAsnInfo(ip);
    
    if (!asnInfo.organization) {
      console.warn(`Could not determine ASN organization for IP: ${ip}`);
      return false; // Fail-safe: không có organization → không cho phép
    }

    // 4. Kiểm tra proxy/VPN
    if (isProxyOrVpn(asnInfo.organization)) {
      console.log(`Blocked: Proxy/VPN detected for IP ${ip}, Organization: ${asnInfo.organization}`);
      return false;
    }

    // 5. Kiểm tra IP doanh nghiệp
    if (isBusinessIp(asnInfo.organization)) {
      console.log(`Blocked: Business IP detected for IP ${ip}, Organization: ${asnInfo.organization}`);
      return false;
    }

    // 6. Không phát hiện proxy/VPN hoặc doanh nghiệp → cho phép
    console.log(`Allowed: IP ${ip}, Organization: ${asnInfo.organization}`);
    return true;

  } catch (error) {
    console.error('Error in analyzeIpAccess:', error);
    return false; // Fail-safe: có lỗi → không cho phép
  }
}
