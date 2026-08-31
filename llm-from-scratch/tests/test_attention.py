import pytest
import torch
from model.config import ModelConfig
from model.attention import MultiHeadCausalSelfAttention

def test_multi_head_attention_shapes():
    config = ModelConfig(d_model=16, n_heads=4)
    mha = MultiHeadCausalSelfAttention(config)
    x = torch.randn(2, 10, 16) # B, T, C
    out = mha(x)
    assert out.shape == (2, 10, 16)

def test_causal_masking_prevents_information_leak():
    config = ModelConfig(d_model=16, n_heads=2)
    mha = MultiHeadCausalSelfAttention(config)
    
    x = torch.randn(1, 4, 16, requires_grad=True)
    out = mha(x)
    
    loss = out[0, 0, :].sum()
    loss.backward()
    
    assert torch.all(x.grad[0, 1:, :] == 0.0)
    assert torch.any(x.grad[0, 0, :] != 0.0)

def test_attention_shape_mismatch():
    config = ModelConfig(d_model=16, n_heads=4)
    mha = MultiHeadCausalSelfAttention(config)
    x = torch.randn(2, 10, 32)
    with pytest.raises(Exception): # RuntimeError or ValueError
        mha(x)

def test_attention_numerical_stability():
    config = ModelConfig(d_model=16, n_heads=2)
    mha = MultiHeadCausalSelfAttention(config)
    
    x = torch.randn(2, 5, 16) * 1000.0
    out = mha(x)
    assert not torch.isnan(out).any()
