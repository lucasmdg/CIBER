# Dataset Documentation

## TinyShakespeare

- **Source**: [Karpathy's char-rnn](https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt)
- **License**: Public domain (Shakespeare's works)
- **Size**: ~1.1 MB (~1,115,394 characters)
- **Content**: Complete works of Shakespeare concatenated
- **Characters**: ~65 unique characters
- **Download**: Run `python scripts/prepare_data.py`

## Smoke Test Dataset

A small inline dataset (`data/raw/smoke_test.txt`) is provided for testing the complete pipeline without downloading anything.

## Directory Structure

- `raw/` — Original unprocessed text files
- `processed/` — Tokenized and split data ready for training

## Preprocessing

1. Download raw text
2. Build character vocabulary
3. Tokenize entire corpus
4. Split into train (90%), validation (5%), test (5%)
5. Save as PyTorch tensors

## Data Integrity

Splits are deterministic based on character position. No shuffling at the corpus level ensures no data leakage between splits.
