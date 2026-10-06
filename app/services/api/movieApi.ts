import type { ManagedMovie, MovieDraft } from "../../data/managedMovies";

type ApiMovieData = {
  genre?: unknown;
  rating?: unknown;
  year?: unknown;
  poster?: unknown;
};

type ApiMovieRecord = {
  id?: unknown;
  name?: unknown;
  data?: ApiMovieData | null;
};

const REQUEST_TIMEOUT_MS = 12_000;

function apiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_MOVIE_API_URL?.trim();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_MOVIE_API_URL belum diatur. Salin .env.example menjadi .env.local.",
    );
  }
  return url.replace(/\/$/, "");
}

function toApiPayload(movie: MovieDraft) {
  return {
    name: movie.title,
    data: {
      genre: movie.genre,
      rating: movie.rating,
      year: movie.year,
      poster: movie.poster,
      application: "chill-advanced-fe2b",
    },
  };
}

function toMovie(record: ApiMovieRecord): ManagedMovie {
  if (
    typeof record.id !== "string" ||
    typeof record.name !== "string" ||
    !record.data ||
    typeof record.data.genre !== "string" ||
    typeof record.data.rating !== "number" ||
    typeof record.data.year !== "number" ||
    typeof record.data.poster !== "string"
  ) {
    throw new Error("Format data film dari API tidak valid.");
  }

  return {
    id: record.id,
    title: record.name,
    genre: record.data.genre,
    rating: record.data.rating,
    year: record.data.year,
    poster: record.data.poster,
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      let apiMessage = "";
      try {
        const body = (await response.json()) as { error?: string; message?: string };
        apiMessage = body.error ?? body.message ?? "";
      } catch {
        // Respons error tidak selalu berformat JSON.
      }
      throw new Error(apiMessage || `API merespons dengan status ${response.status}.`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Permintaan API terlalu lama. Silakan coba lagi.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function getMovies(ids: string[]): Promise<ManagedMovie[]> {
  if (!ids.length) return [];

  const params = new URLSearchParams({ id: ids.join(",") });
  const records = await request<ApiMovieRecord[]>(`${apiBaseUrl()}?${params}`);
  return records.map(toMovie);
}

export async function addMovie(movie: MovieDraft): Promise<ManagedMovie> {
  const record = await request<ApiMovieRecord>(apiBaseUrl(), {
    method: "POST",
    body: JSON.stringify(toApiPayload(movie)),
  });
  return toMovie(record);
}

export async function updateMovie(
  id: string,
  movie: MovieDraft,
): Promise<ManagedMovie> {
  const record = await request<ApiMovieRecord>(`${apiBaseUrl()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiPayload(movie)),
  });
  return toMovie(record);
}

export async function deleteMovie(id: string): Promise<void> {
  await request<{ message: string }>(`${apiBaseUrl()}/${id}`, {
    method: "DELETE",
  });
}
