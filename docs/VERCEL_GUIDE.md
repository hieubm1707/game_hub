# Hướng dẫn Deploy Game lên Vercel sau khi chạy `/init-game`

Tài liệu này hướng dẫn quy trình đưa bản build Flutter Web của một game lên **Vercel** (Static Hosting miễn phí, mỗi game một project độc lập) với đường dẫn chính thức tại root:

```text
https://<game-project>.vercel.app/index.html
```

*(Tương tự cách `blindspot` đang chạy tại `https://blindspot-roan.vercel.app/index.html`.)*

---

## 1. Đầu ra sau khi chạy `/init-game`

Sau khi hoàn tất `/init-game --repo <path-to-game>`, trong workspace `game_hub` sẽ có sẵn:

- **Thư mục build Flutter Web sẵn sàng deploy**:
  `dist-releases/<game-id>/releases/<version>/` (chứa `index.html`, `main.dart.js`, `assets/`, `icons/`...)
- **Manifest v2.0.0 đã validate** (đã có sẵn metadata và `web.backgroundColor`):
  `registry/manifests/<game-id>.manifest.json`
- **Metadata bản release**:
  `registry/exports/<game-id>-<version>.release.json`

---

## 2. Điều kiện tiên quyết

Cài đặt Vercel CLI (nếu chưa có) và đăng nhập:

```bash
npm i -g vercel
vercel login
```

---

## 3. Deploy game lên Vercel (chạy trực tiếp tại `/index.html`)

Để đường dẫn game chính thức là `https://<game-project>.vercel.app/index.html` (không kèm `/releases/<version>/`), bạn deploy trực tiếp thư mục chứa `index.html`:

```bash
cd dist-releases/<game-id>/releases/<version>
vercel --prod
```

*(Hoặc deploy trực tiếp từ thư mục `<game-repo>/build/web` sau khi chạy `pnpm game build --id <game-id>`.)*

### Lần đầu tạo project trên Vercel

Vercel CLI sẽ hỏi một vài thông tin:
- **Set up and deploy?** -> `Y`
- **Which scope?** -> Chọn account/team của bạn
- **Link to existing project?** -> `N` (tạo project mới, ví dụ `alibi-game` hoặc `<game-id>`)
- **In which directory is your code located?** -> `./`
- **Want to modify these settings?** -> `N` (vì đây là static output đã build sẵn, không cần build command trên Vercel)

### (Khuyến nghị) Thêm `vercel.json` vào thư mục deploy nếu cần chỉnh header

Mặc định Vercel không đặt `X-Frame-Options: DENY`, nên Game Hub có thể nhúng `<iframe>` ngay lập tức. Nếu muốn cấu hình thêm header cache/bảo mật, đặt file `vercel.json` ngay cạnh `index.html`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

> [!NOTE]
> Không đặt `X-Frame-Options: DENY` hoặc `SAMEORIGIN` cho project game trên Vercel vì Game Hub sẽ nhúng game qua `<iframe>` từ domain khác.

### Kiểm tra sau khi deploy

Sau khi hoàn tất, Vercel trả về domain production, ví dụ:

```text
https://alibi-game.vercel.app
```

Đường dẫn chính thức của game (`artifactUrl`) sẽ là:

```text
https://alibi-game.vercel.app/index.html
```

Và đường dẫn asset (icon/thumbnail) nằm ngay dưới domain đó, ví dụ:
- `https://alibi-game.vercel.app/icons/Icon-512.png`
- `https://alibi-game.vercel.app/assets/assets/...` *(tương tự `https://blindspot-roan.vercel.app/assets/assets/store/icon-1024.png`)*

Hãy mở thử `https://<game-project>.vercel.app/index.html` trực tiếp trên trình duyệt để chắc chắn game tải và chạy bình thường trước khi nhập vào Hub.

---

## 4. Đăng ký & Publish game trên Game Hub

1. Mở trực tiếp đường dẫn Admin của Game Hub (đã ẩn khỏi giao diện công khai):
   `https://<your-hub-domain>/admin`
2. Đăng nhập bằng tài khoản Admin đã được cấp quyền trong Firestore (`admins/{uid}`).
3. Vào **Add / Import Game** (`/admin/games/new`):
   - Chọn **Import `manifest.json`** và tải lên file `registry/manifests/<game-id>.manifest.json`.
   - Kiểm tra các thông tin đã được điền tự động (`Title`, `Description`, `Categories`, `Orientation`, `Player Background Color`...).
   - Điền **Web Artifact URL**:
     ```text
     https://<game-project>.vercel.app/index.html
     ```
   - Điền **Icon URL** và **Thumbnail URL** bằng URL HTTPS đầy đủ từ project Vercel của game.
   - (Tuỳ chọn) Điền **Google Play Store URL** và **App Store URL** nếu game đã có trên store — nút tải sẽ tự động hiển thị khi có URL và tự ẩn khi để trống.
4. Bấm **Save**, sau đó tại danh sách **Games** (`/admin/games`) bấm **Publish**.

---

## 5. Cập nhật bản mới cho game đã deploy

Khi sửa code game và muốn cập nhật lên production:

1. Build lại từ root `game_hub`:
   ```bash
   pnpm game validate --id <game-id>
   pnpm game build --id <game-id>
   pnpm game prepare-release --id <game-id>
   ```
2. Deploy đè lên đúng Vercel project cũ:
   ```bash
   cd dist-releases/<game-id>/releases/<version>
   vercel --prod
   ```
   *(Nếu đổi sang thư mục `<version>` mới chưa có `.vercel`, chọn **Link to existing project? -> Y** và chọn lại tên project cũ trên Vercel.)*
3. Đường dẫn `https://<game-project>.vercel.app/index.html` giữ nguyên — không cần sửa lại `artifactUrl` trên Game Hub. Khi cần rollback bản cũ, bạn có thể bấm **Instant Rollback** trực tiếp trong Vercel Dashboard của project game.

---

## 6. Cấu hình Origin & CSP (khi dùng Custom Domain)

Mặc định Game Hub đã cho phép nhúng mọi game từ `https://*.vercel.app` và `https://*.pages.dev`:
- Trong `apps/hub/vercel.json`: `frame-src 'self' https://*.pages.dev https://*.vercel.app;`
- Trong `apps/hub/src/firebase/client.ts`: `VITE_ALLOWED_GAME_ORIGINS` mặc định bao gồm `https://*.vercel.app`.

Nếu bạn gắn **Custom Domain** riêng cho game (ví dụ `https://play.mygame.com`), cần cập nhật 2 chỗ rồi deploy lại `apps/hub`:
1. Thêm `https://play.mygame.com` vào biến môi trường `VITE_ALLOWED_GAME_ORIGINS` của project Game Hub trên Vercel (phân tách bằng dấu phẩy).
2. Thêm `https://play.mygame.com` vào directive `frame-src` trong `apps/hub/vercel.json`.

---

## 7. Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách khắc phục |
| --- | --- | --- |
| Hub báo `artifact URL is missing or not from a trusted origin` | URL không dùng `https://` hoặc domain chưa nằm trong `VITE_ALLOWED_GAME_ORIGINS` | Dùng URL `https://*.vercel.app/index.html` hoặc bổ sung domain vào `VITE_ALLOWED_GAME_ORIGINS` |
| Khung chơi game bị trắng / lỗi CSP trên console | `frame-src` trên Hub chưa cho phép domain game, hoặc game trả về header `X-Frame-Options: DENY` | Kiểm tra `apps/hub/vercel.json` (`frame-src`) và không đặt `X-Frame-Options` ở project game |
| Icon / Thumbnail không hiển thị trên Hub | Đang để đường dẫn cục bộ (`assets/...`) thay vì URL công khai | Đổi sang URL `https://<game-project>.vercel.app/assets/assets/...` hoặc `/icons/...` |
