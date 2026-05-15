# ARP Spoofer/Detector

## Descripción
Este proyecto es una herramienta de seguridad diseñada para detectar ataques de **ARP Spoofing** (también conocido como ARP Poisoning) en una red local.

El ARP Spoofing es una técnica donde un atacante envía mensajes ARP falsos a la red local. Esto tiene como objetivo asociar la dirección MAC del atacante con la dirección IP de otro equipo (como la puerta de enlace predeterminada), provocando que todo el tráfico destinado a esa IP sea enviado al atacante.

## Características
- **Monitoreo en tiempo real**: Escucha el tráfico ARP en la red.
- **Detección de inconsistencias**: Compara la dirección MAC recibida en una respuesta ARP con la MAC real obtenida mediante una consulta directa.
- **Alertas**: Notifica al usuario cuando se detecta un posible ataque.

## Requisitos
- Python 3.x
- Scapy (`pip install scapy`)
- Privilegios de Administrador (Windows) o Root (Linux).

## Uso
Ejecuta el script especificando la interfaz de red (opcional):
```bash
python src/arp_monitor.py -i eth0
```

## Disclaimer
Esta herramienta es exclusivamente para fines educativos y de auditoría ética. No debe utilizarse en redes sin la debida autorización.
