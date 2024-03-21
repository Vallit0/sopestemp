#To do list for the project 
- [X] modulo de kernel RAM 
- [X] modulo de kernal CPU 
- [X] modulo de kernel procesos

- [X] manejo modulo de RAM GO 
- [X] manejo modulo de CPU GO 

# Integrar en la DB los datos 
- [X] integracion en DB  RAM 
- [X] integracion en DB CPU 

# Ver procesos generales
- [ ] manejo modulo de proc GO

# Consumo General RAM 
- [ ] consumo front RAM 
- [ ] consumo front CPU 

# Consumo General de Arbol de Procesos
- [ ] consumo front arbol de procesos 
- [ ] emulador de procesos (full front?)

- [ ] Deploy en Docker 
- [ ] Deploy Docker Compose 
- [ ] Deploy DockerHub

# Levantar proceso
make 
sudo insmod file.ko
sudo rmmod file.ko


version: '3.8'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: 12345
      MYSQL_DATABASE: monitor
    volumes:
      - db-data:/var/lib/mysql
      - ./mysql-init:/docker-entrypoint-initdb.d 
    ports:
      - "3306:3306"

  frontend:
    build:
      context: ./frontend/so1_202001954/
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./app/
      dockerfile: Dockerfile
    ports:
      - "8080:8080"

volumes:
  db-data: {}

