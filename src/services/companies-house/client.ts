const CH_BASE_URL = "https://api.company-information.service.gov.uk";

export class CompaniesHouseError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(`Companies House API error (${statusCode}): ${message}`);
    this.name = "CompaniesHouseError";
  }
}

class CompaniesHouseClient {
  private apiKey: string;
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly MAX_REQUESTS = 580; // Stay under 600/5min limit
  private readonly WINDOW_MS = 5 * 60 * 1000;

  constructor() {
    const key = process.env.COMPANIES_HOUSE_API_KEY;
    if (!key) throw new Error("COMPANIES_HOUSE_API_KEY not configured");
    this.apiKey = key;
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    if (now - this.windowStart > this.WINDOW_MS) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    if (this.requestCount >= this.MAX_REQUESTS) {
      const waitMs = this.WINDOW_MS - (now - this.windowStart);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    this.requestCount++;
  }

  private getAuthHeader(): string {
    return "Basic " + Buffer.from(this.apiKey + ":").toString("base64");
  }

  async get<T>(path: string): Promise<T> {
    await this.checkRateLimit();
    const response = await fetch(`${CH_BASE_URL}${path}`, {
      headers: { Authorization: this.getAuthHeader() },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new CompaniesHouseError(response.status, await response.text());
    }
    return response.json() as Promise<T>;
  }
}

let clientInstance: CompaniesHouseClient | null = null;

export function getCompaniesHouseClient(): CompaniesHouseClient {
  if (!clientInstance) {
    clientInstance = new CompaniesHouseClient();
  }
  return clientInstance;
}
