# Dockerhub üzerinden resmi Node image'ını temel alarak bir image oluştur
FROM node

# Uygulamamızın bulunacağı klasörü oluştur
RUN mkdir -p /var/www/app

# Komutlarımızın çalıştırılacağı dizini seç
WORKDIR /var/www/app

# Tüm proje dosyalarını docker image'ına kopyala
COPY . /var/www/app

# Bağımlılıkları kur
RUN npm install

# Uygulamanın çalışacağı port
EXPOSE 3000

# Projeyi ayağa kaldıracak komutu çalıştır
CMD ["npm", "start"] 