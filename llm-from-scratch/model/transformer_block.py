import torch
import torch.nn as nn
from model.config import ModelConfig
from model.attention import MultiHeadCausalSelfAttention
from model.feed_forward import FeedForward

class TransformerBlock(nn.Module):
    """
    A single Pre-LN Transformer block.
    """
    def __init__(self, config: ModelConfig):
        super().__init__()
        
        self.ln1 = nn.LayerNorm(config.d_model)
        self.attention = MultiHeadCausalSelfAttention(
            d_model=config.d_model,
            n_heads=config.n_heads,
            dropout=config.dropout,
            bias=config.bias,
            max_seq_len=config.context_length
        )
        
        self.ln2 = nn.LayerNorm(config.d_model)
        self.ff = FeedForward(
            d_model=config.d_model,
            d_ff=config.d_ff,
            dropout=config.dropout,
            bias=config.bias,
            activation=config.activation
        )
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for a Pre-LN Transformer block.
        
        Args:
            x: Input tensor of shape [B, T, d_model]
            
        Returns:
            Output tensor of shape [B, T, d_model]
        """
        # Pre-LN attention with residual
        # [B, T, d_model]
        x = x + self.attention(self.ln1(x))
        
        # Pre-LN feed-forward with residual
        # [B, T, d_model]
        x = x + self.ff(self.ln2(x))
        
        return x
