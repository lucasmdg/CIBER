import torch
import torch.nn as nn
import math

class TokenEmbedding(nn.Module):
    """
    Token embedding layer that scales embeddings by sqrt(d_model).
    """
    def __init__(self, vocab_size: int, d_model: int):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.d_model = d_model
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for token embeddings.
        
        Args:
            x: Input tensor of shape [B, T] with token indices.
            
        Returns:
            Tensor of shape [B, T, d_model] with scaled embeddings.
        """
        if x.dim() != 2:
            raise ValueError(f"Expected input to have 2 dimensions [B, T], got {x.dim()}")
        
        # [B, T] -> [B, T, d_model]
        return self.embedding(x) * math.sqrt(self.d_model)
