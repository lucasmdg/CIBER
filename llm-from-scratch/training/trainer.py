"""Complete training loop for the Transformer language model.

The Trainer handles:
- Training epochs with gradient accumulation
- Validation at configurable intervals
- Learning rate scheduling
- Gradient clipping
- Mixed precision training (optional)
- Checkpointing
- Logging (loss, lr, perplexity, throughput, memory)
- Device management (CPU/CUDA auto-detection)
- Resume from checkpoint
"""
import torch
import time
import logging
import math
from pathlib import Path

logger = logging.getLogger(__name__)

class Trainer:
    """Trainer for training a Transformer language model."""
    
    def __init__(
        self,
        model: torch.nn.Module,
        train_loader: torch.utils.data.DataLoader,
        val_loader: torch.utils.data.DataLoader,
        optimizer: torch.optim.Optimizer,
        scheduler: torch.optim.lr_scheduler.LRScheduler,
        config: dict,
        checkpoint_manager,
        device: str | torch.device = "auto",
        mixed_precision: bool = False,
        gradient_clip: float = 1.0,
        gradient_accumulation_steps: int = 1,
        eval_interval: int = 200,
        eval_steps: int = 50,
    ):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.config = config
        self.checkpoint_manager = checkpoint_manager
        
        if device == "auto":
            self.device = self._get_device()
        else:
            self.device = torch.device(device)
            
        self.model = self.model.to(self.device)
        
        self.mixed_precision = mixed_precision and self.device.type == "cuda"
        self.scaler = torch.amp.GradScaler('cuda') if self.mixed_precision else None
        
        self.gradient_clip = gradient_clip
        self.gradient_accumulation_steps = gradient_accumulation_steps
        self.eval_interval = eval_interval
        self.eval_steps = eval_steps
        
        self.step = 0
        self.epoch = 0
        self.best_val_loss = float("inf")
        
        # Ensure we have a cross entropy loss function
        self.criterion = torch.nn.CrossEntropyLoss()
        
    def _get_device(self) -> torch.device:
        """Determine the best available device."""
        if torch.cuda.is_available():
            return torch.device("cuda")
        # Could add MPS support here if desired
        return torch.device("cpu")
        
    def _print_system_info(self) -> None:
        """Print system and model configuration information."""
        logger.info("="*50)
        logger.info(f"PyTorch version: {torch.__version__}")
        logger.info(f"Device: {self.device}")
        if self.device.type == "cuda":
            logger.info(f"CUDA version: {torch.version.cuda}")
            logger.info(f"GPU: {torch.cuda.get_device_name(0)}")
            
        num_params = sum(p.numel() for p in self.model.parameters())
        logger.info(f"Model parameters: {num_params:,}")
        logger.info(f"Model config: {self.config}")
        
        train_config = {
            "mixed_precision": self.mixed_precision,
            "gradient_clip": self.gradient_clip,
            "gradient_accumulation_steps": self.gradient_accumulation_steps,
            "eval_interval": self.eval_interval,
            "eval_steps": self.eval_steps,
        }
        logger.info(f"Training config: {train_config}")
        logger.info("="*50)
        
    def _train_step(self, batch: tuple[torch.Tensor, torch.Tensor]) -> float:
        """Perform a single training micro-step."""
        x, y = [t.to(self.device) for t in batch]
        
        # Forward pass
        if self.mixed_precision:
            with torch.amp.autocast('cuda'):
                # Assuming model returns logits
                logits = self.model(x)
                # Reshape for CrossEntropyLoss: logits [B*T, C], targets [B*T]
                loss = self.criterion(logits.view(-1, logits.size(-1)), y.view(-1))
                loss = loss / self.gradient_accumulation_steps
        else:
            logits = self.model(x)
            loss = self.criterion(logits.view(-1, logits.size(-1)), y.view(-1))
            loss = loss / self.gradient_accumulation_steps
            
        # Backward pass
        if self.mixed_precision:
            self.scaler.scale(loss).backward()
        else:
            loss.backward()
            
        return loss.item() * self.gradient_accumulation_steps
        
    @torch.no_grad()
    def _evaluate(self) -> dict:
        """Evaluate the model on the validation set."""
        self.model.eval()
        total_loss = 0.0
        steps = 0
        
        for batch in self.val_loader:
            if steps >= self.eval_steps:
                break
                
            x, y = [t.to(self.device) for t in batch]
            
            if self.mixed_precision:
                with torch.amp.autocast('cuda'):
                    logits = self.model(x)
                    loss = self.criterion(logits.view(-1, logits.size(-1)), y.view(-1))
            else:
                logits = self.model(x)
                loss = self.criterion(logits.view(-1, logits.size(-1)), y.view(-1))
                
            total_loss += loss.item()
            steps += 1
            
        self.model.train()
        
        avg_loss = total_loss / max(1, steps)
        perplexity = math.exp(avg_loss) if avg_loss < 20 else float('inf')
        
        return {
            "val_loss": avg_loss,
            "perplexity": perplexity
        }
        
    def _log_metrics(self, step: int, train_loss: float, val_metrics: dict | None, lr: float, tokens_per_sec: float) -> None:
        """Log training metrics."""
        msg = f"Step {step} | Train Loss: {train_loss:.4f} | LR: {lr:.6e} | Tokens/sec: {tokens_per_sec:.1f}"
        if val_metrics:
            msg += f" | Val Loss: {val_metrics['val_loss']:.4f} | PPL: {val_metrics['perplexity']:.2f}"
            
        if self.device.type == "cuda":
            mem_mb = torch.cuda.max_memory_allocated() / (1024 * 1024)
            msg += f" | Mem: {mem_mb:.0f}MB"
            
        logger.info(msg)
        
    def train(self, max_epochs: int = None, max_steps: int = None) -> dict:
        """Main training loop."""
        if max_epochs is None and max_steps is None:
            raise ValueError("Must specify either max_epochs or max_steps")
            
        self._print_system_info()
        self.model.train()
        
        start_time = time.time()
        train_iterator = iter(self.train_loader)
        
        last_log_time = time.time()
        tokens_processed = 0
        
        try:
            while True:
                # Check stopping conditions
                if max_steps is not None and self.step >= max_steps:
                    break
                if max_epochs is not None and self.epoch >= max_epochs:
                    break
                    
                self.step += 1
                step_loss = 0.0
                
                # Gradient accumulation loop
                for _ in range(self.gradient_accumulation_steps):
                    try:
                        batch = next(train_iterator)
                    except StopIteration:
                        self.epoch += 1
                        if max_epochs is not None and self.epoch >= max_epochs:
                            break
                        train_iterator = iter(self.train_loader)
                        batch = next(train_iterator)
                        
                    # Calculate tokens for throughput
                    x = batch[0]
                    tokens_processed += x.numel()
                        
                    loss_val = self._train_step(batch)
                    step_loss += loss_val / self.gradient_accumulation_steps
                    
                if max_epochs is not None and self.epoch >= max_epochs:
                    break
                    
                # Optimizer step
                if self.mixed_precision:
                    if self.gradient_clip > 0:
                        self.scaler.unscale_(self.optimizer)
                        torch.nn.utils.clip_grad_norm_(self.model.parameters(), self.gradient_clip)
                    self.scaler.step(self.optimizer)
                    self.scaler.update()
                else:
                    if self.gradient_clip > 0:
                        torch.nn.utils.clip_grad_norm_(self.model.parameters(), self.gradient_clip)
                    self.optimizer.step()
                    
                self.optimizer.zero_grad(set_to_none=True)
                self.scheduler.step()
                
                # Evaluation and checkpointing
                if self.step % self.eval_interval == 0:
                    val_metrics = self._evaluate()
                    val_loss = val_metrics["val_loss"]
                    
                    is_best = val_loss < self.best_val_loss
                    if is_best:
                        self.best_val_loss = val_loss
                        
                    current_lr = self.optimizer.param_groups[0]['lr']
                    
                    # Calculate throughput
                    curr_time = time.time()
                    elapsed = curr_time - last_log_time
                    tps = tokens_processed / elapsed if elapsed > 0 else 0
                    
                    self._log_metrics(self.step, step_loss, val_metrics, current_lr, tps)
                    
                    # Reset stats for next log
                    last_log_time = curr_time
                    tokens_processed = 0
                    
                    if self.checkpoint_manager:
                        self.checkpoint_manager.save(
                            model=self.model,
                            optimizer=self.optimizer,
                            scheduler=self.scheduler,
                            step=self.step,
                            epoch=self.epoch,
                            config=self.config,
                            val_loss=val_loss,
                            is_best=is_best
                        )
                        
        except KeyboardInterrupt:
            logger.warning("Training interrupted by user! Saving checkpoint...")
            if self.checkpoint_manager:
                self.checkpoint_manager.save(
                    model=self.model,
                    optimizer=self.optimizer,
                    scheduler=self.scheduler,
                    step=self.step,
                    epoch=self.epoch,
                    config=self.config,
                    val_loss=self.best_val_loss,
                    is_best=False
                )
                
        total_time = time.time() - start_time
        logger.info(f"Training completed in {total_time:.2f}s")
        
        return {
            "train_loss": step_loss,
            "best_val_loss": self.best_val_loss,
            "total_steps": self.step,
            "training_time": total_time
        }

    @classmethod
    def from_checkpoint(
        cls,
        checkpoint_path: str | Path,
        model: torch.nn.Module,
        train_loader: torch.utils.data.DataLoader,
        val_loader: torch.utils.data.DataLoader,
        optimizer: torch.optim.Optimizer,
        scheduler: torch.optim.lr_scheduler.LRScheduler,
        checkpoint_manager,
        **kwargs
    ) -> "Trainer":
        """Initialize trainer from a checkpoint."""
        trainer = cls(
            model=model,
            train_loader=train_loader,
            val_loader=val_loader,
            optimizer=optimizer,
            scheduler=scheduler,
            checkpoint_manager=checkpoint_manager,
            config={},  # Will be overridden
            **kwargs
        )
        
        chkpt = trainer.checkpoint_manager.load(checkpoint_path, trainer.device)
        
        trainer.model.load_state_dict(chkpt.model_state_dict)
        trainer.optimizer.load_state_dict(chkpt.optimizer_state_dict)
        if trainer.scheduler and chkpt.scheduler_state_dict:
            trainer.scheduler.load_state_dict(chkpt.scheduler_state_dict)
            
        trainer.step = chkpt.step
        trainer.epoch = chkpt.epoch
        trainer.config = chkpt.config
        trainer.best_val_loss = chkpt.best_val_loss
        
        if chkpt.rng_states:
            if "cpu" in chkpt.rng_states:
                torch.random.set_rng_state(chkpt.rng_states["cpu"])
            if "cuda" in chkpt.rng_states and torch.cuda.is_available():
                torch.cuda.set_rng_state(chkpt.rng_states["cuda"])
                
        logger.info(f"Resumed training from step {trainer.step}, epoch {trainer.epoch}")
        return trainer
