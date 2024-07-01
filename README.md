## Proje Hakkında

Bu proje, kullanıcıların telefon numaraları üzerinden üye olmalarını ve giriş yapmalarını sağlayan bir sistemdir. Kullanıcılar, telefonlarına gönderilen doğrulama kodu ile hesaplarını doğrulayabilir ve profillerini yönetebilirler. Proje aynı zamanda sepet ekleme, admin paneli yönetimi, grafik ekleme, profil düzenleme, yetki yönetimi, kategori yönetimi gibi sistemler içerir.

## Kullanılan Teknolojiler ve Bağımlılıklar

- **Node.js** ve **Express.js** ile backend geliştirilmiştir.
- **MongoDB** veritabanı kullanılmıştır.

### Bağımlılıklar

```bash
npm install @hapi/joi@^17.1.1
npm install bcrypt@^5.1.0
npm install bcryptjs@^2.4.3
npm install connect-flash@^0.1.1
npm install dotenv@^16.0.3
npm install ejs@^3.1.9
npm install express@^4.18.2
npm install express-ejs-layouts@^2.5.1
npm install express-flash@^0.0.2
npm install express-session@^1.17.3
npm install flash-express@^1.0.4
npm install intl-tel-input@^17.0.21
npm install mongoose@^7.1.0
npm install multer@^1.4.5-lts.1
npm install passport@^0.6.0
npm install passport-local@^1.0.0
npm install passport-phone@^1.2.3
npm install twilio@^3.84.1
```


## Kurulum Adımları

- **Projeyi Klonlayın ve Bağımlılıkları Yükleyin
git clone https://github.com/kullaniciadi/phoneverfy.git
cd phoneverfy
npm install

- **Çevre Değişkenlerini Ayarlayın
Projeyi çalıştırmak için gerekli çevre değişkenlerini ayarlayın. Örnek .env dosyasını projenizin kök dizinine ekleyin ve aşağıdaki değişkenleri tanımlayın:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/phoneverfy
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

TWILIO_ACCOUNT_SID ve TWILIO_AUTH_TOKEN değerlerini Twilio hesabınızdan alabilirsiniz.


- **Veritabanını Başlatın
MongoDB veritabanını başlatın:
mongod --dbpath /path/to/mongodb/data

- **Uygulamayı Başlatın**
Uygulamayı başlatmak için aşağıdaki komutu çalıştırın:
npm start
node app.js
Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.



