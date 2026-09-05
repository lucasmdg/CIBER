# Build a Language Model From Scratch

This project is an educational, research-grade implementation of a small decoder-only autoregressive Transformer language model built entirely from first principles using PyTorch.

## Features

- **Pure PyTorch Implementation**: No external dependencies (like HuggingFace `transformers`) are used. Everything is built from scratch.
- **Tokenizer**: Custom Character-level tokenizer and BPE Tokenizer infrastructure.
- **Architecture**: Pre-LN Decoder-only Transformer with causal multi-head self attention.
- **Training System**: Fully-featured trainer with gradient accumulation, mixed precision training, AdamW with proper weight decay groups, cosine learning rate scheduling with warmup, and robust checkpointing.
- **Inference**: Generation module with greedy, temperature, top-k, and nucleus (top-p) sampling.
- **CLI & Web Demo**: Includes command line tools for data preparation, training, evaluation, and interactive generation, plus a Flask web demo.

## Setup

```bash
# Clone the repository and install requirements (PyTorch, Flask, PyYAML)
pip install torch torchvision torchaudio flask pyyaml
```

## Usage

1. **Prepare Data**
```bash
python scripts/prepare_data.py --dataset tinyshakespeare
```

2. **Train the Model**
```bash
python scripts/train.py --config configs/tiny.yaml
```

3. **Evaluate**
```bash
python scripts/evaluate.py --checkpoint checkpoints/checkpoint_best.pt
```

4. **Generate Text**
```bash
python scripts/generate.py --checkpoint checkpoints/checkpoint_best.pt --interactive
```

5. **Web Demo**
```bash
python inference/web_demo.py --checkpoint checkpoints/checkpoint_best.pt
```

## Directory Structure

- `configs/`: Model and training configuration files
- `data/`: Raw and processed dataset files
- `model/`: The Transformer architecture (embeddings, attention, blocks, LM head)
- `tokenizer/`: Tokenizer implementations
- `training/`: Dataset loading, dataloaders, optimizer, scheduler, and trainer loop
- `inference/`: Generation scripts and Flask web demo
- `evaluation/`: Perplexity calculation and model evaluation
- `scripts/`: CLI entrypoints
- `tests/`: Smoke tests

## License

MIT
