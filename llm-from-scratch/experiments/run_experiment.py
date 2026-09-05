import sys
from pathlib import Path
import argparse
import subprocess

def run_experiment(config_path: str):
    """Runs training with a specific configuration for experimental purposes."""
    print(f"Running experiment with config: {config_path}")
    script_path = Path(__file__).parent.parent / "scripts" / "train.py"
    subprocess.run([sys.executable, str(script_path), "--config", config_path])

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Ablation Experiments")
    parser.add_argument("--config", type=str, required=True, help="Experiment YAML config")
    args = parser.parse_args()
    run_experiment(args.config)
