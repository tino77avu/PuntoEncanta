# PuntoEncanta - Polos Piqué Bordados

Aplicación web para cotización de polos piqué bordados personalizados.

## 🚀 Tecnologías

- **Spring Boot 4.0.1**
- **Java 17**
- **Maven**
- **Thymeleaf**
- **Docker**

## 📋 Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- Docker (opcional, para contenedores)

## 🏃 Ejecución Local

### Sin Docker

```bash
# Compilar y ejecutar
mvn clean package
java -jar target/PuntoEncanta-0.0.1-SNAPSHOT.jar
```

La aplicación estará disponible en: `http://localhost:8080`

### Con Docker

```bash
# Construir la imagen
docker build -t puntoencanta .

# Ejecutar el contenedor
docker run -p 8080:8080 \
  -e WHATSAPP_NUMBER=51999999999 \
  puntoencanta
```

### Con Docker Compose

```bash
docker-compose up -d
```

## 🐳 Dockerización

### Construir la imagen

```bash
docker build -t puntoencanta:latest .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name puntoencanta-app \
  -p 8080:8080 \
  -e PORT=8080 \
  -e WHATSAPP_NUMBER=51999999999 \
  puntoencanta:latest
```

## ☁️ Despliegue en Render

### Opción 1: Con Docker (Recomendado)

1. **Conectar repositorio de GitHub** a Render
2. **Crear nuevo Web Service**
3. **Configuración**:
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.` (raíz del proyecto)
4. **Variables de Entorno**:
   - `PORT`: Render lo asigna automáticamente (no necesitas configurarlo)
   - `WHATSAPP_NUMBER`: Tu número de WhatsApp (ej: `51999999999`)

### Opción 2: Sin Docker (Maven directo)

1. **Conectar repositorio de GitHub** a Render
2. **Crear nuevo Web Service**
3. **Configuración**:
   - **Environment**: `Maven`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/PuntoEncanta-0.0.1-SNAPSHOT.jar`
4. **Variables de Entorno**:
   - `PORT`: Render lo asigna automáticamente
   - `WHATSAPP_NUMBER`: Tu número de WhatsApp (ej: `51999999999`)

### Opción 3: Usando render.yaml (Despliegue automático)

Si tienes el archivo `render.yaml` en tu repositorio:

1. En Render, ve a **Dashboard** → **New** → **Blueprint**
2. Conecta tu repositorio de GitHub
3. Render detectará automáticamente el `render.yaml` y configurará el servicio

### Variables de Entorno en Render

- `PORT`: Puerto del servidor (Render lo asigna automáticamente, no necesitas configurarlo)
- `WHATSAPP_NUMBER`: Número de WhatsApp para contacto (formato: `51999999999`)

### Verificación del Despliegue

Una vez desplegado, Render te dará una URL como: `https://puntoencanta.onrender.com`

Verifica que la aplicación funcione correctamente visitando la URL.

## 📁 Estructura del Proyecto

```
PuntoEncanta/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/admin/puntoencanta/
│   │   │       ├── controller/
│   │   │       ├── model/
│   │   │       ├── service/
│   │   │       └── PuntoEncantaApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── images/
│   │       ├── templates/
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## 🔧 Configuración

### Puerto del Servidor

El puerto se configura automáticamente desde la variable de entorno `PORT`. Si no está definida, usa el puerto 8080 por defecto.

### WhatsApp

Configura el número de WhatsApp en la variable de entorno `WHATSAPP_NUMBER` o en `application.properties`.

## 📝 Notas

- La aplicación almacena las cotizaciones en memoria (se pierden al reiniciar)
- Para producción, considera agregar una base de datos
- Las imágenes deben estar en `src/main/resources/static/images/`

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Cambiar el puerto
export PORT=8081
java -jar target/PuntoEncanta-0.0.1-SNAPSHOT.jar
```

### Error de compilación

```bash
# Limpiar y recompilar
mvn clean install
```

## 📄 Licencia

Todos los derechos reservados - PuntoEncanta 2024
