import sys
import os
import tempfile
from pathlib import Path
from collections import deque
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

_events = deque(maxlen=200)

class SentinelEventHandler(FileSystemEventHandler):
    def on_created(self, event):
        _events.append({"type": "created", "path": event.src_path, "time": _now()})
    def on_modified(self, event):
        _events.append({"type": "modified", "path": event.src_path, "time": _now()})
    def on_deleted(self, event):
        _events.append({"type": "deleted", "path": event.src_path, "time": _now()})
    def on_moved(self, event):
        _events.append({"type": "moved", "path": f"{event.src_path} -> {event.dest_path}", "time": _now()})

def _now():
    from datetime import datetime
    return datetime.now().isoformat()

def get_monitored_paths():
    home = Path.home()
    paths = []
    paths.append(str(home / "Desktop"))
    paths.append(str(home / "Downloads"))
    paths.append(tempfile.gettempdir())
    if sys.platform == "win32":
        paths.append(r"C:\Windows\System32")
    else:
        paths.append("/etc")
    return [p for p in paths if os.path.isdir(p)]

def start_watcher():
    event_handler = SentinelEventHandler()
    observer = Observer()
    for path in get_monitored_paths():
        try:
            observer.schedule(event_handler, path, recursive=False)
        except Exception:
            pass
    observer.daemon = True
    observer.start()
    return observer

def get_events(limit=50):
    return list(_events)[-limit:]
