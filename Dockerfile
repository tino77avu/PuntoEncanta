# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias (se cachea si no cambia pom.xml)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Instalar wget para healthcheck y crear usuario no-root
RUN apk add --no-cache wget && \
    addgroup -S spring && \
    adduser -S spring -G spring

# Cambiar a usuario no-root para seguridad
USER spring:spring

# Copiar el JAR desde el stage de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto (Render usa PORT variable de entorno)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Ejecutar la aplicación
# Render usa la variable PORT automáticamente, Spring Boot la detecta
ENTRYPOINT ["java", "-jar", "app.jar"]
