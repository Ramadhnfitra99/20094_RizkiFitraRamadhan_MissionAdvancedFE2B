import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

function projectFile(path) {
  return new URL(path, projectRoot);
}

async function source(path) {
  return readFile(projectFile(path), "utf8");
}

test("menyediakan route utama mission: login, register, dan home", async () => {
  const [indexPage, loginPage, registerPage, homePage] = await Promise.all([
    source("app/page.tsx"),
    source("app/login/page.tsx"),
    source("app/register/page.tsx"),
    source("app/home/page.tsx"),
  ]);

  assert.match(indexPage, /redirect\("\/login"\)/);
  assert.match(loginPage, /<AuthPage mode="login"\s*\/>/);
  assert.match(registerPage, /<AuthPage mode="register"\s*\/>/);
  assert.match(homePage, /<HomePage\s*\/>/);
});

test("form autentikasi memakai komponen reusable dan props", async () => {
  const [authPage, formField, brandLogo] = await Promise.all([
    source("app/components/AuthPage.tsx"),
    source("app/components/FormField.tsx"),
    source("app/components/BrandLogo.tsx"),
  ]);

  assert.match(authPage, /type AuthPageProps/);
  assert.match(authPage, /mode: "login" \| "register"/);
  assert.match(authPage, /<FormField[\s\S]*name="username"/);
  assert.match(authPage, /name="password"/);
  assert.match(authPage, /name="confirmPassword"/);
  assert.match(authPage, /google\.webp/);
  assert.match(formField, /InputHTMLAttributes<HTMLInputElement>/);
  assert.match(formField, /Tampilkan kata sandi/);
  assert.match(formField, /Sembunyikan kata sandi/);
  assert.match(formField, /eyeopen\.png/);
  assert.match(formField, /eyeclose\.png/);
  assert.match(brandLogo, /type BrandLogoProps/);
});

test("home tersusun dari komponen hierarkis dan data katalog terpisah", async () => {
  const [homePage, hero, catalog, chrome, mediaData] = await Promise.all([
    source("app/components/HomePage.tsx"),
    source("app/components/Hero.tsx"),
    source("app/components/MediaCatalog.tsx"),
    source("app/components/SiteChrome.tsx"),
    source("app/data/media.ts"),
  ]);

  assert.match(homePage, /<SiteHeader active="home"/);
  assert.match(homePage, /<Hero\s*\/>/);
  assert.equal((homePage.match(/<MediaRow/g) ?? []).length, 4);
  assert.match(homePage, /<SiteFooter\s*\/>/);
  assert.match(hero, /Duty After School/);
  assert.match(hero, /export function SoundToggle/);
  assert.match(catalog, /export function MediaRow/);
  assert.match(catalog, /items\.map/);
  assert.match(chrome, /export function SiteHeader/);
  assert.match(chrome, /export function SiteFooter/);
  assert.match(mediaData, /export const continueWatching/);
  assert.match(mediaData, /export const trending/);
  assert.match(mediaData, /export const newReleases/);
});

test("homepage mengimplementasikan CRUD API dengan Redux Toolkit", async () => {
  const [homePage, crudComponent, managedMovies, apiHook, apiService, store, slice, provider, layout, packageJson, envExample] = await Promise.all([
    source("app/components/HomePage.tsx"),
    source("app/components/CustomMoviesCrud.tsx"),
    source("app/data/managedMovies.ts"),
    source("app/hooks/useMoviesApi.ts"),
    source("app/services/api/movieApi.ts"),
    source("app/store/redux/store.ts"),
    source("app/store/redux/moviesSlice.ts"),
    source("app/store/redux/StoreProvider.tsx"),
    source("app/layout.tsx"),
    source("package.json"),
    source(".env.example"),
  ]);

  assert.match(homePage, /useMoviesApi\(\)/);
  assert.match(homePage, /<CustomMoviesCrud[\s\S]*movies=\{movies\}/);
  assert.match(homePage, /onCreate=\{createMovie\}/);
  assert.match(homePage, /onUpdate=\{updateMovie\}/);
  assert.match(homePage, /onDelete=\{deleteMovie\}/);

  assert.match(store, /configureStore/);
  assert.match(store, /movies: moviesReducer/);
  assert.match(slice, /createSlice/);
  assert.match(slice, /createAsyncThunk/);
  assert.match(slice, /items: \[\]/);
  assert.match(slice, /fetchMovies = createAsyncThunk/);
  assert.match(slice, /createMovie = createAsyncThunk/);
  assert.match(slice, /updateMovie = createAsyncThunk/);
  assert.match(slice, /deleteMovie = createAsyncThunk/);
  assert.match(slice, /addCase\(fetchMovies\.fulfilled/);
  assert.match(slice, /addCase\(createMovie\.fulfilled/);
  assert.match(slice, /addCase\(updateMovie\.fulfilled/);
  assert.match(slice, /addCase\(deleteMovie\.fulfilled/);
  assert.match(provider, /<Provider store=\{store\}>/);
  assert.match(layout, /<StoreProvider>\{children\}<\/StoreProvider>/);
  assert.match(packageJson, /"@reduxjs\/toolkit"/);
  assert.match(packageJson, /"react-redux"/);

  assert.match(apiHook, /export function useMoviesApi/);
  assert.match(apiHook, /useAppSelector/);
  assert.match(apiHook, /useAppDispatch/);
  assert.match(apiHook, /dispatch\(fetchMovies\(\)\)/);
  assert.match(apiHook, /dispatch\(createMovieThunk\(draft\)\)/);
  assert.match(apiHook, /dispatch\(updateMovieThunk\(\{ id, draft \}\)\)/);
  assert.match(apiHook, /dispatch\(deleteMovieThunk\(id\)\)/);
  assert.match(apiHook, /window\.localStorage\.setItem/);

  assert.match(apiService, /process\.env\.NEXT_PUBLIC_MOVIE_API_URL/);
  assert.match(apiService, /fetch\(url/);
  assert.match(apiService, /method: "POST"/);
  assert.match(apiService, /method: "PUT"/);
  assert.match(apiService, /method: "DELETE"/);
  assert.match(apiService, /export async function getMovies/);
  assert.match(envExample, /NEXT_PUBLIC_MOVIE_API_URL=https:\/\/api\.restful-api\.dev\/objects/);

  assert.match(crudComponent, /type CustomMoviesCrudProps/);
  assert.match(crudComponent, /movies\.map/);
  assert.match(crudComponent, /onCreate\(movie\)/);
  assert.match(crudComponent, /onUpdate\(editingId, movie\)/);
  assert.match(crudComponent, /onDelete\(movie\.id\)/);
  assert.match(crudComponent, /Kelola Koleksi Film/);
  assert.match(crudComponent, /REDUX TOOLKIT · CRUD API/);
  assert.match(crudComponent, /Redux Store · GET · POST · PUT · DELETE/);
  assert.match(crudComponent, /GET · POST · PUT · DELETE/);
  assert.match(crudComponent, /Mengambil data film dari API/);
  assert.match(crudComponent, /Pilih poster film/);
  assert.match(crudComponent, /posterOptions\.map/);
  assert.match(crudComponent, /aria-pressed=\{selected\}/);
  assert.match(crudComponent, /onChange\("poster", poster\.value\)/);
  assert.ok((crudComponent.match(/unoptimized/g) ?? []).length >= 3);
  assert.match(managedMovies, /initialManagedMovies: ManagedMovie\[\]/);
  assert.ok((managedMovies.match(/id: "managed-/g) ?? []).length >= 4);
});

test("stylesheet dipisahkan dan memiliki breakpoint responsive", async () => {
  const [globals, base, auth, home, pages, footer, responsive] = await Promise.all([
    source("app/globals.css"),
    source("app/styles/base.css"),
    source("app/styles/auth.css"),
    source("app/styles/home.css"),
    source("app/styles/pages.css"),
    source("app/styles/footer.css"),
    source("app/styles/responsive.css"),
  ]);

  for (const stylesheet of ["base", "auth", "home", "pages", "footer", "responsive"]) {
    assert.match(globals, new RegExp(`styles/${stylesheet}\\.css`));
  }
  assert.match(base, /font-family: "Lato"/);
  assert.match(auth, /\.auth-card/);
  assert.match(home, /\.carousel__track/);
  assert.match(home, /\.movie-crud/);
  assert.match(home, /\.managed-movie-grid/);
  assert.match(pages, /\.profile-page/);
  assert.match(footer, /\.footer__inner/);
  assert.match(responsive, /@media \(max-width: 900px\)/);
  assert.match(responsive, /@media \(max-width: 680px\)/);
  assert.match(responsive, /@media \(max-width: 480px\)/);
  assert.match(responsive, /\.carousel__arrow[^}]*display: grid/s);
  assert.match(responsive, /\.movie-crud__workspace/);
});

test("aset visual utama Chill tersedia", async () => {
  const assets = [
    "public/assets/img/Logo.png",
    "public/assets/img/avatar.png",
    "public/assets/img/bgmasuk.jpg",
    "public/assets/img/bgdaftar.jpg",
    "public/assets/img/bgberanda.png",
    "public/assets/img/eyeopen.png",
    "public/assets/img/eyeclose.png",
    "public/assets/img/google.webp",
    "public/assets/img/arrow-left.png",
    "public/assets/img/arrow-right.png",
  ];

  await Promise.all(assets.map((asset) => access(projectFile(asset))));
});

test("Daftar Saya tersimpan lokal tanpa bergantung pada API Cloudflare", async () => {
  const myListHook = await source("app/hooks/useMyList.ts");

  assert.match(myListHook, /const STORAGE_KEY = "chill-my-list-v1"/);
  assert.match(myListHook, /window\.localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(myListHook, /window\.localStorage\.setItem\(STORAGE_KEY/);
  assert.match(myListHook, /window\.addEventListener\("storage"/);
  assert.doesNotMatch(myListHook, /fetch\(["'`]\/api\/my-list/);
});

test("popup poster portrait selalu memakai gambar dari kartu yang sama", async () => {
  const [catalog, seriesPage] = await Promise.all([
    source("app/components/MediaCatalog.tsx"),
    source("app/components/SeriesPage.tsx"),
  ]);

  assert.match(
    catalog,
    /variant === "portrait"[\s\S]*?<Image src=\{item\.image\} alt=\{`Cuplikan \$\{item\.title\}`\}/,
  );
  assert.doesNotMatch(
    catalog,
    /variant === "portrait"[\s\S]*?<Image src=\{item\.previewImage \?\? item\.image\}/,
  );

  const portraitRows = seriesPage.slice(seriesPage.indexOf("const chillPremium"));
  const mappings = [...portraitRows.matchAll(/image: "([^"]+)", previewImage: "([^"]+)"/g)];
  assert.ok(mappings.length > 0);
  for (const [, image, previewImage] of mappings) {
    assert.equal(previewImage, image);
  }
});

test("build produksi Next.js menghasilkan aplikasi dan aset client", async () => {
  await Promise.all([
    access(projectFile(".next/BUILD_ID")),
    access(projectFile(".next/server")),
    access(projectFile(".next/static")),
    access(projectFile("public/assets/img/Logo.png")),
  ]);
});
