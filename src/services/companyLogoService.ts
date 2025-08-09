// Company logo service to automatically fetch company logos
export interface CompanyLogoResult {
  logoUrl?: string;
  success: boolean;
  source?: string;
}

// Common company logos mapping for popular companies
const KNOWN_COMPANY_LOGOS: Record<string, string> = {
  'google': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
  'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  'meta': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
  'facebook': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
  'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'tesla': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
  'uber': 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg',
  'airbnb': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
  'spotify': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  'twitter': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  'linkedin': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  'instagram': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
  'whatsapp': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  'slack': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
  'zoom': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
  'salesforce': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
  'adobe': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg',
  'oracle': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
  'ibm': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  'intel': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
  'nvidia': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
  'paypal': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  'stripe': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  'shopify': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
  'dropbox': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg',
  'github': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  'gitlab': 'https://upload.wikimedia.org/wikipedia/commons/1/18/GitLab_Logo.svg',
  'atlassian': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Atlassian_logo.svg',
  'mongodb': 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',
  'redis': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg',
  'docker': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg',
  'kubernetes': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg'
};

// Normalize company name for matching
function normalizeCompanyName(name: string): string {
  return name.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/(inc|corp|corporation|llc|ltd|limited|company|co)$/i, '') // Remove company suffixes
    .trim();
}

// Try to get logo from known companies first
function getKnownCompanyLogo(companyName: string): CompanyLogoResult {
  const normalized = normalizeCompanyName(companyName);
  
  // Direct match
  if (KNOWN_COMPANY_LOGOS[normalized]) {
    return {
      logoUrl: KNOWN_COMPANY_LOGOS[normalized],
      success: true,
      source: 'known_companies'
    };
  }
  
  // Partial match - check if company name contains any known company
  for (const [key, logoUrl] of Object.entries(KNOWN_COMPANY_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        logoUrl,
        success: true,
        source: 'known_companies_partial'
      };
    }
  }
  
  return { success: false };
}

// Try to fetch logo from Clearbit API (free tier has limitations)
async function getClearbitLogo(companyName: string): Promise<CompanyLogoResult> {
  try {
    // Generate a likely domain from company name
    const normalized = normalizeCompanyName(companyName);
    const domain = `${normalized}.com`;
    
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    
    // Test if the logo exists by trying to fetch it
    const response = await fetch(logoUrl, { 
      method: 'HEAD',
      mode: 'no-cors' // To avoid CORS issues
    });
    
    return {
      logoUrl,
      success: true,
      source: 'clearbit'
    };
  } catch (error) {
    return { success: false };
  }
}

// Try to fetch logo from Logo.dev API (alternative service)
async function getLogoDevLogo(companyName: string): Promise<CompanyLogoResult> {
  try {
    const normalized = normalizeCompanyName(companyName);
    const domain = `${normalized}.com`;
    
    const logoUrl = `https://img.logo.dev/${domain}?token=pk_X-1ZO13ESEOuGCj8HREGqQ&format=png&size=200`;
    
    return {
      logoUrl,
      success: true,
      source: 'logodev'
    };
  } catch (error) {
    return { success: false };
  }
}

// Try to generate a favicon URL
function getFaviconLogo(companyName: string): CompanyLogoResult {
  try {
    const normalized = normalizeCompanyName(companyName);
    const domain = `${normalized}.com`;
    
    // Try different favicon approaches
    const faviconUrls = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://favicon.yandex.net/favicon/${domain}`,
      `https://${domain}/favicon.ico`
    ];
    
    return {
      logoUrl: faviconUrls[0], // Use Google's favicon service as primary
      success: true,
      source: 'favicon'
    };
  } catch (error) {
    return { success: false };
  }
}

// Main function to fetch company logo
export async function fetchCompanyLogo(companyName: string): Promise<CompanyLogoResult> {
  if (!companyName || companyName.trim().length === 0) {
    return { success: false };
  }
  
  // Try known companies first (fastest)
  const knownResult = getKnownCompanyLogo(companyName);
  if (knownResult.success) {
    return knownResult;
  }
  
  // Try Clearbit (good quality, but may have limitations)
  try {
    const clearbitResult = await getClearbitLogo(companyName);
    if (clearbitResult.success) {
      return clearbitResult;
    }
  } catch (error) {
    console.log('Clearbit API failed:', error);
  }
  
  // Try Logo.dev (alternative service)
  try {
    const logoDevResult = await getLogoDevLogo(companyName);
    if (logoDevResult.success) {
      return logoDevResult;
    }
  } catch (error) {
    console.log('Logo.dev API failed:', error);
  }
  
  // Fallback to favicon
  const faviconResult = getFaviconLogo(companyName);
  if (faviconResult.success) {
    return faviconResult;
  }
  
  return { success: false };
}

// Validate if a logo URL is working
export async function validateLogoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true; // If no error thrown, assume it's valid
  } catch (error) {
    return false;
  }
}

// Generate a placeholder logo with company initials
export function generatePlaceholderLogo(companyName: string): string {
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
    
  // Generate a simple SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#4F46E5" rx="12"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central" 
            fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
