// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Header con scroll
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cerrar todos los demás items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle del item actual
        item.classList.toggle('active', !isActive);
    });
});

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Formulario de cotización - Validación en tiempo real
const cotizarForm = document.getElementById('cotizarForm');

if (cotizarForm) {
    const submitButton = cotizarForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Enviar cotización';
    
    // Validación en tiempo real
    const nombreInput = document.getElementById('nombre');
    const whatsappInput = document.getElementById('whatsapp');
    const cantidadInput = document.getElementById('cantidadTotal');
    const ubicacionInput = document.getElementById('ubicacion');
    const coloresInput = document.getElementById('colores');
    
    // Función para mostrar error en campo
    function mostrarError(input, mensaje) {
        const formGroup = input.closest('.form-group');
        let errorDiv = formGroup.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }
        
        errorDiv.textContent = mensaje;
        input.classList.remove('valid');
        input.classList.add('error');
        input.style.borderColor = '#c00';
        
        // Agregar clase al form-group para animación
        formGroup.classList.add('has-error');
        formGroup.classList.remove('has-valid');
    }
    
    // Función para limpiar error y mostrar éxito
    function limpiarError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
        
        // Solo mostrar validación si el campo tiene valor
        if (input.value && input.value.trim()) {
            input.classList.add('valid');
            formGroup.classList.add('has-valid');
        } else {
            input.classList.remove('valid');
            formGroup.classList.remove('has-valid');
        }
        
        formGroup.classList.remove('has-error');
        input.style.borderColor = '';
    }
    
    // Función para validar formato de colores - mejorada para aceptar múltiples variaciones
    function validarColores(textoColores) {
        if (!textoColores || !textoColores.trim()) {
            return { valido: false, mensaje: 'Debes especificar los colores y cantidades' };
        }
        
        const texto = textoColores.trim();
        const coloresDetectados = [];
        const errores = [];
        
        // Múltiples patrones para aceptar diferentes formatos:
        // 1. "5 polos azul, 4 polos blanco"
        // 2. "5 azul, 4 blanco, 3 negro"
        // 3. "5azul, 4blanco" (sin espacio)
        // 4. "5 azul marino, 4 blanco"
        
        // Patrón principal: número + (opcional "polos" o "polo") + color
        const patronPrincipal = /(\d+)\s*(?:polos?)?\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+?)(?=\s*,\s*|\s*$)/gi;
        const matches = [...texto.matchAll(patronPrincipal)];
        
        // Si no encuentra con el patrón principal, intentar parseo simple
        if (matches.length === 0) {
            // Intentar parseo simple: "5azul, 4blanco" o "5 azul, 4 blanco"
            const partes = texto.split(',').map(p => p.trim()).filter(p => p);
            
            if (partes.length === 0) {
                return { valido: false, mensaje: 'Formato incorrecto. Usa: "5 azul, 4 blanco, 3 negro"' };
            }
            
            for (const parte of partes) {
                // Buscar número al inicio
                const matchNumero = parte.match(/^(\d+)\s*(.+)$/);
                if (matchNumero) {
                    const cantidad = parseInt(matchNumero[1]);
                    const color = matchNumero[2].trim().replace(/^(polos?|polo)\s+/i, '').trim();
                    
                    if (color) {
                        coloresDetectados.push({ cantidad, color, parte: parte.trim() });
                        
                        if (cantidad < 3) {
                            errores.push(`El color "${color}" tiene solo ${cantidad} unidades. Mínimo 3 por color.`);
                        }
                    }
                } else {
                    // Intentar sin espacio: "5azul"
                    const matchSinEspacio = parte.match(/^(\d+)([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)$/);
                    if (matchSinEspacio) {
                        const cantidad = parseInt(matchSinEspacio[1]);
                        const color = matchSinEspacio[2].trim();
                        
                        coloresDetectados.push({ cantidad, color, parte: parte.trim() });
                        
                        if (cantidad < 3) {
                            errores.push(`El color "${color}" tiene solo ${cantidad} unidades. Mínimo 3 por color.`);
                        }
                    } else {
                        return { 
                            valido: false, 
                            mensaje: `Formato incorrecto en "${parte}". Usa: "5 azul, 4 blanco, 3 negro"` 
                        };
                    }
                }
            }
        } else {
            // Validar con el patrón principal
            for (const match of matches) {
                const cantidad = parseInt(match[1]);
                let color = match[2].trim();
                
                // Limpiar "polos" o "polo" si está después del número
                color = color.replace(/^(polos?|polo)\s+/i, '').trim();
                
                if (color) {
                    coloresDetectados.push({ cantidad, color, parte: match[0].trim() });
                    
                    if (cantidad < 3) {
                        errores.push(`El color "${color}" tiene solo ${cantidad} unidades. Mínimo 3 por color.`);
                    }
                }
            }
        }
        
        // Si no se detectaron colores, formato incorrecto
        if (coloresDetectados.length === 0) {
            return { valido: false, mensaje: 'Formato incorrecto. Usa: "5 azul, 4 blanco, 3 negro"' };
        }
        
        // Si hay errores de cantidad mínima, retornar el primero
        if (errores.length > 0) {
            return { valido: false, mensaje: errores[0] };
        }
        
        // Validación exitosa
        return { 
            valido: true, 
            colores: coloresDetectados,
            total: coloresDetectados.reduce((sum, c) => sum + c.cantidad, 0)
        };
    }
    
    // Validación en tiempo real
    if (nombreInput) {
        // Validación mientras escribe (limpiar error si hay texto)
        nombreInput.addEventListener('input', () => {
            if (nombreInput.value.trim()) {
                limpiarError(nombreInput);
            }
        });
        
        // Validación al perder el foco
        nombreInput.addEventListener('blur', () => {
            if (!nombreInput.value.trim()) {
                mostrarError(nombreInput, 'Este campo es obligatorio');
            } else {
                limpiarError(nombreInput);
            }
        });
    }
    
    if (whatsappInput) {
        // Validación mientras escribe
        whatsappInput.addEventListener('input', () => {
            const value = whatsappInput.value.trim();
            if (value && /^[\d\s\+\-\(\)]+$/.test(value)) {
                limpiarError(whatsappInput);
            }
        });
        
        // Validación al perder el foco
        whatsappInput.addEventListener('blur', () => {
            const value = whatsappInput.value.trim();
            if (!value) {
                mostrarError(whatsappInput, 'El número de WhatsApp es obligatorio');
            } else if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
                mostrarError(whatsappInput, 'Ingresa un número de WhatsApp válido');
            } else {
                limpiarError(whatsappInput);
            }
        });
    }
    
    if (cantidadInput) {
        // Validación mientras escribe
        cantidadInput.addEventListener('input', () => {
            const value = parseInt(cantidadInput.value);
            if (value && value < 12) {
                mostrarError(cantidadInput, 'El pedido mínimo es de 12 unidades');
            } else if (value && value >= 12) {
                limpiarError(cantidadInput);
            } else {
                cantidadInput.classList.remove('error', 'valid');
                cantidadInput.style.borderColor = '';
            }
        });
        
        // Validación al perder el foco
        cantidadInput.addEventListener('blur', () => {
            const value = parseInt(cantidadInput.value);
            if (!value || value < 12) {
                mostrarError(cantidadInput, 'El pedido mínimo es de 12 unidades');
            } else {
                limpiarError(cantidadInput);
            }
        });
    }
    
    if (ubicacionInput) {
        // Validación mientras escribe (limpiar error si hay texto)
        ubicacionInput.addEventListener('input', () => {
            if (ubicacionInput.value.trim()) {
                limpiarError(ubicacionInput);
            }
        });
        
        // Validación al perder el foco
        ubicacionInput.addEventListener('blur', () => {
            if (!ubicacionInput.value.trim()) {
                mostrarError(ubicacionInput, 'Este campo es obligatorio');
            } else {
                limpiarError(ubicacionInput);
            }
        });
    }
    
    if (coloresInput) {
        let timeoutColores = null;
        
        // Validación mientras escribe (con debounce para no validar en cada tecla)
        coloresInput.addEventListener('input', () => {
            const texto = coloresInput.value.trim();
            
            // Limpiar timeout anterior
            if (timeoutColores) {
                clearTimeout(timeoutColores);
            }
            
            // Si el campo está vacío, limpiar errores
            if (!texto) {
                coloresInput.classList.remove('error', 'valid');
                coloresInput.style.borderColor = '';
                const formGroup = coloresInput.closest('.form-group');
                const errorDiv = formGroup.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.remove();
                }
                return;
            }
            
            // Validación básica mientras escribe (sin ser muy estricto)
            const tieneNumeros = /\d+/.test(texto);
            const tieneTexto = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(texto);
            const tieneComas = texto.includes(',');
            
            // Si tiene números, texto y al menos una coma, probablemente está bien formateado
            if (tieneNumeros && tieneTexto && (tieneComas || texto.split(/\s+/).length >= 2)) {
                // Validación completa con debounce (esperar 500ms después de dejar de escribir)
                timeoutColores = setTimeout(() => {
                    const validacion = validarColores(texto);
                    if (validacion.valido) {
                        limpiarError(coloresInput);
                        // Mostrar resumen si es válido
                        if (validacion.colores && validacion.colores.length > 0) {
                            const resumen = validacion.colores.map(c => `${c.cantidad} ${c.color}`).join(', ');
                            // Opcional: mostrar un pequeño mensaje de éxito
                            coloresInput.setAttribute('title', `✓ ${resumen} (Total: ${validacion.total})`);
                        }
                    } else {
                        // No mostrar error mientras escribe, solo al perder el foco
                        coloresInput.removeAttribute('title');
                    }
                }, 500);
            } else {
                // Formato muy básico incorrecto, pero no mostrar error hasta blur
                coloresInput.removeAttribute('title');
            }
        });
        
        // Validación completa al perder el foco
        coloresInput.addEventListener('blur', () => {
            // Limpiar timeout si existe
            if (timeoutColores) {
                clearTimeout(timeoutColores);
            }
            
            const texto = coloresInput.value.trim();
            if (!texto) {
                mostrarError(coloresInput, 'Debes especificar los colores y cantidades');
            } else {
                const validacion = validarColores(texto);
                if (!validacion.valido) {
                    mostrarError(coloresInput, validacion.mensaje);
                } else {
                    limpiarError(coloresInput);
                    // Mostrar resumen en el tooltip
                    if (validacion.colores && validacion.colores.length > 0) {
                        const resumen = validacion.colores.map(c => `${c.cantidad} ${c.color}`).join(', ');
                        coloresInput.setAttribute('title', `✓ ${resumen} (Total: ${validacion.total})`);
                    }
                }
            }
        });
    }
    
    // Validación antes de enviar
    cotizarForm.addEventListener('submit', (e) => {
        // Limpiar errores previos
        cotizarForm.querySelectorAll('.error-message').forEach(el => el.remove());
        cotizarForm.querySelectorAll('input, textarea').forEach(input => {
            input.style.borderColor = '';
        });
        
        let hayErrores = false;
        const errores = [];
        
        // Validar campos obligatorios
        if (!nombreInput || !nombreInput.value.trim()) {
            if (nombreInput) mostrarError(nombreInput, 'Este campo es obligatorio');
            hayErrores = true;
        }
        
        if (!whatsappInput || !whatsappInput.value.trim()) {
            if (whatsappInput) mostrarError(whatsappInput, 'El número de WhatsApp es obligatorio');
            hayErrores = true;
        } else if (whatsappInput && !/^[\d\s\+\-\(\)]+$/.test(whatsappInput.value.trim())) {
            mostrarError(whatsappInput, 'Ingresa un número de WhatsApp válido');
            hayErrores = true;
        }
        
        const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 0;
        if (!cantidad || cantidad < 12) {
            if (cantidadInput) mostrarError(cantidadInput, 'El pedido mínimo es de 12 unidades');
            hayErrores = true;
        }
        
        if (!ubicacionInput || !ubicacionInput.value.trim()) {
            if (ubicacionInput) mostrarError(ubicacionInput, 'Este campo es obligatorio');
            hayErrores = true;
        }
        
        // Validar colores con formato y cantidad mínima
        if (!coloresInput || !coloresInput.value.trim()) {
            if (coloresInput) mostrarError(coloresInput, 'Debes especificar los colores y cantidades');
            hayErrores = true;
        } else if (coloresInput) {
            // Validación completa de colores al enviar
            const validacionColores = validarColores(coloresInput.value);
            if (!validacionColores.valido) {
                mostrarError(coloresInput, validacionColores.mensaje);
                hayErrores = true;
            } else {
                // Validar que la suma de colores coincida con cantidad total si está especificada
                if (cantidadInput && cantidadInput.value) {
                    const cantidadTotal = parseInt(cantidadInput.value);
                    if (validacionColores.total && validacionColores.total !== cantidadTotal) {
                        mostrarError(coloresInput, `La suma de colores (${validacionColores.total}) no coincide con la cantidad total (${cantidadTotal})`);
                        hayErrores = true;
                    }
                }
            }
        } else if (coloresInput) {
            const validacionColores = validarColores(coloresInput.value);
            if (!validacionColores.valido) {
                mostrarError(coloresInput, validacionColores.mensaje);
                hayErrores = true;
            }
        }
        
        if (hayErrores) {
            e.preventDefault();
            
            // Scroll al primer campo con error de forma suave
            const firstErrorInput = cotizarForm.querySelector('input.error, textarea.error');
            if (firstErrorInput) {
                // Calcular posición considerando el header
                const headerHeight = 80;
                const inputPosition = firstErrorInput.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = inputPosition - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Enfocar el campo después de un pequeño delay
                setTimeout(() => {
                    firstErrorInput.focus();
                }, 300);
            }
            
            return false;
        }
        
        // Mostrar loading state solo si no hay errores
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'not-allowed';
        }
        
        // El formulario se enviará normalmente al backend
        // No prevenimos el submit si no hay errores
        return true;
    });
    
    // Restaurar estado del botón si hay errores del servidor (cuando se recarga la página)
    window.addEventListener('load', () => {
        const erroresDelServidor = document.querySelector('.alert-error');
        if (erroresDelServidor && submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }
    });
}

// Animación al hacer scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las secciones
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Validación en tiempo real del campo cantidad (ya manejado arriba)

// Efecto parallax suave en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Lazy loading para imágenes (si se agregan imágenes reales)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
