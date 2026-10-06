# CHILL — Mission Advanced Front End 2B

Aplikasi katalog film responsif berbasis React dan Next.js. Mission ini melanjutkan integrasi REST API dari Advanced FE 1B dengan state management global menggunakan **Redux Toolkit** dan **React Redux**.

## Link project

- Live demo: [chill-advanced-fe2b-rizki.vercel.app](https://chill-advanced-fe2b-rizki.vercel.app)
- Repository: [20094_RizkiFitraRamadhan_MissionAdvancedFE2B](https://github.com/Ramadhnfitra99/20094_RizkiFitraRamadhan_MissionAdvancedFE2B)

## Kesesuaian mission

### Step 3 — State Management

- Store global dibuat dengan `configureStore` dari Redux Toolkit.
- State awal koleksi film adalah array kosong pada `moviesSlice`.
- Data hasil GET API disimpan dalam Redux Store.
- `StoreProvider` memasang React Redux `Provider` pada root aplikasi.
- Komponen membaca state melalui typed selector dan mengirim aksi melalui typed dispatch.
- Loading, pending, error, dan waktu sinkronisasi juga tersimpan secara global.

### Step 4 — Integrasi API ke tampilan React

- `GET` mengambil koleksi film dan menampilkannya di homepage.
- `POST` menambahkan film baru beserta poster, genre, rating, dan tahun.
- `PUT` memperbarui film yang dipilih.
- `DELETE` menghapus film setelah konfirmasi.
- Seluruh operasi asynchronous dibuat sebagai `createAsyncThunk`.
- Service API dipisahkan dalam folder `app/services/api`.
- Base URL API dibaca dari environment variable, bukan di-hardcode di komponen.
- Custom hook `useMoviesApi` menjadi lapisan reusable antara komponen dan Redux.

## Fitur aplikasi

- CRUD API interaktif langsung pada homepage.
- Redux Toolkit untuk state global koleksi film.
- Status REST API dan waktu sinkronisasi terakhir.
- Validasi form lengkap dan pesan error yang mudah dipahami.
- Pemilihan poster menggunakan aset film lokal.
- Pencarian berdasarkan judul/genre dan filter genre.
- Statistik jumlah film dan rata-rata rating.
- Daftar Saya tersimpan lokal di browser.
- Halaman login, register, home, series, Daftar Saya, profil, langganan, dan pembayaran.
- Responsive untuk desktop, tablet, dan mobile.
- Font Lato dan aset lokal agar tampilan konsisten dengan desain Chill.

## REST API

Project menggunakan [RESTful API](https://restful-api.dev/) sebagai fake API publik untuk pembelajaran. Service tersebut mendukung CORS dan operasi `GET`, `POST`, `PUT`, serta `DELETE` melalui HTTP.

ID object yang dibuat oleh satu browser disimpan di `localStorage`. Data film tetap dibaca dan dimutasi melalui REST API; `localStorage` hanya menyimpan daftar ID agar koleksi browser yang sama dapat diambil kembali.

> API merupakan sandbox publik. Jangan mengirim data pribadi atau rahasia.

## Struktur state management

```text
app/
├── components/
│   ├── CustomMoviesCrud.tsx
│   └── HomePage.tsx
├── data/
│   └── managedMovies.ts
├── hooks/
│   └── useMoviesApi.ts
├── services/
│   └── api/
│       └── movieApi.ts
└── store/
    └── redux/
        ├── hooks.ts
        ├── moviesSlice.ts
        ├── StoreProvider.tsx
        └── store.ts
```

Alur data:

```text
CustomMoviesCrud
       ↓ aksi pengguna
useMoviesApi (typed dispatch dan selector)
       ↓
Redux async thunk → moviesSlice → Redux Store
       ↓
movieApi service
       ↓ HTTP GET, POST, PUT, DELETE
RESTful API
```

## Menjalankan project

Gunakan Node.js 24.

1. Buka folder project di Visual Studio Code.
2. Pasang dependency:

   ```bash
   npm install
   ```

3. Salin environment example:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000/home`.

## Pemeriksaan kualitas

```bash
npm run lint
npm test
npm run build
```

## Environment variable

```env
NEXT_PUBLIC_MOVIE_API_URL=https://api.restful-api.dev/objects
```

File `.env.local` tidak masuk Git. `.env.example` disertakan agar project dapat dipasang ulang dengan mudah.

## Deploy ke Vercel

1. Import repository GitHub ke Vercel.
2. Pilih framework preset **Next.js**.
3. Tambahkan environment variable:
   - Name: `NEXT_PUBLIC_MOVIE_API_URL`
   - Value: `https://api.restful-api.dev/objects`
4. Jalankan deployment.

Tidak diperlukan build command khusus; Vercel menjalankan `next build` secara otomatis.

## Referensi desain

- [Figma Chill 1.0](https://www.figma.com/design/G9OCq6LLzIyRD8v8swHXSb/Chill-1.0--Copy-?node-id=3-7&p=f&t=vA4uKEw57Zd7UHro-0)

## Catatan pengumpulan

- Kumpulkan link repository GitHub.
- Sertakan link deployment Vercel agar aplikasi mudah diperiksa.
- Isi formulir pengumpulan mission melalui Google Classroom.
- Simpan screenshot formulir sebagai bukti penyelesaian mission.
