from dataclasses import dataclass, field, asdict
import yaml
from pathlib import Path

@dataclass
class ModelConfig:
    """Model configuration dataclass."""
    vocab_size: int = 256
    context_length: int = 256
    d_model: int = 128
    n_layers: int = 4
    n_heads: int = 4
    d_ff: int = 512
    dropout: float = 0.1
    bias: bool = True
    positional_encoding: str = "learned"  # "learned" or "sinusoidal"
    activation: str = "gelu"
    
    def __post_init__(self):
        self.validate()
    
    @classmethod
    def from_yaml(cls, path: str | Path) -> "ModelConfig":
        with open(path, "r") as f:
            data = yaml.safe_load(f)
        return cls(**data)
    
    def validate(self) -> None:
        if self.d_model % self.n_heads != 0:
            raise ValueError(f"d_model ({self.d_model}) must be divisible by n_heads ({self.n_heads})")
        if self.vocab_size <= 0:
            raise ValueError("vocab_size must be positive")
        if self.context_length <= 0:
            raise ValueError("context_length must be positive")
        if self.d_model <= 0:
            raise ValueError("d_model must be positive")
        if self.n_layers <= 0:
            raise ValueError("n_layers must be positive")
        if self.n_heads <= 0:
            raise ValueError("n_heads must be positive")
        if self.d_ff <= 0:
            raise ValueError("d_ff must be positive")
        if self.dropout < 0.0 or self.dropout >= 1.0:
            raise ValueError("dropout must be in [0, 1)")
        if self.positional_encoding not in {"learned", "sinusoidal"}:
            raise ValueError("positional_encoding must be 'learned' or 'sinusoidal'")
        if self.activation not in {"gelu", "relu"}:
            raise ValueError("activation must be 'gelu' or 'relu'")
    
    @property
    def d_head(self) -> int:
        return self.d_model // self.n_heads
    
    def estimate_parameters(self) -> int:
        # Basic parameter estimation
        params = self.vocab_size * self.d_model # embeddings
        if self.positional_encoding == "learned":
            params += self.context_length * self.d_model
        
        # Transformer blocks
        attention_params = 4 * (self.d_model * self.d_model)
        if self.bias:
            attention_params += 4 * self.d_model
        
        ff_params = 2 * (self.d_model * self.d_ff)
        if self.bias:
            ff_params += self.d_ff + self.d_model
            
        ln_params = 2 * self.d_model
        
        layer_params = attention_params + ff_params + 2 * ln_params
        params += self.n_layers * layer_params
        
        params += ln_params # final ln
        
        # Output head
        params += self.vocab_size * self.d_model
        
        return params
