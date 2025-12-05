import { RatingData, DashboardStats } from "@/types";

export class RatingService {
  private static readonly API_ENDPOINT = "/api/ratings";

  static async submitRating(data: RatingData): Promise<{ success: boolean }> {
    const response = await fetch(this.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit rating: ${response.status}`);
    }

    return await response.json();
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.API_ENDPOINT}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    return await response.json();
  }

  static async getRatings(sessionId?: string, limit?: number): Promise<{ ratings: any[] }> {
    const params = new URLSearchParams();
    if (sessionId) params.set("sessionId", sessionId);
    if (limit) params.set("limit", limit.toString());

    const url = params.toString() ? `${this.API_ENDPOINT}?${params.toString()}` : this.API_ENDPOINT;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ratings: ${response.status}`);
    }

    return await response.json();
  }

  static async getAIAnalysis(): Promise<any> {
    const response = await fetch(`${this.API_ENDPOINT}/analyze`);

    if (!response.ok) {
      throw new Error(`Failed to get AI analysis: ${response.status}`);
    }

    return await response.json();
  }
}
