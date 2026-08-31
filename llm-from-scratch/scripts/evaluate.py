"""Evaluation script for the trained language model.

Usage:
    python scripts/evaluate.py --checkpoint checkpoints/checkpoint_best.pt
    python scripts/evaluate.py --checkpoint checkpoints/checkpoint_best.pt --split test
    python scripts/evaluate.py --checkpoint checkpoints/checkpoint_best.pt --output results/eval.json
"""
import argparse
import sys
import yaml
from pathlib import Path
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))

from model.config import ModelConfig
from model.transformer import TransformerLM
from training.dataset import TextDataset
from training.dataloader import create_dataloader
from training.checkpointing import CheckpointManager
from tokenizer import CharTokenizer
from evaluation.evaluation import Evaluator

def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Transformer LM")
    parser.add_argument("--checkpoint", type=str, required=True, help="Path to checkpoint")
    parser.add_argument("--split", type=str, default="test", choices=["train", "val", "test", "all"], help="Split to evaluate")
    parser.add_argument("--output", type=str, help="Path to save results as JSON")
    parser.add_argument("--data-dir", type=str, default="data", help="Data directory")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size for evaluation")
    
    args = parser.parse_args()
    
    checkpoint_path = Path(args.checkpoint)
    if not checkpoint_path.exists():
        print(f"Checkpoint not found at {checkpoint_path}")
        sys.exit(1)
        
    checkpoint_state = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
    # We assume model config is stored in checkpoint or there's a default
    # For robust code, it's better if model config is saved in the checkpoint.
    
    processed_dir = Path(args.data_dir) / "processed"
    tokenizer = CharTokenizer.load(processed_dir / "tokenizer.json")
    
    # Ideally load model config from checkpoint, but fallback if not present
    model_config = checkpoint_state.get('model_config')
    if isinstance(model_config, dict):
        model_config = ModelConfig(**model_config)
    elif not model_config:
        model_config = ModelConfig(vocab_size=tokenizer.vocab_size) # dummy
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = TransformerLM(model_config).to(device)
    model.load_state_dict(checkpoint_state['model_state_dict'])
    model.eval()
    
    evaluator = Evaluator(model, tokenizer, device, config={})
    
    def get_loader(split_name: str):
        data = torch.load(processed_dir / f"{split_name}.pt", weights_only=True)
        dataset = TextDataset(data, model_config.context_length)
        return create_dataloader(dataset, args.batch_size, shuffle=False)
        
    if args.split == "all":
        train_loader = get_loader("train")
        val_loader = get_loader("val")
        test_loader = get_loader("test")
        results = evaluator.evaluate_all(train_loader, val_loader, test_loader)
    else:
        loader = get_loader(args.split)
        results = {args.split: evaluator.evaluate_split(loader, args.split)}
        
    evaluator.print_results(results)
    
    if args.output:
        evaluator.save_results(results, args.output)

if __name__ == "__main__":
    main()
