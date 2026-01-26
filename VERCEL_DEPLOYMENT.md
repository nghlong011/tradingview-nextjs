# Hướng dẫn triển khai lên Vercel

## Vấn đề với SQLite trên Vercel

SQLite không hoạt động trên Vercel vì:
- Vercel sử dụng serverless functions (mỗi request có thể chạy trên instance khác nhau)
- File system trên Vercel là read-only (trừ `/tmp`)
- Database file không thể persist giữa các requests

## Giải pháp: Sử dụng PostgreSQL

Project này đã được cấu hình để tự động chuyển đổi giữa:
- **SQLite** (local development) - khi không có `POSTGRES_URL` hoặc `DATABASE_URL`
- **PostgreSQL** (production/Vercel) - khi có `POSTGRES_URL` hoặc `DATABASE_URL`

## Các bước triển khai

### 1. Tạo PostgreSQL Database

Bạn có thể sử dụng một trong các provider sau:

#### Option 1: Neon (Khuyến nghị - Free tier tốt)
1. Truy cập https://neon.tech
2. Đăng ký/Đăng nhập
3. Tạo project mới
4. Copy connection string (có dạng: `postgresql://user:password@host/database`)

#### Option 2: Supabase
1. Truy cập https://supabase.com
2. Tạo project mới
3. Vào Settings > Database
4. Copy connection string

#### Option 3: Railway
1. Truy cập https://railway.app
2. Tạo project mới
3. Add PostgreSQL service
4. Copy connection string

#### Option 4: Vercel Postgres (Deprecated nhưng vẫn dùng được)
1. Vào Vercel Dashboard > Project > Storage
2. Tạo Postgres database
3. Copy connection string

### 2. Cấu hình Environment Variables trên Vercel

1. Vào Vercel Dashboard > Project > Settings > Environment Variables
2. Thêm biến môi trường:
   - **Name**: `POSTGRES_URL` hoặc `DATABASE_URL`
   - **Value**: Connection string từ database provider (ví dụ: `postgresql://user:password@host/database`)
   - **Environment**: Production, Preview, Development (nếu cần)

### 3. Deploy lên Vercel

#### Cách 1: Deploy qua Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Cách 2: Deploy qua GitHub
1. Push code lên GitHub
2. Vào Vercel Dashboard > Add New Project
3. Import repository từ GitHub
4. Vercel sẽ tự động detect Next.js và deploy

### 4. Kiểm tra Database Connection

Sau khi deploy, database sẽ tự động được khởi tạo (tạo bảng) khi có request đầu tiên.

Bạn có thể kiểm tra bằng cách:
1. Truy cập website
2. Vào `/admin` để xem logs
3. Nếu thấy dữ liệu, database đã hoạt động!

## Cấu trúc Database

Bảng `access_logs` sẽ tự động được tạo với cấu trúc:

```sql
CREATE TABLE access_logs (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  view TEXT NOT NULL,
  block_reason TEXT,
  organization TEXT,
  asn INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT
);
```

Các index cũng được tạo tự động:
- `idx_ip` trên cột `ip`
- `idx_view` trên cột `view`
- `idx_timestamp` trên cột `timestamp`
- `idx_block_reason` trên cột `block_reason`

## Troubleshooting

### Lỗi: "POSTGRES_URL or DATABASE_URL environment variable is required"
- Kiểm tra xem đã thêm environment variable trên Vercel chưa
- Đảm bảo variable name đúng: `POSTGRES_URL` hoặc `DATABASE_URL`
- Redeploy sau khi thêm environment variable

### Lỗi: Connection timeout
- Kiểm tra connection string có đúng không
- Kiểm tra database có cho phép connection từ Vercel IP không (thường các cloud provider cho phép)
- Kiểm tra firewall settings của database

### Database không tự động tạo bảng
- Bảng sẽ được tạo tự động khi có request đầu tiên
- Nếu không, có thể chạy migration thủ công (xem file `lib/db-postgres.ts`)

## Local Development

Khi chạy local (không có `POSTGRES_URL`), project sẽ tự động dùng SQLite:
- Database file: `db/access-logs.db`
- Không cần setup gì thêm
- Chạy `npm run dev` và database sẽ tự động được tạo

## Migration từ SQLite sang Postgres

Nếu bạn đã có dữ liệu trong SQLite và muốn migrate:

1. Export data từ SQLite:
```bash
sqlite3 db/access-logs.db .dump > backup.sql
```

2. Convert SQL syntax sang Postgres (thay `INTEGER PRIMARY KEY AUTOINCREMENT` thành `SERIAL PRIMARY KEY`, etc.)

3. Import vào Postgres database

Hoặc sử dụng tool như `pgloader` để migrate tự động.
