import subprocess
import sys
import time
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

def main():
    print("=" * 60)
    print("  Paper2Run — Research-to-Reproduction Assistant")
    print("=" * 60)
    print("Starting backend and frontend services...\n")

    # 1. Start FastAPI backend
    backend_dir = ROOT_DIR / "backend"
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=backend_dir
    )
    print("  [Backend]  FastAPI running at http://127.0.0.1:8000 (Docs: /docs)")

    # 2. Start Vite frontend
    frontend_dir = ROOT_DIR / "frontend"
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"],
        cwd=frontend_dir
    )
    print("  [Frontend] Vite running at http://127.0.0.1:5173\n")

    time.sleep(2)
    print("Opening workspace in default browser...")
    webbrowser.open("http://127.0.0.1:5173")
    print("\nPress Ctrl+C to terminate both servers.")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down Paper2Run...")
        backend_proc.terminate()
        frontend_proc.terminate()
        backend_proc.wait()
        frontend_proc.wait()
        print("Done.")

if __name__ == "__main__":
    main()
