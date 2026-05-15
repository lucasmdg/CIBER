import sys
import os
import pytest
from unittest.mock import MagicMock
from scapy.layers.inet import IP, TCP

# Añadir el directorio src al path para poder importar el módulo
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from sniffer_avanzado import AdvancedSniffer

def test_sniffer_stats_increment():
    # Setup
    sniffer = AdvancedSniffer()
    
    # Crear un paquete simulado
    packet = IP(src="1.2.3.4", dst="5.6.7.8") / TCP()
    
    # Procesar
    sniffer.process_packet(packet)
    
    # Verificar
    assert sniffer.stats["Total"] == 1
    assert sniffer.stats["TCP"] == 1
    assert sniffer.stats["UDP"] == 0

def test_sniffer_output_file(tmp_path):
    log_file = tmp_path / "test_log.txt"
    sniffer = AdvancedSniffer(output_file=str(log_file))
    
    sniffer.log_packet("Test message")
    
    assert log_file.exists()
    content = log_file.read_text()
    assert "Test message" in content
