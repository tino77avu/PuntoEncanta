# 🚀 Guía de Despliegue - PuntoEncanta

## Despliegue en Render.com

### Paso 1: Preparar el Repositorio en GitHub

1. Crea un repositorio en GitHub (si no lo tienes)
2. Sube tu código:

```bash
git init
git add .
git commit -m "Initial commit - PuntoEncanta app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/PuntoEncanta.git
git push -u origin main
```

### Paso 2: Configurar Render

#### Opción A: Con Docker (Recomendado)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New +** → **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `puntoencanta` (o el nombre que prefieras)
   - **Environment**: `Docker`
   - **Region**: Elige la más cercana a tus usuarios
   - **Branch**: `main` (o la rama que uses)
   - **Root Directory**: Dejar vacío (raíz del proyecto)
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.` (punto)
   - **Plan**: `Free` (o el plan que prefieras)

5. **Variables de Entorno**:
   - `WHATSAPP_NUMBER`: `51999999999` (tu número real de WhatsApp)
   - `PORT`: **NO LO CONFIGURES** - Render lo asigna automáticamente

6. Click en **Create Web Service**

#### Opción B: Sin Docker (Maven directo)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New +** → **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `puntoencanta`
   - **Environment**: `Maven`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/PuntoEncanta-0.0.1-SNAPSHOT.jar`
   - **Plan**: `Free`

5. **Variables de Entorno**:
   - `PORT`: Render lo asigna automáticamente
   - `WHATSAPP_NUMBER`: `51999999999`

6. Click en **Create Web Service**

### Paso 3: Verificar el Despliegue

1. Render comenzará a construir y desplegar tu aplicación
2. Puedes ver el progreso en los **Logs**
3. Una vez completado, Render te dará una URL como:
   - `https://puntoencanta.onrender.com`
   - O `https://puntoencanta-XXXX.onrender.com`

4. Visita la URL para verificar que todo funciona

### Paso 4: Configurar Dominio Personalizado (Opcional)

1. En el dashboard de tu servicio en Render
2. Ve a **Settings** → **Custom Domain**
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## 🔧 Troubleshooting

### Error: "Port already in use"
- **Solución**: Asegúrate de que `application.properties` use `${PORT:8080}`

### Error: "Build failed"
- **Solución**: Revisa los logs en Render. Asegúrate de que:
  - El `pom.xml` esté correcto
  - Todas las dependencias estén disponibles
  - El Dockerfile esté en la raíz del proyecto

### La aplicación no inicia
- **Solución**: 
  - Verifica los logs en Render
  - Asegúrate de que la variable `PORT` esté configurada (Render la asigna automáticamente)
  - Verifica que `WHATSAPP_NUMBER` esté configurada

### Healthcheck falla
- **Solución**: El healthcheck verifica `http://localhost:8080/`. Si tu aplicación no responde, verifica:
  - Que el puerto esté correctamente configurado
  - Que la aplicación esté escuchando en el puerto correcto

## 📝 Notas Importantes

1. **Plan Free de Render**:
   - El servicio se "duerme" después de 15 minutos de inactividad
   - El primer request después de dormir puede tardar ~30 segundos
   - Considera el plan pago si necesitas que esté siempre activo

2. **Variables de Entorno**:
   - `PORT` es asignada automáticamente por Render
   - Solo necesitas configurar `WHATSAPP_NUMBER`

3. **Logs**:
   - Siempre revisa los logs en Render si hay problemas
   - Los logs muestran errores de compilación y runtime

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
3. Render detectará automáticamente los cambios y redeployará

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el código compile localmente antes de hacer push
