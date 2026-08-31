"""Optimizer configuration for Transformer training.

Uses AdamW with separate parameter groups:
- Weight decay applied to weight matrices
- No weight decay for biases, LayerNorm, and embeddings
"""
import torch
from torch.optim import AdamW
import logging

logger = logging.getLogger(__name__)

def create_optimizer(
    model: torch.nn.Module,
    learning_rate: float = 3e-4,
    weight_decay: float = 0.1,
    betas: tuple[float, float] = (0.9, 0.95),
) -> AdamW:
    """Create AdamW optimizer with proper parameter groups.
    
    Separates parameters into two groups:
    1. Parameters with weight decay (linear layer weights)
    2. Parameters without weight decay (biases, norms, embeddings)
    
    This follows the standard practice from GPT-2/GPT-3 training.
    """
    decay_params = []
    no_decay_params = []
    
    for name, param in model.named_parameters():
        if not param.requires_grad:
            continue
            
        # Biases, LayerNorm parameters, and 1D parameters get no weight decay
        # Embeddings usually also get no weight decay
        if param.ndim < 2 or 'bias' in name or 'norm' in name or 'embedding' in name or 'emb' in name:
            no_decay_params.append(param)
        else:
            decay_params.append(param)
            
    num_decay_params = sum(p.numel() for p in decay_params)
    num_no_decay_params = sum(p.numel() for p in no_decay_params)
    
    logger.info(f"Number of parameters with weight decay: {num_decay_params:,}")
    logger.info(f"Number of parameters without weight decay: {num_no_decay_params:,}")
    
    optim_groups = [
        {"params": decay_params, "weight_decay": weight_decay},
        {"params": no_decay_params, "weight_decay": 0.0},
    ]
    
    optimizer = AdamW(optim_groups, lr=learning_rate, betas=betas)
    return optimizer
