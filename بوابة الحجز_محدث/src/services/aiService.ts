/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SearchResult {
  id: string;
  type: 'flight' | 'package';
  title: string;
  description: string;
  price: number;
  airline: string;
  rating: number;
  duration: string;
}

export async function searchTravel(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Failed to communicate with AI engine");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
