package com.admin.puntoencanta.controller;

import com.admin.puntoencanta.model.Cotizacion;
import com.admin.puntoencanta.service.CotizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class HomeController {

    @Autowired
    private CotizacionService cotizacionService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("pageTitle", "Inicio");
        model.addAttribute("pageDescription", "Bordado profesional de logos en polos piqué. Ideal para empresas, equipos de trabajo y emprendimientos.");
        return "index";
    }

    @GetMapping("/polos")
    public String polos(Model model) {
        model.addAttribute("pageTitle", "Productos");
        model.addAttribute("pageDescription", "Polos piqué con acabado elegante, cómodos para uso diario y perfectos para imagen corporativa.");
        return "polos";
    }

    @GetMapping("/bordado")
    public String bordado(Model model) {
        model.addAttribute("pageTitle", "Bordado & Personalización");
        model.addAttribute("pageDescription", "Convertimos tu logo en bordado de alta durabilidad, manteniendo proporción, legibilidad y buena presencia.");
        return "bordado";
    }

    @GetMapping("/como-pedir")
    public String comoPedir(Model model) {
        model.addAttribute("pageTitle", "Cómo pedir");
        model.addAttribute("pageDescription", "Proceso simple en 4 pasos para realizar tu pedido de polos piqué bordados.");
        return "como-pedir";
    }

    @GetMapping("/portafolio")
    public String portafolio(Model model) {
        model.addAttribute("pageTitle", "Portafolio");
        model.addAttribute("pageDescription", "Algunos ejemplos de bordados corporativos y personalizados realizados por PuntoEncanta.");
        return "portafolio";
    }

    @GetMapping("/faq")
    public String faq(Model model) {
        model.addAttribute("pageTitle", "Preguntas frecuentes");
        model.addAttribute("pageDescription", "Respuestas a las preguntas más comunes sobre nuestros polos piqué bordados.");
        return "faq";
    }

    @GetMapping("/cotizar")
    public String cotizar(Model model) {
        model.addAttribute("pageTitle", "Cotizar");
        model.addAttribute("pageDescription", "Solicita una cotización personalizada para tu pedido de polos piqué bordados.");
        if (!model.containsAttribute("cotizacion")) {
            model.addAttribute("cotizacion", new Cotizacion());
        }
        return "cotizar";
    }

    @PostMapping("/cotizar")
    public String procesarCotizacion(@ModelAttribute Cotizacion cotizacion,
                                     BindingResult result,
                                     RedirectAttributes redirectAttributes) {
        
        // Validaciones
        List<String> errores = new ArrayList<>();
        
        // Validar cantidad total >= 12
        if (cotizacion.getCantidadTotal() == null || cotizacion.getCantidadTotal() < 12) {
            errores.add("La cantidad total debe ser mínimo 12 unidades.");
        }
        
        // Validar WhatsApp obligatorio
        if (cotizacion.getWhatsapp() == null || cotizacion.getWhatsapp().trim().isEmpty()) {
            errores.add("El número de WhatsApp es obligatorio.");
        }
        
        // Validar colores si se proporciona detalle
        if (cotizacion.getColores() != null && !cotizacion.getColores().trim().isEmpty()) {
            List<Cotizacion.ColorDetalle> detalles = parsearColores(cotizacion.getColores());
            cotizacion.setDetallesColores(detalles);
            
            for (Cotizacion.ColorDetalle detalle : detalles) {
                if (detalle.getCantidad() < 3) {
                    errores.add("Cada color debe tener mínimo 3 unidades. El color '" + detalle.getColor() + "' tiene solo " + detalle.getCantidad() + ".");
                }
            }
            
            // Validar que la suma de colores coincida con cantidad total (si se proporciona cantidad total)
            if (cotizacion.getCantidadTotal() != null && !detalles.isEmpty()) {
                int sumaColores = detalles.stream().mapToInt(Cotizacion.ColorDetalle::getCantidad).sum();
                if (sumaColores != cotizacion.getCantidadTotal()) {
                    errores.add("La suma de las cantidades por color (" + sumaColores + ") no coincide con la cantidad total (" + cotizacion.getCantidadTotal() + ").");
                }
            }
        }
        
        // Si hay errores, redirigir con mensajes
        if (!errores.isEmpty()) {
            redirectAttributes.addFlashAttribute("errores", errores);
            redirectAttributes.addFlashAttribute("cotizacion", cotizacion);
            return "redirect:/cotizar";
        }
        
        // Guardar cotización
        cotizacionService.guardar(cotizacion);
        
        return "redirect:/gracias";
    }

    @GetMapping("/gracias")
    public String gracias(Model model) {
        model.addAttribute("pageTitle", "Gracias");
        model.addAttribute("pageDescription", "Hemos recibido tu solicitud de cotización.");
        return "gracias";
    }

    /**
     * Parsea el texto de colores y cantidades en una lista de ColorDetalle
     * Ejemplo: "5 polos azul, 4 polos blanco, 3 polos negro"
     */
    private List<Cotizacion.ColorDetalle> parsearColores(String textoColores) {
        List<Cotizacion.ColorDetalle> detalles = new ArrayList<>();
        
        // Patrón para encontrar "número + palabra + color"
        Pattern pattern = Pattern.compile("(\\d+)\\s+(?:polos?\\s+)?([a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+?)(?:,|$)");
        Matcher matcher = pattern.matcher(textoColores.toLowerCase());
        
        while (matcher.find()) {
            int cantidad = Integer.parseInt(matcher.group(1));
            String color = matcher.group(2).trim();
            detalles.add(new Cotizacion.ColorDetalle(color, cantidad));
        }
        
        // Si no se encontraron patrones, intentar parseo simple
        if (detalles.isEmpty()) {
            String[] partes = textoColores.split(",");
            for (String parte : partes) {
                parte = parte.trim();
                String[] palabras = parte.split("\\s+");
                if (palabras.length >= 2) {
                    try {
                        int cantidad = Integer.parseInt(palabras[0]);
                        String color = parte.substring(palabras[0].length()).trim();
                        if (!color.isEmpty()) {
                            detalles.add(new Cotizacion.ColorDetalle(color, cantidad));
                        }
                    } catch (NumberFormatException e) {
                        // Ignorar si no se puede parsear
                    }
                }
            }
        }
        
        return detalles;
    }
}
