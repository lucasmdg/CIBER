import unittest
from unittest.mock import patch, mock_open
import os
import sys

# Añadimos el directorio src al path para poder importar
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.keylogger import on_press

class TestKeylogger(unittest.TestCase):

    @patch("builtins.open", new_callable=mock_open)
    def test_on_press_space(self, mock_file):
        # Simulamos la presión de la tecla espacio
        on_press("Key.space")
        # Verificamos que se escribió un espacio
        mock_file().write.assert_called_with(" ")

    @patch("builtins.open", new_callable=mock_open)
    def test_on_press_char(self, mock_file):
        # Simulamos la presión de la tecla 'a'
        on_press("'a'")
        mock_file().write.assert_called_with("a")

    @patch("builtins.open", new_callable=mock_open)
    def test_on_press_enter(self, mock_file):
        # Simulamos la presión de Enter
        on_press("Key.enter")
        mock_file().write.assert_called_with("\n")

if __name__ == "__main__":
    unittest.main()
