# OpenPose Analyzer Demo

Panduan ini akan membantu Anda menjalankan OpenPose Analyzer secara lokal untuk demo.

## Langkah 1: Clone Repository

```bash
git clone https://github.com/rahmivinnn/ai-kinetic.git
cd ai-kinetic
```

## Langkah 2: Install Dependencies Frontend

```bash
npm install
```

## Langkah 3: Jalankan Frontend

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`.

## Langkah 4: Setup Backend Python

Buka terminal baru dan jalankan:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend akan berjalan di `http://localhost:5000`.

## Langkah 5: Akses OpenPose Analyzer

Buka browser dan kunjungi:

```
http://localhost:3000/openpose-analyzer
```

## Troubleshooting

### Jika Halaman 404 di Netlify

1. Pastikan build terbaru sudah selesai di Netlify
2. Coba akses URL dengan format:
   ```
   https://fluffy-wisp-6ddaf8.netlify.app/openpose-analyzer
   ```
3. Jika masih 404, coba trigger build manual di dashboard Netlify

### Jika Backend Error

1. Pastikan semua dependencies terinstall:
   ```bash
   pip install opencv-python mediapipe numpy flask flask-cors pandas
   ```
2. Pastikan port 5000 tidak digunakan oleh aplikasi lain
3. Periksa error di terminal backend

## Fitur Demo

1. **Analisis Pose Real-time**:
   - Pilih tab "Live Camera"
   - Klik "Start Camera"
   - Klik "Start Analysis"
   - Lihat feedback postur dan skor kepercayaan

2. **Analisis Video**:
   - Pilih tab "Upload Video"
   - Pilih file video
   - Klik "Upload & Analyze"
   - Lihat hasil analisis

## Catatan

- Backend Python diperlukan untuk analisis pose
- Pastikan kamera web tersedia dan berfungsi
- Untuk demo tanpa backend, gunakan mode "mock" dengan menambahkan `?mock=true` ke URL
