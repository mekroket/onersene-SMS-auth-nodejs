const Sepet = require('../models/sepetModel');
const Hizmet = require('../models/hizmetModel');
const Siparis = require('../models/siparisModel');

const createSiparis = async (req, res, next) => {
  try {
    const userId = req.session.userId; // Giriş yapan kullanıcının kimliği

    // Kullanıcının sepetini alın
    const sepet = await Sepet.find({ userId });

    if (sepet.length === 0) {
      return res.status(400).json({ message: 'Sepet boş' });
    }

    // Sipariş bilgilerini toplamaya başlayın
    let genelToplam = 0;
    let kdvTutar = 0;
    let getirmesiTutar = 0;

    // Sepetin her bir öğesi için sipariş oluşturun
    const siparisler = await Promise.all(
      sepet.map(async (sepetItem) => {
        const hizmet = await Hizmet.findById(sepetItem.hizmetId);

        if (!hizmet) {
          throw new Error('Hizmet bulunamadı');
        }

        // Sipariş bilgilerini hesaplayın
        const tutar = hizmet.hizmetFiyat;
        const kdv = tutar * hizmet.hizmetKdvOran / 100;
        const toplam = tutar + kdv;

        // Genel toplamı ve diğer tutarları güncelleyin
        genelToplam += toplam;
        kdvTutar += kdv;
        getirmesiTutar += tutar;

        // Siparişi oluşturun
        const siparis = new Siparis({
          siparisNo: generateSiparisNo(), // Sipariş numarasını oluşturun veya bir fonksiyon kullanarak atayın
          tarih: new Date(),
          userId,
          esnafId: hizmet.esnafId,
          kupon: req.body.kupon,
          iskontoTutar: req.body.iskontoTutar,
          kdvTutar: kdv,
          genelToplam: toplam,
          getirmesiTutar: tutar,
          odenecekTutar: toplam,
          komisyonTutar: 0,
          siparisDurum: 'Beklemede', // Varsayılan sipariş durumu
          odemeTipi: req.body.odemeTipi
        });

        await siparis.save(); // Siparişi kaydet

        // Sepetten ilgili öğeyi kaldırın
        await Sepet.findByIdAndRemove(sepetItem._id);

        return siparis;
      })
    );

    res.status(200).json({
      message: 'Sipariş oluşturuldu',
      siparisler,
      genelToplam,
      kdvTutar,
      getirmesiTutar
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sipariş numarasını oluşturan bir yardımcı fonksiyon
const generateSiparisNo = () => {
  // Sipariş numarasını oluşturmak için istediğiniz bir yöntemi kullanabilirsiniz
  // Örneğin, rastgele bir dizeden veya bir sayıdan oluşan bir numara oluşturabilirsiniz
  // Burada örnek olarak bir rastgele sayı kullanıyoruz:
  const randomNo = Math.floor(100000 + Math.random() * 900000);
  return `SP${randomNo}`;
};

module.exports = {
  createSiparis
};
