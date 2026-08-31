import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional, Tuple, Dict, Any

from model.config import ModelConfig
from model.embeddings import TokenEmbedding
from model.positional_encoding import create_positional_encoding
from model.transformer_block import TransformerBlock

class TransformerLM(nn.Module):
    """
    Complete decoder-only Transformer language model.
    """
    def __init__(self, config: ModelConfig):
        super().__init__()
        self.config = config
        
        # Embeddings
        self.token_embedding = TokenEmbedding(config.vocab_size, config.d_model)
        self.positional_encoding = create_positional_encoding(config)
        self.drop = nn.Dropout(config.dropout)
        
        # Transformer blocks
        self.blocks = nn.ModuleList([
            TransformerBlock(config) for _ in range(config.n_layers)
        ])
        
        # Final LayerNorm and LM Head
        self.ln_f = nn.LayerNorm(config.d_model)
        self.lm_head = nn.Linear(config.d_model, config.vocab_size, bias=False)
        
        self.apply(self._init_weights)
        
    def _init_weights(self, module: nn.Module) -> None:
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            
    def forward(self, idx: torch.Tensor, targets: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, Optional[torch.Tensor]]:
        """
        Forward pass for the language model.
        
        Args:
            idx: Input token indices of shape [B, T]
            targets: Optional target token indices of shape [B, T]
            
        Returns:
            Tuple containing:
            - Logits of shape [B, T, vocab_size]
            - Cross-entropy loss (if targets provided, else None)
        """
        B, T = idx.shape
        if T > self.config.context_length:
            raise ValueError(f"Cannot forward sequence of length {T}, block size is {self.config.context_length}")
            
        # [B, T, d_model]
        tok_emb = self.token_embedding(idx)
        pos_emb = self.positional_encoding(tok_emb)
        
        x = self.drop(tok_emb + pos_emb)
        
        for block in self.blocks:
            x = block(x)
            
        x = self.ln_f(x)
        # [B, T, vocab_size]
        logits = self.lm_head(x)
        
        loss = None
        if targets is not None:
            # Flatten to [B*T, vocab_size] and [B*T]
            loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
            
        return logits, loss
        
    def count_parameters(self) -> int:
        """Counts trainable parameters."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)
        
    def get_config_summary(self) -> Dict[str, Any]:
        """Returns model configuration and parameter count summary."""
        return {
            "config": self.config.__dict__,
            "parameters": self.count_parameters()
        }
