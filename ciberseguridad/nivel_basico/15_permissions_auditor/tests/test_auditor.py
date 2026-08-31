import unittest
from unittest.mock import patch, MagicMock
import stat
from src.auditor import audit_file_permissions

class TestPermissionsAuditor(unittest.TestCase):

    @patch('os.stat')
    def test_audit_suid_sgid(self, mock_stat):
        # Configurar mock para simular un archivo con SUID y SGID activo
        mock_result = MagicMock()
        # stat.S_ISUID (0o4000) | stat.S_ISGID (0o2000)
        mock_result.st_mode = stat.S_ISUID | stat.S_ISGID
        mock_stat.return_value = mock_result
        
        issues = audit_file_permissions("dummy_file")
        self.assertTrue(any("SUID" in issue for issue in issues))
        self.assertTrue(any("SGID" in issue for issue in issues))

    @patch('os.stat')
    def test_audit_world_writable_dir_no_sticky(self, mock_stat):
        # Configurar mock para simular un directorio world-writable sin sticky bit
        mock_result = MagicMock()
        # stat.S_IFDIR (directorio) | stat.S_IWOTH (world-writable)
        mock_result.st_mode = stat.S_IFDIR | stat.S_IWOTH
        mock_stat.return_value = mock_result
        
        issues = audit_file_permissions("dummy_dir")
        self.assertTrue(any("sticky bit" in issue for issue in issues))

    @patch('os.stat')
    def test_audit_sensitive_file_exposed(self, mock_stat):
        # Configurar mock para simular un archivo ".env" legible por todos
        mock_result = MagicMock()
        # stat.S_IROTH (world-readable)
        mock_result.st_mode = stat.S_IROTH
        mock_stat.return_value = mock_result
        
        issues = audit_file_permissions("path/to/.env")
        self.assertTrue(any("legible por cualquiera" in issue for issue in issues))

if __name__ == '__main__':
    unittest.main()
