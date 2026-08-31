import torch
import torch.nn as nn
import math
from model.config import ModelConfig

class LearnedPositionalEmbedding(nn.Module):
    """
    Learned positional embeddings.
    """
    def __init__(self, max_seq_len: int, d_model: int):
        super().__init__()
        self.embedding = nn.Embedding(max_seq_len, d_model)
        self.max_seq_len = max_seq_len
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for learned positional embeddings.
        
        Args:
            x: Input tensor of shape [B, T, d_model]. Only T is used.
            
        Returns:
            Tensor of shape [1, T, d_model] containing positional embeddings.
        """
        T = x.size(1)
        if T > self.max_seq_len:
            raise ValueError(f"Sequence length {T} exceeds maximum {self.max_seq_len}")
        
        # [T]
        positions = torch.arange(T, device=x.device)
        # [1, T, d_model]
        return self.embedding(positions).unsqueeze(0)

class SinusoidalPositionalEncoding(nn.Module):
    """
    Fixed sinusoidal positional encoding.
    """
    def __init__(self, max_seq_len: int, d_model: int):
        super().__init__()
        # Precompute positional encodings
        pe = torch.zeros(max_seq_len, d_model)
        position = torch.arange(0, max_seq_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        # [1, max_seq_len, d_model]
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for sinusoidal positional encoding.
        
        Args:
            x: Input tensor of shape [B, T, d_model]. Only T is used.
            
        Returns:
            Tensor of shape [1, T, d_model] containing positional encodings.
        """
        T = x.size(1)
        return self.pe[:, :T, :]

def create_positional_encoding(config: ModelConfig) -> nn.Module:
    """
    Factory function for positional encoding.
    """
    if config.positional_encoding == "learned":
        return LearnedPositionalEmbedding(config.context_length, config.d_model)
    elif config.positional_encoding == "sinusoidal":
        return SinusoidalPositionalEncoding(config.context_length, config.d_model)
    else:
        raise ValueError(f"Unknown positional encoding type: {config.positional_encoding}")
