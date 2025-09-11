# NFC Card Reader

Una aplicación web que permite detectar y leer tarjetas NFC en tiempo real usando Node.js y una interfaz web intuitiva.

## 🚀 Características

- **Detección en tiempo real**: Detecta automáticamente cuando se acerca o retira una tarjeta NFC
- **Interfaz web moderna**: Dashboard web limpio y responsive para monitorear el estado
- **Server-Sent Events**: Actualizaciones en tiempo real sin necesidad de recargar la página
- **API REST**: Endpoints para integración con otras aplicaciones
- **Múltiples lectores**: Soporte para múltiples lectores NFC conectados
- **Información detallada**: Muestra UID, tipo, estándar y marca de tiempo de cada tarjeta

## 📋 Requisitos previos

- **Node.js** (versión 14 o superior)
- **NPM** o **Yarn**
- **Lector NFC compatible** con PC/SC (como ACR122U)
- **Driver PC/SC** instalado en el sistema:
  - **Windows**: Generalmente incluido por defecto
  - **macOS**: Incluido por defecto
  - **Linux**: Instalar `pcscd` y `libpcsclite-dev`

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
   ```bash
   cd nfc-reader
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Conecta tu lector NFC** al puerto USB

4. **Inicia la aplicación**
   ```bash
   # Modo producción
   npm start
   
   # Modo desarrollo (con auto-reload)
   npm run dev
   ```

5. **Abre tu navegador** y ve a `http://localhost:3000`

## 🎯 Uso

### Interfaz Web
1. Abre `http://localhost:3000` en tu navegador
2. Verifica que el estado muestre "Conectado"
3. Acerca una tarjeta NFC al lector
4. Observa la información de la tarjeta en tiempo real

### API Endpoints

#### `GET /api/status`
Obtiene el estado actual del lector y la última tarjeta detectada.

**Respuesta:**
```json
{
  "status": true,
  "lastCard": {
    "uid": "04:a3:b2:c1:d4:e5:f6",
    "type": "TAG_ISO_14443_3",
    "standard": "TAG_ISO_14443_3",
    "timestamp": "2025-09-11T10:30:00.000Z",
    "reader": "ACS ACR122U"
  },
  "timestamp": "2025-09-11T10:30:00.000Z"
}
```

#### `POST /api/card/write`
Inicia una operación de escritura en la tarjeta (funcionalidad base implementada).

**Body:**
```json
{
  "data": "Hello World",
  "sector": 1,
  "block": 4
}
```

#### `GET /api/events`
Server-Sent Events para recibir actualizaciones en tiempo real.

**Eventos:**
- `card_detected`: Cuando se detecta una tarjeta
- `card_removed`: Cuando se retira una tarjeta
- `connected`: Confirmación de conexión

## 📦 Dependencias principales

- **express**: Servidor web
- **nfc-pcsc**: Librería para comunicación con lectores NFC
- **cors**: Habilitación de CORS para APIs
- **nodemon**: Auto-reload en desarrollo

## 🏗️ Estructura del proyecto

```
nfc-reader/
├── index.js          # Servidor principal
├── package.json      # Dependencias y scripts
├── README.md         # Documentación
└── public/           # Archivos estáticos del frontend
    ├── index.html    # Interfaz web principal
    ├── styles.css    # Estilos CSS
    └── logo.svg      # Logo de la aplicación
```

## ⚡ Scripts disponibles

```bash
# Iniciar en modo producción
npm start

# Iniciar en modo desarrollo con auto-reload
npm run dev
```

## 🔧 Configuración

El servidor se ejecuta por defecto en el puerto `3000`. Puedes modificar esto editando la variable `port` en `index.js`.

## 🐛 Solución de problemas

### Error: "No NFC readers found"
- Verifica que el lector NFC esté conectado correctamente
- Asegúrate de que los drivers PC/SC estén instalados
- En Linux, verifica que el servicio `pcscd` esté ejecutándose

### Error de permisos en Linux
```bash
# Añadir usuario al grupo necesario
sudo usermod -a -G dialout $USER
# Reiniciar sesión después del comando
```

### El frontend no se conecta
- Verifica que el servidor esté ejecutándose en `http://localhost:3000`
- Revisa la consola del navegador para errores de JavaScript
- Asegúrate de que no haya un firewall bloqueando el puerto

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de [Solución de problemas](#-solución-de-problemas)
2. Abre un issue en el repositorio
3. Verifica que tu lector NFC sea compatible con PC/SC

---

**Nota**: Este proyecto está diseñado para funcionar con lectores NFC compatibles con PC/SC. Los lectores más comunes como ACR122U funcionan perfectamente.
