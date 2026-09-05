# Training System

The training system is designed to be fully reproducible, robust, and optimized for PyTorch without relying on external trainer libraries.

## Dataloading
- **Overlapping Windows**: The dataset creates overlapping windows of `context_length` for next-token prediction.
- **Determinism**: Shuffling is seeded with a `torch.Generator()` to ensure that data order is exactly reproducible across runs.

## Optimizer
- **AdamW**: Uses Adam with Weight Decay.
- **Parameter Groups**: As standard in modern LLM training, weight decay is applied *only* to 2D weight matrices (Linear layer weights). 1D parameters (biases, LayerNorm parameters) and embeddings are excluded from weight decay to prevent degradation.

## Learning Rate Scheduler
- **Cosine with Warmup**: Implements the standard LLM training schedule:
  1. Linear warmup from $0$ to `max_lr` over `warmup_steps`.
  2. Cosine annealing decay down to `min_lr` for the remainder of the training.

## Gradient Accumulation & Mixed Precision
- **Gradient Accumulation**: Supports accumulating gradients over multiple micro-batches to simulate larger effective batch sizes when VRAM is limited.
- **Automatic Mixed Precision (AMP)**: Uses `torch.amp` (FP16/BF16) when CUDA is available to speed up training and reduce memory footprint.

## Checkpointing
- **Resilience**: The `CheckpointManager` saves model weights, optimizer state, scheduler state, and Random Number Generator (RNG) states for CPU and CUDA.
- **Resumption**: Training can be perfectly resumed from any step with bitwise exact reproducibility.
- **Security**: Uses `weights_only=True` when evaluating checkpoints, mitigating arbitrary code execution risks from pickled files.
