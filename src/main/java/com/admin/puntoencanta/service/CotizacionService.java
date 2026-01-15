package com.admin.puntoencanta.service;

import com.admin.puntoencanta.model.Cotizacion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CotizacionService {
    private final List<Cotizacion> cotizaciones = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Cotizacion guardar(Cotizacion cotizacion) {
        cotizacion.setId(idGenerator.getAndIncrement());
        cotizaciones.add(cotizacion);
        return cotizacion;
    }

    public List<Cotizacion> obtenerTodas() {
        return new ArrayList<>(cotizaciones);
    }

    public Cotizacion obtenerPorId(Long id) {
        return cotizaciones.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
