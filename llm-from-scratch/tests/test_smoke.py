import torch
import os
import sys
from pathlib import Path
import pytest

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from model.config import ModelConfig
from model.transformer import TransformerLM
from tokenizer.tokenizer import CharTokenizer

def test_smoke_tokenizer():
    tokenizer = CharTokenizer()
    text = "hello world"
    tokenizer.train(text)
    encoded = tokenizer.encode(text)
    decoded = tokenizer.decode(encoded)
    assert text == decoded

def test_smoke_model_forward():
    config = ModelConfig(
        vocab_size=100,
        context_length=32,
        d_model=32,
        n_layers=2,
        n_heads=2,
        d_ff=64
    )
    model = TransformerLM(config)
    x = torch.randint(0, 100, (2, 16))
    logits, loss = model(x)
    assert logits.shape == (2, 16, 100)
    assert loss is None
    
    # Test with targets
    y = torch.randint(0, 100, (2, 16))
    logits, loss = model(x, y)
    assert loss is not None
    assert loss.item() > 0

if __name__ == "__main__":
    pytest.main([__file__])
