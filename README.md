# Playable E-commerce — Pijama Takımı Mağazası

Playable, modern bir e-ticaret platformudur. Next.js + TypeScript + Tailwind CSS frontend ve Express + MongoDB backend ile geliştirilmiştir. Pijama takımları ve uyku ürünleri satışı için özelleştirilmiş, Casper.com tarzı minimal ve modern bir tasarıma sahiptir.

## 📋 İçindekiler

- [Proje Özeti](#proje-özeti)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Seed Verileri ve Demo Hesaplar](#seed-verileri-ve-demo-hesaplar)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [API Endpoints](#api-endpoints)
- [Özellikler](#özellikler)
- [Geliştirme Notları](#geliştirme-notları)
- [Docker Kullanımı](#docker-kullanımı)

## 🎯 Proje Özeti

Playable, pijama takımları ve uyku ürünleri satışı için tasarlanmış bir e-ticaret platformudur. Platform şu özellikleri içerir:

- **Müşteri Akışları**: Ürün arama, kategori filtreleme, ürün detayları, sepet yönetimi, ödeme ve sipariş geçmişi
- **Admin Akışları**: Ürün yönetimi (oluşturma, düzenleme, silme), sipariş yönetimi
- **Modern Tasarım**: Casper.com tarzı minimal, temiz ve modern kullanıcı arayüzü
- **Renk Paleti**: Rose/pink tonlarında soft ama belirgin renkler

## 🛠 Teknoloji Yığını

### Frontend
- **Next.js 13+** (TypeScript)
- **React 18+**
- **Tailwind CSS** (styling)
- **Axios** (HTTP client)

### Backend
- **Node.js 18+**
- **Express.js** (REST API)
- **TypeScript**
- **Mongoose** (MongoDB ODM)
- **JWT** (Authentication)

### Veritabanı
- **MongoDB** (NoSQL database)

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ (LTS önerilir)
- npm 9+ (veya yarn/pnpm)
- Çalışan bir MongoDB instance (local veya cloud)

## 📦 Kurulum ve Çalıştırma

### Backend Kurulumu

```powershell
cd backend
npm install
copy .env.example .env
# .env dosyasını düzenleyin: MONGO_URI ve JWT_SECRET ayarlayın
npm run seed    # Opsiyonel: örnek ürünler ve test kullanıcıları oluşturur
npm run dev
```

Backend varsayılan olarak `http://localhost:4000` portunda çalışır.

### Frontend Kurulumu

```powershell
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` portunda çalışır.

**Not**: Backend ve frontend'i ayrı terminal pencerelerinde çalıştırmanız gerekir.

## 👤 Seed Verileri ve Demo Hesaplar

Seed script'i örnek ürünler ve iki kullanıcı oluşturur:

- **Admin hesabı**: `admin@example.com` / `Password123`
- **Müşteri hesabı**: `user@example.com` / `Password123`

Seed script'ini çalıştırmak için:

```powershell
cd backend
npm run seed
```

## 🔐 Ortam Değişkenleri

`backend/.env` dosyasını `backend/.env.example` dosyasından oluşturun.

Örnek değerler (gizli bilgileri public repo'larda kullanmayın):

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/playable
JWT_SECRET=replace_this_with_a_strong_secret
```

Frontend için (opsiyonel):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📡 API Endpoints

Base URL: `http://localhost:4000/api`

### Authentication

- **POST** `/api/auth/register`
  - Body: `{ name, email, password }`
  - Yeni kullanıcı kaydı

- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token }`

### Products

- **GET** `/api/products`
  - Query params: `?page=1&limit=12&q=search&category=category&min=0&max=100&sort=-createdAt`
  - Ürün listesi (sayfalanmış, filtrelenebilir)

- **GET** `/api/products/:id`
  - Ürün detayı

### Orders (Protected)

- **POST** `/api/orders`
  - Body: `{ items, shippingAddress, total }`
  - Yeni sipariş oluşturma
  - Requires: `Authorization: Bearer <token>`

- **GET** `/api/orders/my`
  - Kullanıcının sipariş geçmişi
  - Requires: `Authorization: Bearer <token>`

### Admin Products (Protected, Admin Only)

- **POST** `/api/admin/products`
  - Body: `{ name, description, price, stock, category, images }`
  - Yeni ürün oluşturma

- **PUT** `/api/admin/products/:id`
  - Body: `{ name, description, price, stock, category, images }`
  - Ürün güncelleme

- **DELETE** `/api/admin/products/:id`
  - Ürün silme

### Örnek API Kullanımı

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'

# Get Products
curl http://localhost:4000/api/products?page=1&limit=12

# Get Products by Category
curl http://localhost:4000/api/products?category=pijama&page=1

# Create Order (with token)
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"productId":"...","name":"...","quantity":1,"price":99.99}],"total":99.99,"shippingAddress":"..."}'
```

## ✨ Özellikler

### Müşteri Özellikleri

- ✅ Kullanıcı kaydı ve girişi
- ✅ Ürün listeleme ve arama
- ✅ Kategori filtreleme
- ✅ Ürün detay sayfaları
- ✅ Sepet yönetimi (localStorage)
- ✅ Ödeme sayfası
- ✅ Sipariş geçmişi görüntüleme
- ✅ Profil sayfası

### Admin Özellikleri

- ✅ Ürün oluşturma
- ✅ Ürün düzenleme
- ✅ Ürün silme
- ✅ Ürün listeleme
- ✅ Admin yetkilendirmesi

### Tasarım Özellikleri

- ✅ Casper.com tarzı minimal tasarım
- ✅ Rose/pink renk paleti
- ✅ Responsive tasarım
- ✅ Modern UI/UX
- ✅ Smooth animasyonlar

## 📝 Geliştirme Notları

### Proje Yapısı

```
playable/
├── backend/
│   ├── src/
│   │   ├── config/        # Veritabanı konfigürasyonu
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose modelleri
│   │   ├── routes/        # API route'ları
│   │   ├── seed/          # Seed script
│   │   └── server.ts      # Express server
│   └── package.json
├── frontend/
│   ├── components/         # React bileşenleri
│   ├── lib/               # Utility fonksiyonları
│   ├── pages/             # Next.js sayfaları
│   ├── styles/            # Global stiller
│   └── package.json
└── docker-compose.yml
```

### Önemli Notlar

- JWT token'lar localStorage'da saklanıyor (production için httpOnly cookies önerilir)
- Görseller base64 olarak saklanıyor (production için S3/Cloudinary önerilir)
- Sepet state'i localStorage'da tutuluyor
- Admin yetkisi JWT token içindeki `role` field'ı ile kontrol ediliyor

### Gelecek Geliştirmeler

- [ ] Ürün yorumları ve puanlama
- [ ] Favoriler listesi
- [ ] Email bildirimleri
- [ ] Ödeme entegrasyonu (Stripe/PayPal)
- [ ] Admin dashboard (istatistikler)
- [ ] Çoklu dil desteği
- [ ] Gelişmiş filtreleme (fiyat aralığı, renk, beden)
- [ ] Ürün varyantları (beden, renk)

## 🐳 Docker Kullanımı

Proje Docker ve Docker Compose ile çalıştırılabilir.

### Tüm Servisleri Başlatma

```powershell
docker-compose up --build -d
```

### Logları Görüntüleme

```powershell
docker-compose logs -f
```

### Servisleri Durdurma

```powershell
docker-compose down
```

### Veritabanı ile Birlikte Durdurma (veri kaybı olur)

```powershell
docker-compose down -v
```

### Seed Script Çalıştırma (Docker ile)

```powershell
# Backend image'ını rebuild et (opsiyonel)
docker-compose build backend

# Seed script'ini çalıştır
docker-compose run --rm seed
```

**Not**: MongoDB bağlantı hataları görürseniz, birkaç saniye bekleyip seed komutunu tekrar çalıştırın. Docker Compose başlangıç sırasını garanti eder ama tam hazırlığı garanti etmez.

## 🔒 Güvenlik Notları

### Production İçin Öneriler

- **JWT Secret**: Güçlü, rastgele bir secret kullanın
- **MongoDB**: Managed MongoDB (Atlas) kullanın
- **HTTPS**: Tüm trafiği HTTPS ile koruyun
- **CORS**: Production domain'lerini whitelist'leyin
- **Rate Limiting**: API endpoint'lerine rate limiting ekleyin
- **Input Validation**: Tüm input'ları validate edin
- **Password Hashing**: bcrypt kullanılıyor (✓)
- **Image Storage**: Base64 yerine S3/Cloudinary kullanın

## 🐛 Sorun Giderme

### Backend Bağlantı Hataları

- MongoDB'nin çalıştığından emin olun
- `.env` dosyasındaki `MONGO_URI` değerini kontrol edin
- Port 4000'in kullanılabilir olduğundan emin olun

### Frontend API Hataları

- Backend'in çalıştığından emin olun
- `NEXT_PUBLIC_API_URL` environment variable'ını kontrol edin
- CORS ayarlarını kontrol edin

### Authentication Sorunları

- Token'ın geçerli olduğundan emin olun
- Token'ın süresi dolmuş olabilir, yeniden giriş yapın
- Admin işlemleri için admin hesabı ile giriş yapın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👥 Katkıda Bulunma

Bu proje 5 günlük bir proje olarak geliştirilmiştir. Geliştirmeye devam etmek için:

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

**Playable E-commerce** — Modern, minimal ve kullanıcı dostu pijama takımı mağazası.
