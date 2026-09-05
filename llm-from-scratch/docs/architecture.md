# Transformer Architecture

This project implements a decoder-only Transformer from scratch. The architecture closely follows the design of modern autoregressive models like GPT-2/GPT-3, incorporating several best practices for stability and performance.

## Key Components

### 1. Tokenization and Embeddings
- **Tokenizer**: Supports both Character-level and BPE (Byte Pair Encoding) tokenization.
- **Token Embeddings**: Standard lookup table for token IDs, scaled by $\sqrt{d_{model}}$.
- **Positional Embeddings**: Supports both *Learned* embeddings (standard in GPT) and *Sinusoidal* encodings (standard in the original Transformer paper).

### 2. Multi-Head Causal Self-Attention
- **Q, K, V Projections**: Linearly projects the input $x$ into Query, Key, and Value spaces.
- **Scaled Dot-Product**: Computes attention scores $QK^T / \sqrt{d_k}$.
- **Causal Masking**: Uses a lower-triangular matrix to mask out future tokens (setting them to $-\infty$ before softmax), ensuring the model only attends to past tokens when predicting the next token.
- **Multi-Head Splitting**: Splits the $d_{model}$ dimension into $h$ heads, performing attention independently and concatenating the results.

### 3. Feed-Forward Network
- A two-layer MLP applied independently to each sequence position.
- Uses **GELU** (Gaussian Error Linear Unit) activation by default.
- Expands the hidden dimension to $4 \times d_{model}$ before projecting back.

### 4. Pre-LayerNorm (Pre-LN)
- Normalization is applied *before* the Attention and Feed-Forward sub-layers, rather than after (Post-LN).
- Pre-LN is known to be much more stable during training without needing aggressive learning rate warmup schedules.
- `x = x + Attention(LayerNorm(x))`
- `x = x + FeedForward(LayerNorm(x))`

### 5. Final Output Head
- A final `LayerNorm` is applied to the output of the last Transformer block.
- A linear projection maps the $d_{model}$ representations to the $V$ (vocab size) logits for next-token prediction.

## Configurations
The model configuration is strictly typed using a `dataclass` and validated on initialization. We support generating model variants (Tiny, Small, etc.) purely through YAML config files.
