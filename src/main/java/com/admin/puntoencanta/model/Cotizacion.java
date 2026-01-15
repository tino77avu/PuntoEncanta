package com.admin.puntoencanta.model;

import java.time.LocalDateTime;
import java.util.List;

public class Cotizacion {
    private Long id;
    private String nombre; // Puede ser nombre o empresa
    private String whatsapp;
    private Integer cantidadTotal;
    private String colores;
    private String tallas;
    private String ubicacion;
    private String comentarios;
    private LocalDateTime fechaCreacion;
    private List<ColorDetalle> detallesColores;

    public Cotizacion() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public Integer getCantidadTotal() {
        return cantidadTotal;
    }

    public void setCantidadTotal(Integer cantidadTotal) {
        this.cantidadTotal = cantidadTotal;
    }

    public String getColores() {
        return colores;
    }

    public void setColores(String colores) {
        this.colores = colores;
    }

    public String getTallas() {
        return tallas;
    }

    public void setTallas(String tallas) {
        this.tallas = tallas;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<ColorDetalle> getDetallesColores() {
        return detallesColores;
    }

    public void setDetallesColores(List<ColorDetalle> detallesColores) {
        this.detallesColores = detallesColores;
    }

    public static class ColorDetalle {
        private String color;
        private Integer cantidad;

        public ColorDetalle(String color, Integer cantidad) {
            this.color = color;
            this.cantidad = cantidad;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
