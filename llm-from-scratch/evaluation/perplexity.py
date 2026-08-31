"""Perplexity computation for language model evaluation.

Perplexity is defined as:
    PPL = exp(average cross-entropy loss)
    
where the average cross-entropy loss is computed over all tokens
in the evaluation set.

Lower perplexity indicates better model performance.
A perplexity of V (vocabulary size) corresponds to random prediction.
"""
import math
import torch
from torch.utils.data import DataLoader

@torch.no_grad()
def compute_perplexity(
    model: torch.nn.Module,
    dataloader: DataLoader,
    device: torch.device,
    max_steps: int | None = None,
) -> dict[str, float]:
    """Compute perplexity on a dataset.
    
    Returns:
        dict with keys: 'loss', 'perplexity', 'num_tokens'
    """
    model.eval()
    total_loss = 0.0
    total_tokens = 0
    steps = 0
    
    loss_fn = torch.nn.CrossEntropyLoss(reduction="sum")
    
    for inputs, targets in dataloader:
        inputs = inputs.to(device)
        targets = targets.to(device)
        
        # Output shape: [B, T, C]
        logits = model(inputs)
        
        # Flatten for loss
        # logits: [B * T, C], targets: [B * T]
        B, T, C = logits.shape
        loss = loss_fn(logits.view(B * T, C), targets.view(-1))
        
        total_loss += loss.item()
        total_tokens += B * T
        steps += 1
        
        if max_steps is not None and steps >= max_steps:
            break
            
    avg_loss = total_loss / max(total_tokens, 1)
    
    if avg_loss > 100:
        ppl = float('inf')
    else:
        ppl = math.exp(avg_loss)
        
    return {
        "loss": avg_loss,
        "perplexity": ppl,
        "num_tokens": total_tokens
    }
