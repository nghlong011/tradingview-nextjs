import { UAParser } from 'ua-parser-js';
import { isBot, isAIBot } from 'ua-parser-js/helpers';

/**
 * Kết quả parse user-agent
 */
export interface ParsedUserAgent {
  browser?: {
    name?: string;
    version?: string;
  };
  device?: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  engine?: {
    name?: string;
    version?: string;
  };
  os?: {
    name?: string;
    version?: string;
  };
  cpu?: {
    architecture?: string;
  };
  // UAParser specific fields
  ua?: string;
  isBot?: boolean;
  isAIBot?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
}

/**
 * Parse user-agent string thành thông tin chi tiết
 */
export function parseUserAgent(userAgent: string | null): ParsedUserAgent | null {
  if (!userAgent) {
    return null;
  }

  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Sử dụng helper methods của UAParser.js để detect bot
    // isBot() - detect tất cả các loại bot (crawlers, spiders, etc.)
    // isAIBot() - detect AI crawlers cụ thể (GPTBot, ClaudeBot, etc.)
    const botDetected = isBot(userAgent);
    const aiBotDetected = isAIBot(userAgent);

    // Kiểm tra device type
    const deviceType = parser.getDevice().type;
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';
    const isDesktop = !isMobile && !isTablet && !botDetected;

    return {
      browser: {
        name: result.browser.name,
        version: result.browser.version,
      },
      device: {
        model: result.device.model,
        type: result.device.type,
        vendor: result.device.vendor,
      },
      engine: {
        name: result.engine.name,
        version: result.engine.version,
      },
      os: {
        name: result.os.name,
        version: result.os.version,
      },
      cpu: {
        architecture: result.cpu.architecture,
      },
      ua: userAgent,
      isBot: botDetected,
      isAIBot: aiBotDetected,
      isMobile,
      isTablet,
      isDesktop,
    };
  } catch (error) {
    console.error('Error parsing user-agent:', error);
    return null;
  }
}

/**
 * Format parsed user-agent thành string ngắn gọn để hiển thị
 */
export function formatParsedUA(parsed: ParsedUserAgent | null): string {
  if (!parsed) {
    return 'Unknown';
  }

  const parts: string[] = [];

  if (parsed.browser?.name) {
    const browser = parsed.browser.version 
      ? `${parsed.browser.name} ${parsed.browser.version}`
      : parsed.browser.name;
    parts.push(browser);
  }

  if (parsed.os?.name) {
    const os = parsed.os.version
      ? `${parsed.os.name} ${parsed.os.version}`
      : parsed.os.name;
    parts.push(`on ${os}`);
  }

  if (parsed.device?.type) {
    parts.push(`(${parsed.device.type})`);
  }

  if (parsed.isBot) {
    parts.push('[BOT]');
  }

  return parts.length > 0 ? parts.join(' ') : 'Unknown';
}
