"""Inference utilities for loading checkpoints and generating text.

This module provides helper functions for inference, wrapping the model loading
and generation capabilities so they can be reused across CLIs, tests, and web demos.
"""

import os
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union

import torch
from model.config import ModelConfig
from model.transformer import TransformerLM
from model.generation import TextGenerator
from tokenizer.tokenizer import CharTokenizer


def load_model_from_checkpoint(
    checkpoint_path: Union[str, Path],
    data_dir: Union[str, Path] = "data",
    device: Optional[Union[str, torch.device]] = None
) -> Tuple[TransformerLM, CharTokenizer, torch.device]:
    """Loads a trained Transformer language model and its tokenizer from a checkpoint.

    Args:
        checkpoint_path: Path to the .pt checkpoint file.
        data_dir: Data directory containing the processed tokenizer.json.
        device: The device to map the model to. Auto-detected if None.

    Returns:
        A tuple of (model, tokenizer, device).
    """
    checkpoint_path = Path(checkpoint_path)
    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint not found at {checkpoint_path}")

    # Determine device
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(device)

    # Load checkpoint state
    checkpoint_state = torch.load(checkpoint_path, map_location=device, weights_only=False)

    # Load tokenizer
    processed_dir = Path(data_dir) / "processed"
    tokenizer_path = processed_dir / "tokenizer.json"
    if not tokenizer_path.exists():
        raise FileNotFoundError(f"Tokenizer not found at {tokenizer_path}. Run prepare_data.py first.")
    tokenizer = CharTokenizer.load(tokenizer_path)

    # Load config and recreate model
    model_config_dict = checkpoint_state.get("model_config")
    if isinstance(model_config_dict, dict):
        model_config = ModelConfig(**model_config_dict)
    else:
        model_config = ModelConfig(vocab_size=tokenizer.vocab_size)

    model = TransformerLM(model_config).to(device)
    model.load_state_dict(checkpoint_state["model_state_dict"])
    model.eval()

    return model, tokenizer, device


def generate(
    checkpoint_path: Union[str, Path],
    prompt: str,
    max_new_tokens: int = 100,
    temperature: float = 1.0,
    top_k: Optional[int] = None,
    top_p: Optional[float] = None,
    seed: Optional[int] = None,
    data_dir: Union[str, Path] = "data",
    device: Optional[Union[str, torch.device]] = None
) -> str:
    """Convenience function to generate text from a checkpoint.

    Loads the model and generates completion for the given prompt.
    """
    model, tokenizer, device = load_model_from_checkpoint(checkpoint_path, data_dir, device)
    generator = TextGenerator(model, tokenizer, device)
    
    # Clean up top_k / top_p if they are disabling values
    if top_k is not None and top_k <= 0:
        top_k = None
    if top_p is not None and (top_p <= 0.0 or top_p >= 1.0):
        top_p = None

    return generator.generate(
        prompt=prompt,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        top_k=top_k,
        top_p=top_p,
        seed=seed
    )
