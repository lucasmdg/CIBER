"""Learning rate scheduling with warmup and cosine decay.

Implements a scheduler that:
1. Linearly increases LR from 0 to max_lr during warmup
2. Cosine decays LR from max_lr to min_lr after warmup

This is the standard schedule used in modern LLM training.
"""
import math
from torch.optim.lr_scheduler import LambdaLR
import torch

def create_scheduler(
    optimizer: torch.optim.Optimizer,
    warmup_steps: int,
    total_steps: int,
    min_lr_ratio: float = 0.1,
) -> LambdaLR:
    """Create a cosine annealing scheduler with linear warmup.
    
    Learning rate schedule:
        step < warmup_steps: lr = max_lr * (step / warmup_steps)
        step >= warmup_steps: lr = min_lr + 0.5 * (max_lr - min_lr) * (1 + cos(pi * progress))
        where progress = (step - warmup_steps) / (total_steps - warmup_steps)
    """
    def lr_lambda(step: int) -> float:
        # Edge case: totally finished
        if step > total_steps:
            return min_lr_ratio
            
        # Warmup phase
        if step < warmup_steps:
            if warmup_steps == 0:
                return 1.0
            return float(step) / float(max(1, warmup_steps))
            
        # Cosine decay phase
        progress = float(step - warmup_steps) / float(max(1, total_steps - warmup_steps))
        cosine_decay = 0.5 * (1.0 + math.cos(math.pi * progress))
        
        # scale to min_lr_ratio -> 1.0
        return min_lr_ratio + (1.0 - min_lr_ratio) * cosine_decay
        
    return LambdaLR(optimizer, lr_lambda)
