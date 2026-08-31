"""Data preparation script for the LLM from scratch project.

Usage:
    python scripts/prepare_data.py [--dataset tinyshakespeare] [--tokenizer char] [--data-dir data]
    python scripts/prepare_data.py --smoke-test

This script:
1. Downloads the TinyShakespeare dataset (with user confirmation)
2. Builds the tokenizer vocabulary
3. Tokenizes the corpus
4. Splits into train/val/test sets
5. Saves processed data as PyTorch tensors
"""
import argparse
import sys
from pathlib import Path
import urllib.request
import torch

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from tokenizer import CharTokenizer

TINYSHAKESPEARE_URL = "https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt"

def download_tinyshakespeare(data_dir: Path) -> Path:
    """Downloads TinyShakespeare dataset with confirmation prompt."""
    raw_dir = data_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    out_path = raw_dir / "input.txt"
    
    if out_path.exists():
        print(f"File already exists at {out_path}")
        return out_path
        
    print(f"Downloading TinyShakespeare to {out_path}...")
    ans = input("Proceed? [Y/n]: ")
    if ans.lower() not in ['', 'y', 'yes']:
        print("Aborted.")
        sys.exit(0)
        
    urllib.request.urlretrieve(TINYSHAKESPEARE_URL, out_path)
    print("Download complete.")
    return out_path

def prepare_data(
    text: str,
    tokenizer_type: str,
    data_dir: Path,
    train_split: float = 0.9,
    val_split: float = 0.05,
    test_split: float = 0.05
) -> None:
    """Builds vocabulary, tokenizes, splits and saves data."""
    processed_dir = data_dir / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    if tokenizer_type == "char":
        tokenizer = CharTokenizer()
    else:
        raise ValueError(f"Unknown tokenizer type: {tokenizer_type}")
        
    tokenizer.train(text)
    tokenizer.save(processed_dir / "tokenizer.json")
    
    print("Tokenizing corpus...")
    tokens = tokenizer.encode(text)
    tensor_data = torch.tensor(tokens, dtype=torch.long)
    
    total_len = len(tensor_data)
    n_train = int(total_len * train_split)
    n_val = int(total_len * val_split)
    
    train_data = tensor_data[:n_train]
    val_data = tensor_data[n_train:n_train+n_val]
    test_data = tensor_data[n_train+n_val:]
    
    print("Saving splits...")
    torch.save(train_data, processed_dir / "train.pt")
    torch.save(val_data, processed_dir / "val.pt")
    torch.save(test_data, processed_dir / "test.pt")
    
    print("--- Stats ---")
    print(f"Corpus size: {len(text)} chars")
    print(f"Vocab size: {tokenizer.vocab_size}")
    print(f"Train size: {len(train_data)} tokens")
    print(f"Val size: {len(val_data)} tokens")
    print(f"Test size: {len(test_data)} tokens")

def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare data for LLM training")
    parser.add_argument("--dataset", type=str, default="tinyshakespeare", help="Dataset name")
    parser.add_argument("--tokenizer", type=str, default="char", help="Tokenizer type")
    parser.add_argument("--data-dir", type=str, default="data", help="Data directory path")
    parser.add_argument("--smoke-test", action="store_true", help="Use a small local smoke test file")
    
    args = parser.parse_args()
    
    data_dir = Path(args.data_dir)
    
    if args.smoke_test:
        raw_path = data_dir / "raw" / "smoke_test.txt"
        if not raw_path.exists():
            raw_path.parent.mkdir(parents=True, exist_ok=True)
            with open(raw_path, 'w', encoding='utf-8') as f:
                f.write("This is a small smoke test dataset. " * 100)
    else:
        if args.dataset == "tinyshakespeare":
            raw_path = download_tinyshakespeare(data_dir)
        else:
            raise ValueError(f"Unknown dataset: {args.dataset}")
            
    with open(raw_path, 'r', encoding='utf-8') as f:
        text = f.read()
        
    prepare_data(text, args.tokenizer, data_dir)

if __name__ == "__main__":
    main()
