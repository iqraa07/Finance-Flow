# FinanceFlow

Dashboard manajemen keuangan pribadi yang modern dan lengkap. Aplikasi web untuk tracking pengeluaran, income, dan membuat laporan keuangan dengan visualisasi yang menarik.

## Tentang Aplikasi

FinanceFlow adalah solusi all-in-one untuk mengelola keuangan pribadi. Dibuat dengan teknologi terkini, aplikasi ini memudahkan kamu untuk:
- Mencatat setiap transaksi keuangan (income dan expense)
- Menganalisis pola pengeluaran dengan grafik interaktif
- Membuat laporan keuangan terperinci
- Monitor kesehatan finansial secara real-time
- Mengatur kategori dan budget dengan fleksibel

## Fitur Lengkap

### 1. Dashboard - Ringkasan Keuangan
Landing page utama yang menampilkan overview finansial kamu. Di sini kamu bisa melihat:
- **Total Balance** - Saldo total saat ini (income total - expense total)
- **Total Income** - Jumlah uang masuk bulan ini
- **Total Expense** - Jumlah pengeluaran bulan ini
- **Grafik Cash Flow** - Visualisasi aliran kas dengan line chart untuk 30 hari terakhir
- **Expense by Category** - Pie chart menunjukkan persentase pengeluaran per kategori
- **Recent Transactions** - Daftar 5 transaksi terbaru dengan detail (tanggal, kategori, jumlah, tipe)
- **Financial Goals** - Tracker untuk target keuangan dengan progress bar

### 2. Transactions - Kelola Semua Transaksi
Halaman lengkap untuk mengelola transaksi keuangan:

**Fitur Input:**
- Form untuk tambah transaksi baru (income atau expense)
- Pilih kategori dari dropdown (Salary, Freelance, Food, Transport, Entertainment, etc)
- Input nominal uang (format rupiah)
- Deskripsi transaksi (optional tapi disarankan)
- Pilih tanggal transaksi
- Modal pop-up untuk kemudahan input tanpa meninggalkan halaman

**Fitur Viewing & Filtering:**
- Tabel atau list view semua transaksi
- Filter berdasarkan:
  - **Tipe** - Income atau Expense
  - **Kategori** - Pilih satu atau lebih kategori
  - **Date Range** - Tanggal mulai sampai selesai
  - **Amount Range** - Filter berdasarkan nominal (min-max)
- Sorting:
  - Sortir by Tanggal (terbaru/terlama)
  - Sortir by Jumlah (terbesar/terkecil)
  - Sortir by Kategori (A-Z)
- Search box untuk cari berdasarkan deskripsi

**Fitur Lainnya:**
- Delete transaksi dengan konfirmasi
- Edit transaksi yang sudah tercatat
- Bulk action untuk delete multiple items
- Export ke CSV untuk backup dan analisis di Excel
- Show total income, expense, dan net dari hasil filter

### 3. Analytics - Analisis Mendalam
Dashboard analitik lengkap dengan berbagai visualisasi data:

**Tipe Grafik:**
- **Line Chart** - Trend income vs expense selama periode
- **Bar Chart** - Perbandingan income dan expense per bulan
- **Pie Chart** - Proporsi expense per kategori
- **Doughnut Chart** - Breakdown spending dengan lebih detail

**Filter & Timeframe:**
- Pilih periode: 7 hari, 30 hari, 90 hari, atau custom date range
- Toggle antara berbagai jenis chart
- Hover di grafik untuk lihat nilai detail (tooltip)

**Insight yang Ditampilkan:**
- Total income periode dipilih
- Total expense periode dipilih
- Rata-rata pengeluaran per hari
- Kategori dengan pengeluaran terbesar
- Trend naik/turun dibanding periode sebelumnya
- Top 5 expense categories dengan value dan percentage

### 4. Reports - Generate Laporan
Halaman untuk membuat dan export laporan keuangan formal:

**Opsi Filter:**
- Rentang tanggal (from/to)
- Tipe transaksi (Income/Expense/All)
- Kategori tertentu
- Status: Draft, Published, atau Archived

**Isi Laporan:**
- Header: Periode laporan, nama user, tanggal generate
- Summary section:
  - Total income
  - Total expense
  - Net income (profit/loss)
  - Persentase perubahan vs periode sebelumnya
- Detailed transaction list dengan tabel lengkap
- Summary per kategori dengan breakdown
- Grafik visual untuk visualisasi laporan
- Footer: Notes dan signature

**Export Options:**
- Download PDF dengan formatting rapi
- Export CSV untuk kompatibilitas Excel
- Send via Email ke akun yang didaftar
- Print friendly view

### 5. Settings - Pengaturan Akun
Halaman pengaturan lengkap untuk customize pengalaman pengguna:

**Profile Settings:**
- Edit nama lengkap
- Edit email
- Upload foto profil
- Edit bio atau deskripsi singkat

**Keamanan:**
- Ganti password dengan validasi password lama
- Aktifkan/nonaktifkan 2FA (Two-Factor Authentication)
- Lihat history login terakhir
- Logout dari perangkat lain
- Manage API keys (jika ada integrasi)

**Notifikasi:**
- Email notification on new transaction
- Email notification untuk laporan bulanan
- Push notification untuk activity alerts
- Weekly digest summary

**Preferensi:**
- Pilih tema (Light/Dark mode)
- Pilih bahasa (Indonesia/English)
- Timezone setting
- Format tanggal (DD/MM/YYYY, MM/DD/YYYY, dll)
- Format currency (Rp, $, €, dll)

**Data Management:**
- Download semua data dalam ZIP
- Import data dari backup
- Delete account dengan konfirmasi (irreversible)

### 6. Authentication - Login & Register
Sistem autentikasi aman dengan fitur:

**Register:**
- Email validation
- Password strength checker (min 6 karakter, mix uppercase/lowercase/number)
- Confirm password
- Accept terms & conditions
- Redirect ke login setelah sukses

**Login:**
- Email dan password
- "Remember me" checkbox untuk auto-login
- Forgot password link
- Sign up link

**Forgot Password:**
- Input email yang terdaftar
- Reset link akan dikirim ke email
- Set password baru dengan validasi

### 7. Sidebar Navigation
Menu navigasi yang selalu tersedia:
- Dashboard
- Transactions
- Analytics
- Reports
- Settings
- Logout button

### 8. Real-time Features
Fitur yang update otomatis tanpa refresh:
- Balance update instantly saat transaksi baru ditambah
- Chart update real-time saat data berubah
- Notifikasi alert untuk activity tertentu
- Sync data across tabs/devices

## Stack Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom theme dengan color system)
- **Grafik**: Chart.js, React-Chartjs-2
- **Icons**: Lucide React
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Routing**: React Router v6
- **State Management**: React Context API

## Tech Stack Detail

```
React 18          → UI library modern dengan hooks
TypeScript        → Type safety dan better developer experience
Vite              → Build tool super cepat
Tailwind CSS      → Utility-first CSS framework
Chart.js          → Library grafik powerful
Supabase          → Backend as a service (DB + Auth)
React Router v6   → Client-side routing
Lucide React      → Icon library clean & modern
```

## Quick Start

### Requirements

- Node.js 18+ dan npm
- Account Supabase (gratis)

### Setup Langkah-Langkah

1. **Clone repo:**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup Supabase:**
   - Buat account di https://supabase.com
   - Buat project baru
   - Copy Supabase URL dan Anon Key dari settings

4. **Setup environment variables di file `.env`:**
```
VITE_SUPABASE_URL=your_supabase_url_disini
VITE_SUPABASE_ANON_KEY=your_anon_key_disini
```

5. **Run database migrations:**
   - Login ke Supabase dashboard
   - Buka SQL editor
   - Copy-paste isi dari `supabase/migrations/` files dan execute
   - Atau gunakan Supabase CLI: `supabase db push`

6. **Jalankan dev server:**
```bash
npm run dev
```

7. **Buka di browser:**
```
http://localhost:5173
```

### Akun Demo (untuk testing)

```
Email: demo@example.com
Password: demo123456
```

## Folder Structure

```
project/
├── src/
│   ├── components/
│   │   ├── DashboardCard.tsx      # Card components untuk dashboard
│   │   ├── Header.tsx             # Header dengan user menu
│   │   ├── Sidebar.tsx            # Sidebar navigation
│   │   ├── NewTransactionModal.tsx # Modal input transaksi baru
│   │   └── PrivateRoute.tsx        # Route protection untuk auth
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx         # Context untuk auth state
│   │
│   ├── hooks/
│   │   └── useTransactions.ts      # Custom hook untuk transaction logic
│   │
│   ├── lib/
│   │   └── supabase.ts             # Supabase client configuration
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx           # Halaman login
│   │   │   └── Register.tsx        # Halaman registrasi
│   │   ├── Dashboard.tsx           # Dashboard utama
│   │   ├── Transactions.tsx        # Halaman transaksi
│   │   ├── Analytics.tsx           # Halaman analitik
│   │   ├── Reports.tsx             # Halaman laporan
│   │   └── Settings.tsx            # Halaman settings
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles
│   └── vite-env.d.ts               # Vite environment types
│
├── supabase/
│   └── migrations/                 # Database migration files
│
├── public/                         # Static assets
├── .env                            # Environment variables
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── tsconfig.json                   # TypeScript config
└── package.json
```

## Database Schema

### Tabel: users
Menyimpan data user yang terdaftar

```sql
- id (UUID)              → Primary key, auto-generated
- email (TEXT)           → Email unik user
- full_name (TEXT)       → Nama lengkap
- avatar_url (TEXT)      → URL foto profil
- role (TEXT)            → user role (admin/user)
- created_at (TIMESTAMP) → Tanggal daftar
- updated_at (TIMESTAMP) → Update terakhir
```

### Tabel: transactions
Menyimpan semua transaksi keuangan

```sql
- id (UUID)              → Primary key
- user_id (UUID)         → Foreign key ke users table
- type (TEXT)            → 'income' atau 'expense'
- amount (NUMERIC)       → Jumlah nominal
- category (TEXT)        → Kategori transaksi
- description (TEXT)     → Deskripsi (optional)
- date (DATE)            → Tanggal transaksi
- created_at (TIMESTAMP) → Waktu dibuat
- updated_at (TIMESTAMP) → Waktu update terakhir
```

### Tabel: categories
Daftar kategori yang bisa digunakan

```sql
- id (UUID)              → Primary key
- name (TEXT)            → Nama kategori
- type (TEXT)            → income atau expense
- color (TEXT)           → Warna untuk visualization
- user_id (UUID)         → Foreign key (default atau custom per user)
```

### Tabel: reports
Menyimpan history laporan yang dibuat

```sql
- id (UUID)              → Primary key
- user_id (UUID)         → Foreign key ke users
- title (TEXT)           → Judul laporan
- start_date (DATE)      → Periode awal
- end_date (DATE)        → Periode akhir
- status (TEXT)          → draft/published/archived
- created_at (TIMESTAMP) → Waktu dibuat
```

## Keamanan & Privacy

- **Row Level Security (RLS)** aktif di semua tabel → User hanya bisa akses data sendiri
- **Authentication** menggunakan Supabase Auth dengan email/password
- **Password** minimal 6 karakter, disarankan lebih kompleks
- **2FA** (Two-Factor Authentication) tersedia untuk extra security
- **SSL/HTTPS** enforced untuk semua koneksi
- **Data Encryption** untuk data sensitif di database
- **No public access** ke data transaksi, semua terlindungi dengan RLS policy

## Environment Variables

File `.env` harus berisi:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
VITE_APP_NAME=FinanceFlow
VITE_APP_URL=http://localhost:5173
```

## Available Scripts

```bash
# Development
npm run dev              # Jalankan dev server dengan hot reload

# Production
npm run build            # Build optimized production bundle
npm run preview          # Preview production build secara lokal

# Code Quality
npm run lint             # Check code dengan ESLint
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers modern

## Performance

- Optimized bundle size (~160KB gzipped)
- Lazy loading untuk pages yang tidak langsung diperlukan
- Image optimization dan caching
- Database query optimization dengan indexing

## License

Open source, gratis untuk personal maupun komersial. Lihat LICENSE file untuk detail.

## Roadmap

Fitur yang akan datang:
- Multi-currency support
- Budget planning & alerts
- Recurring transactions
- Investment tracking
- Mobile app (React Native)
- Data import dari bank
- AI-powered insights
- Collaborative budgeting

## Support & Kontribusi

Ada bug atau saran? Silakan buat issue di repository. Pull requests juga sangat welcome!

## Author

Dibuat dengan ❤️ untuk personal finance management yang lebih baik.

---

**Ready to take control of your finances? Start using FinanceFlow today!**
