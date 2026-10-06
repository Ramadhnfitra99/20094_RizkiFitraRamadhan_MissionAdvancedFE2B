"use client";

import { continueWatching, newReleases, topRated, trending } from "../data/media";
import { useMoviesApi } from "../hooks/useMoviesApi";
import { useMyList } from "../hooks/useMyList";
import { CustomMoviesCrud } from "./CustomMoviesCrud";
import { Hero } from "./Hero";
import { MediaRow } from "./MediaCatalog";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function HomeContent() {
  const { error, isSaved, pendingIds, toggle } = useMyList();
  const {
    movies,
    loading,
    pending,
    error: apiError,
    lastSyncedAt,
    refresh,
    createMovie,
    updateMovie,
    deleteMovie,
  } = useMoviesApi();

  return (
    <>
      <SiteHeader active="home" />
      <main>
        <Hero />
        <div className="container catalog">
          <CustomMoviesCrud
            movies={movies}
            loading={loading}
            pending={pending}
            apiError={apiError}
            lastSyncedAt={lastSyncedAt}
            onRefresh={refresh}
            onCreate={createMovie}
            onUpdate={updateMovie}
            onDelete={deleteMovie}
          />
          {error && <p className="my-list-notice" role="status">{error}</p>}
          <MediaRow id="daftar-saya" title="Melanjutkan Tonton Film" items={continueWatching} variant="landscape" isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="series" title="Top Rating Film dan Series Hari Ini" items={topRated} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="film" title="Film Trending" items={trending} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow title="Rilis Baru" items={newReleases} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function HomePage() {
  return <HomeContent />;
}
