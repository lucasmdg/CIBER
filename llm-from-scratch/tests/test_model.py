import pytest
import torch
from model.config import ModelConfig
from model.embeddings import TokenEmbedding
from model.positional_encoding import LearnedPositionalEmbedding, SinusoidalPositionalEncoding
from model.feed_forward import FeedForward
from model.transformer_block import TransformerBlock
from model.transformer import TransformerLM

def test_model_config_validation():
    with pytest.raises(ValueError):
        ModelConfig(d_model=16, n_heads=3) # 16 % 3 != 0

def test_token_embedding():
    emb = TokenEmbedding(100, 16)
    x = torch.randint(0, 100, (2, 10))
    out = emb(x)
    assert out.shape == (2, 10, 16)

def test_positional_embeddings():
    config = ModelConfig(context_length=10, d_model=16)
    
    # Learned
    pos_emb = LearnedPositionalEmbedding(10, 16)
    dummy_x = torch.zeros(2, 10, 16)
    out = pos_emb(dummy_x)
    assert out.shape == (1, 10, 16)
    
    with pytest.raises(ValueError):
        pos_emb(torch.zeros(2, 11, 16))
        
    # Sinusoidal
    sin_emb = SinusoidalPositionalEncoding(10, 16)
    out_sin = sin_emb(dummy_x)
    # Just asserting it doesn't fail and has correct last dim
    assert out_sin.shape[-1] == 16

def test_feed_forward():
    config = ModelConfig(d_model=16, d_ff=64)
    ff = FeedForward(config)
    x = torch.randn(2, 10, 16)
    out = ff(x)
    assert out.shape == (2, 10, 16)

def test_transformer_block():
    config = ModelConfig(d_model=16, n_heads=4, d_ff=64)
    block = TransformerBlock(config)
    x = torch.randn(2, 10, 16)
    out = block(x)
    assert out.shape == (2, 10, 16)

def test_transformer_lm():
    config = ModelConfig(vocab_size=100, d_model=16, n_heads=4, n_layers=2, d_ff=64, context_length=10)
    model = TransformerLM(config)
    
    # Check parameters
    assert sum(p.numel() for p in model.parameters()) > 0
    
    x = torch.randint(0, 100, (2, 10))
    logits, loss = model(x)
    assert logits.shape == (2, 10, 100)
    assert loss is None
    
    # With targets
    targets = torch.randint(0, 100, (2, 10))
    logits, loss = model(x, targets)
    assert loss is not None
    assert loss.dim() == 0
