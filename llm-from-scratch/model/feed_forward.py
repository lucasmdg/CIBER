import torch
import torch.nn as nn
import torch.nn.functional as F

class FeedForward(nn.Module):
    """
    Position-wise feed-forward network. Applied independently to each position.
    """
    def __init__(self, d_model: int, d_ff: int, dropout: float, bias: bool, activation: str = "gelu"):
        super().__init__()
        self.fc1 = nn.Linear(d_model, d_ff, bias=bias)
        
        if activation == "gelu":
            self.activation = nn.GELU()
        elif activation == "relu":
            self.activation = nn.ReLU()
        else:
            raise ValueError(f"Unsupported activation: {activation}")
            
        self.dropout1 = nn.Dropout(dropout)
        self.fc2 = nn.Linear(d_ff, d_model, bias=bias)
        self.dropout2 = nn.Dropout(dropout)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass.
        
        Args:
            x: Input tensor of shape [B, T, d_model]
            
        Returns:
            Output tensor of shape [B, T, d_model]
        """
        # [B, T, d_model] -> [B, T, d_ff]
        x = self.fc1(x)
        x = self.activation(x)
        x = self.dropout1(x)
        
        # [B, T, d_ff] -> [B, T, d_model]
        x = self.fc2(x)
        x = self.dropout2(x)
        
        return x
