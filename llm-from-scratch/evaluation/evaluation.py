"""Complete evaluation pipeline for the language model."""
import json
import time
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from typing import Dict, Any, Optional

from evaluation.perplexity import compute_perplexity

class Evaluator:
    """Evaluates a language model on train/val/test splits."""
    
    def __init__(
        self, 
        model: torch.nn.Module, 
        tokenizer: Any, 
        device: torch.device, 
        config: Dict[str, Any]
    ) -> None:
        """Initializes the evaluator.
        
        Args:
            model: The language model
            tokenizer: Tokenizer instance
            device: Device to run evaluation on
            config: Additional configuration
        """
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        self.config = config
        
    def evaluate_split(
        self, 
        dataloader: DataLoader, 
        split_name: str, 
        max_steps: Optional[int] = None
    ) -> Dict[str, Any]:
        """Evaluates model on a specific data split."""
        start_time = time.time()
        results = compute_perplexity(self.model, dataloader, self.device, max_steps)
        eval_time = time.time() - start_time
        results["eval_time"] = eval_time
        return results

    def evaluate_all(
        self, 
        train_loader: DataLoader, 
        val_loader: DataLoader, 
        test_loader: DataLoader
    ) -> Dict[str, Dict[str, Any]]:
        """Evaluates all splits and aggregates results."""
        return {
            "train": self.evaluate_split(train_loader, "train"),
            "val": self.evaluate_split(val_loader, "val"),
            "test": self.evaluate_split(test_loader, "test")
        }

    def save_results(self, results: Dict[str, Any], path: str | Path) -> None:
        """Saves evaluation results to JSON."""
        out_path = Path(path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        
        param_count = sum(p.numel() for p in self.model.parameters())
        
        out_data = {
            "timestamp": time.time(),
            "hardware": str(self.device),
            "parameter_count": param_count,
            "results": results,
            "model_config": getattr(self.model, "config", None).__dict__ if hasattr(getattr(self.model, "config", None), "__dict__") else {}
        }
        
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(out_data, f, indent=4)
            
    def print_results(self, results: Dict[str, Any]) -> None:
        """Prints a formatted table of results."""
        print("-" * 60)
        print(f"{'Split':<10} | {'Loss':<10} | {'Perplexity':<10} | {'Tokens':<10}")
        print("-" * 60)
        for split, res in results.items():
            if isinstance(res, dict) and "loss" in res:
                print(f"{split:<10} | {res['loss']:<10.4f} | {res['perplexity']:<10.4f} | {res['num_tokens']:<10}")
        print("-" * 60)
