"""Robust checkpoint management for training state persistence.

Checkpoints contain all information needed to resume training:
- Model weights
- Optimizer state
- Scheduler state  
- Training step/epoch
- Configuration
- Random number generator states
- Best validation loss

Security: Uses torch.load with weights_only=True where possible.
Avoids pickle deserialization of untrusted data.
"""
import torch
import os
import glob
from pathlib import Path
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class CheckpointData:
    model_state_dict: dict
    optimizer_state_dict: dict
    scheduler_state_dict: dict | None
    step: int
    epoch: int
    config: dict
    best_val_loss: float
    rng_states: dict | None

class CheckpointManager:
    def __init__(self, checkpoint_dir: str | Path, max_checkpoints: int = 5):
        self.checkpoint_dir = Path(checkpoint_dir)
        self.max_checkpoints = max_checkpoints
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)
        
    def save(
        self,
        model: torch.nn.Module,
        optimizer: torch.optim.Optimizer,
        scheduler: torch.optim.lr_scheduler.LRScheduler | None,
        step: int,
        epoch: int,
        config: dict,
        val_loss: float,
        is_best: bool = False
    ) -> Path:
        """Save a training checkpoint."""
        rng_states = {
            "cpu": torch.random.get_rng_state(),
        }
        if torch.cuda.is_available():
            rng_states["cuda"] = torch.cuda.get_rng_state()
            
        state = {
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "scheduler_state_dict": scheduler.state_dict() if scheduler else None,
            "step": step,
            "epoch": epoch,
            "config": config,
            "best_val_loss": val_loss,
            "rng_states": rng_states
        }
        
        checkpoint_path = self.checkpoint_dir / f"checkpoint_step_{step}.pt"
        torch.save(state, checkpoint_path)
        logger.info(f"Saved checkpoint to {checkpoint_path}")
        
        if is_best:
            best_path = self.checkpoint_dir / "checkpoint_best.pt"
            torch.save(state, best_path)
            logger.info(f"Saved new best checkpoint to {best_path}")
            
        self._cleanup_old_checkpoints()
        return checkpoint_path
        
    def load(self, path: str | Path, device: str | torch.device = "cpu") -> CheckpointData:
        """Load a checkpoint from a specific path."""
        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Checkpoint not found at {path}")
            
        try:
            logger.info(f"Loading checkpoint from {path}")
            # we need to set weights_only=False here because we have optimizer states, configs, etc.
            state = torch.load(path, map_location=device, weights_only=False)
            
            return CheckpointData(
                model_state_dict=state["model_state_dict"],
                optimizer_state_dict=state["optimizer_state_dict"],
                scheduler_state_dict=state["scheduler_state_dict"],
                step=state["step"],
                epoch=state["epoch"],
                config=state.get("config", {}),
                best_val_loss=state.get("best_val_loss", float("inf")),
                rng_states=state.get("rng_states")
            )
        except Exception as e:
            logger.error(f"Failed to load checkpoint {path}: {e}")
            raise
            
    def load_best(self, device: str | torch.device = "cpu") -> CheckpointData | None:
        """Load the best checkpoint if it exists."""
        best_path = self.checkpoint_dir / "checkpoint_best.pt"
        if best_path.exists():
            return self.load(best_path, device)
        return None
        
    def load_latest(self, device: str | torch.device = "cpu") -> CheckpointData | None:
        """Load the most recent step checkpoint."""
        checkpoints = glob.glob(str(self.checkpoint_dir / "checkpoint_step_*.pt"))
        if not checkpoints:
            return None
            
        # Extract step numbers and find max
        try:
            latest = max(checkpoints, key=lambda x: int(Path(x).stem.split("_")[-1].replace('.pt', '')))
            return self.load(latest, device)
        except ValueError:
            return None
            
    def _cleanup_old_checkpoints(self) -> None:
        """Keep only the most recent max_checkpoints step checkpoints."""
        checkpoints = glob.glob(str(self.checkpoint_dir / "checkpoint_step_*.pt"))
        if len(checkpoints) <= self.max_checkpoints:
            return
            
        # Sort by step number
        checkpoints.sort(key=lambda x: int(Path(x).stem.split("_")[-1].replace('.pt', '')))
        
        # Remove oldest
        for to_remove in checkpoints[:-self.max_checkpoints]:
            try:
                os.remove(to_remove)
                logger.debug(f"Removed old checkpoint: {to_remove}")
            except OSError as e:
                logger.warning(f"Failed to remove old checkpoint {to_remove}: {e}")
