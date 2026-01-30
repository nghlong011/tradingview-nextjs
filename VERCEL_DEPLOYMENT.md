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
2. Thêm **đủ** các biến sau (thiếu sẽ dẫn đến **401 Unauthorized**):

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `POSTGRES_URL` hoặc `DATABASE_URL` | Có (production) | Connection string PostgreSQL |
| **`API_SECRET`** | **Có** | Bí mật JWT cho API (unlock-view, log-access). **Tối thiểu 16 ký tự**, dùng chuỗi random (vd: `openssl rand -base64 24`). |
| `ADMIN_SESSION_SECRET` | Khuyến nghị | Bí mật JWT cho cookie đăng nhập admin. Nếu không set, code sẽ dùng `API_SECRET`. Nên set riêng (≥ 16 ký tự). |
| `ADMIN_API_KEY` | Tùy chọn | Key cho header `x-admin-key` / Bearer (backdoor cho tool nội bộ). Có thể bỏ trống. |

**Lưu ý quan trọng:** Nếu không set `API_SECRET` trên Vercel:
- Trang chủ không tạo được token → gọi `/api/unlock-view` và `/api/log-access` sẽ trả **401 Unauthorized**.
- Admin dùng `ADMIN_SESSION_SECRET` hoặc `API_SECRET` để verify cookie; thiếu cả hai sẽ **401** khi vào `/admin` hoặc gọi `/api/admin/*`.

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

### Warning về SSL mode
Nếu bạn thấy warning về SSL modes ('prefer', 'require', 'verify-ca'), đây là warning từ thư viện `pg`. 

Code đã được cấu hình để:
- Tự động loại bỏ `sslmode` parameter từ connection string
- Set SSL config một cách rõ ràng với `rejectUnauthorized: false` (phù hợp với Neon, Supabase, Railway)
- Warning này sẽ không ảnh hưởng đến functionality, nhưng đã được fix để tránh warning trong tương lai

### Lỗi: Connection timeout
Nếu bạn gặp lỗi "Connection terminated due to connection timeout":

**Đã được fix với:**
1. **Tăng connection timeout**: Từ 2s lên 10s
2. **Retry logic**: Tự động retry với exponential backoff khi gặp timeout
3. **Tối ưu connection pool cho serverless**:
   - `max: 1` connection trên serverless (Vercel)
   - `min: 0` - không giữ connection khi idle
   - `idleTimeoutMillis: 10000` - giảm idle timeout
   - `statement_timeout: 5000` - timeout cho queries

**Nếu vẫn gặp lỗi:**
- Kiểm tra database có cho phép connection từ Vercel IP không
- Kiểm tra firewall settings của database provider
- Thử tăng `connectionTimeoutMillis` trong `lib/db-postgres.ts` nếu cần
- Xem logs trên Vercel để biết thêm chi tiết

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
