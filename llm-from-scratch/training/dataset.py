"""Dataset implementation for autoregressive language modeling.

Provides TextDataset that creates input-target pairs for next-token prediction.
For a tokenized sequence [t0, t1, t2, ..., tn], creates pairs:
  input:  [t0, t1, ..., t_{n-1}]
  target: [t1, t2, ..., t_n]
"""
import torch
from torch.utils.data import Dataset
from pathlib import Path

class TextDataset(Dataset):
    """Dataset for autoregressive language modeling.
    
    Stores a flat tensor of token IDs and creates overlapping windows
    of (input, target) pairs for next-token prediction.
    
    Args:
        data: 1D tensor of token IDs [N]
        seq_len: Length of each input sequence
    
    Shapes:
        __getitem__ returns:
            x: [seq_len] input token IDs
            y: [seq_len] target token IDs (shifted by 1)
    """
    
    def __init__(self, data: torch.Tensor, seq_len: int) -> None:
        if not isinstance(data, torch.Tensor):
            raise TypeError("data must be a torch.Tensor")
        if data.ndim != 1:
            raise ValueError(f"data must be a 1D tensor, got {data.ndim}D")
        if seq_len <= 0:
            raise ValueError(f"seq_len must be positive, got {seq_len}")
        if seq_len >= len(data):
            raise ValueError(f"seq_len ({seq_len}) must be less than data length ({len(data)})")
            
        self.data = data
        self.seq_len = seq_len
        
    def __len__(self) -> int:
        return len(self.data) - self.seq_len
        
    def __getitem__(self, idx: int) -> tuple[torch.Tensor, torch.Tensor]:
        x = self.data[idx : idx + self.seq_len]
        y = self.data[idx + 1 : idx + self.seq_len + 1]
        return x, y
        
    @classmethod
    def from_file(cls, path: str | Path, seq_len: int) -> "TextDataset":
        """Load dataset from a file containing token IDs.
        
        Assumes the file contains a saved PyTorch 1D tensor.
        """
        data = torch.load(path, weights_only=True)
        return cls(data, seq_len)
