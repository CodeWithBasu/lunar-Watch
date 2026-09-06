export interface NasaApodResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
}

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
const NASA_BASE_URL = "https://api.nasa.gov";

export async function getAstronomyPictureOfTheDay(): Promise<NasaApodResponse | null> {
  try {
    const response = await fetch(
      `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      // Rate limit or other API error - fail silently so UI error state takes over
      return null;
    }

    const data: NasaApodResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

