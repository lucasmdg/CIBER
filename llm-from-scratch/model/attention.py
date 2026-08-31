import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadCausalSelfAttention(nn.Module):
    """
    Multi-head causal self-attention mechanism.
    """
    def __init__(self, d_model: int, n_heads: int, dropout: float, bias: bool, max_seq_len: int):
        super().__init__()
        if d_model % n_heads != 0:
            raise ValueError(f"d_model ({d_model}) must be divisible by n_heads ({n_heads})")
            
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        # Projections
        self.W_q = nn.Linear(d_model, d_model, bias=bias)
        self.W_k = nn.Linear(d_model, d_model, bias=bias)
        self.W_v = nn.Linear(d_model, d_model, bias=bias)
        self.W_o = nn.Linear(d_model, d_model, bias=bias)
        
        # Dropout
        self.attn_dropout = nn.Dropout(dropout)
        self.resid_dropout = nn.Dropout(dropout)
        
        # Causal mask (lower triangular)
        mask = torch.tril(torch.ones(max_seq_len, max_seq_len))
        self.register_buffer("causal_mask", mask.view(1, 1, max_seq_len, max_seq_len))
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for multi-head causal self-attention.
        
        Args:
            x: Input tensor of shape [B, T, d_model]
            
        Returns:
            Output tensor of shape [B, T, d_model]
        """
        B, T, C = x.shape
        
        # [B, T, d_model]
        q = self.W_q(x)
        k = self.W_k(x)
        v = self.W_v(x)
        
        # [B, T, n_heads, d_head] -> [B, n_heads, T, d_head]
        q = q.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        k = k.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        v = v.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        
        # Scaled dot-product attention
        # [B, n_heads, T, T]
        att = (q @ k.transpose(-2, -1)) * (self.d_head ** -0.5)
        
        # Apply causal mask (future tokens -> -inf)
        att = att.masked_fill(self.causal_mask[:, :, :T, :T] == 0, float('-inf'))
        
        # Softmax + dropout
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        
        # Weighted sum of values
        # [B, n_heads, T, T] @ [B, n_heads, T, d_head] -> [B, n_heads, T, d_head]
        out = att @ v
        
        # Concatenate heads: [B, n_heads, T, d_head] -> [B, T, d_model]
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        
        # Output projection
        out = self.W_o(out)  # [B, T, d_model]
        out = self.resid_dropout(out)
        
        return out
