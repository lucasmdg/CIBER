# Sistema Basico de Deteccion de Intrusiones (IDS)

## Descripcion
Un IDS (Intrusion Detection System) es como tener un vigilante invisible en tu red. Este programa analiza en tiempo real todo el trafico de red que pasa por tu equipo y busca patrones sospechosos que puedan indicar un ataque.

Piensa en ello como un detector de humos, pero para ataques informaticos: no evita el incendio, pero te avisa inmediatamente de que algo esta pasando.

## Que detecta
- **Escaneo de puertos**: Cuando alguien prueba muchos puertos de tu maquina para ver cuales estan abiertos (herramientas como Nmap hacen esto).
- **SYN Flood**: Un tipo de ataque de denegacion de servicio donde se envian miles de peticiones TCP a medio completar para saturar el servidor.
- **ICMP Flood (Ping Flood)**: Cuando alguien te bombardea con pings para saturar tu red.

## Como funciona
1. Captura paquetes de red en tiempo real con Scapy.
2. Analiza cada paquete buscando patrones sospechosos.
3. Lleva un registro temporal de la actividad por IP.
4. Cuando una IP supera un umbral (ej: 20 puertos en 10 segundos), lanza una alerta.

## Requisitos
- Python 3.x
- Scapy (`pip install scapy`)
- Privilegios de Administrador/Root

## Uso
```bash
python src/ids.py
```

## Aviso Legal
Solo para uso educativo y en redes propias o con autorizacion.
