function post(data, id) {
    this.id = id;
    this.baslik = String(data.baslik) || "Başlık Tanımlanmadı";
    this.icerik = String(data.icerik) || "İçerik Tanımlanmadı";
    this.created_at = new Date();
}
module.exports = post;