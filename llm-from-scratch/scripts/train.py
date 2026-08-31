"""Training script for the Transformer language model.

Usage:
    python scripts/train.py --config configs/tiny.yaml
    python scripts/train.py --config configs/tiny.yaml --resume checkpoints/checkpoint_best.pt
    python scripts/train.py --config configs/tiny.yaml --eval-only --checkpoint checkpoints/checkpoint_best.pt
"""
import argparse
import sys
import yaml
import random
import numpy as np
from pathlib import Path
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))

from model.config import ModelConfig
from model.transformer import TransformerLM
from training.dataset import TextDataset
from training.dataloader import create_dataloader
from training.optimizer import create_optimizer
from training.scheduler import create_scheduler
from training.checkpointing import CheckpointManager
from training.trainer import Trainer
from tokenizer import CharTokenizer
from evaluation.evaluation import Evaluator

def set_seed(seed: int) -> None:
    """Sets seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def main() -> None:
    parser = argparse.ArgumentParser(description="Train Transformer LM")
    parser.add_argument("--config", type=str, required=True, help="Path to config YAML")
    parser.add_argument("--resume", type=str, help="Path to checkpoint to resume from")
    parser.add_argument("--checkpoint", type=str, help="Path to checkpoint for eval-only")
    parser.add_argument("--eval-only", action="store_true", help="Run evaluation only")
    
    args = parser.parse_args()
    
    with open(args.config, 'r') as f:
        config_dict = yaml.safe_load(f)
        
    seed = config_dict.get("training", {}).get("seed", 42)
    set_seed(seed)
    
    data_dir = Path(config_dict.get("data", {}).get("data_dir", "data"))
    processed_dir = data_dir / "processed"
    
    try:
        tokenizer = CharTokenizer.load(processed_dir / "tokenizer.json")
    except Exception as e:
        print(f"Failed to load tokenizer: {e}")
        sys.exit(1)
        
    model_config = ModelConfig(**config_dict.get("model", {}))
    model_config.vocab_size = tokenizer.vocab_size
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = TransformerLM(model_config).to(device)
    
    try:
        train_data = torch.load(processed_dir / "train.pt", weights_only=True)
        val_data = torch.load(processed_dir / "val.pt", weights_only=True)
    except Exception as e:
        print(f"Failed to load data: {e}")
        sys.exit(1)
        
    train_dataset = TextDataset(train_data, model_config.context_length)
    val_dataset = TextDataset(val_data, model_config.context_length)
    
    batch_size = config_dict.get("training", {}).get("batch_size", 32)
    train_loader = create_dataloader(train_dataset, batch_size, shuffle=True)
    val_loader = create_dataloader(val_dataset, batch_size, shuffle=False)
    
    optimizer_config = config_dict.get("optimizer", {})
    # Default to simple empty dict if None
    if not optimizer_config:
        optimizer_config = {}
    optimizer = create_optimizer(model, **optimizer_config)
    
    scheduler_config = config_dict.get("scheduler", {})
    if not scheduler_config:
        scheduler_config = {}
    scheduler = create_scheduler(optimizer, **scheduler_config)
    
    checkpoint_dir = Path("checkpoints")
    checkpoint_manager = CheckpointManager(checkpoint_dir)
    
    if args.eval_only:
        checkpoint_path = args.checkpoint or args.resume
        if checkpoint_path:
            chkpt = checkpoint_manager.load(checkpoint_path, device=device)
            model.load_state_dict(chkpt.model_state_dict)
            print(f"Loaded weights from {checkpoint_path}")
        else:
            print("Warning: Running eval-only mode with initialized weights (no checkpoint specified).")
        
        evaluator = Evaluator(model, tokenizer, device, config={})
        test_loader = val_loader
        try:
            test_data = torch.load(processed_dir / "test.pt", weights_only=True)
            test_dataset = TextDataset(test_data, model_config.context_length)
            test_loader = create_dataloader(test_dataset, batch_size, shuffle=False)
            print("Loaded test split for evaluation.")
        except Exception:
            print("Test split not found, using validation split for evaluation.")
            
        results = evaluator.evaluate_split(test_loader, "evaluation")
        evaluator.print_results({"evaluation": results})
        return
        
    trainer_config = config_dict.get("training", {})
    if args.resume:
        trainer = Trainer.from_checkpoint(
            checkpoint_path=args.resume,
            model=model,
            train_loader=train_loader,
            val_loader=val_loader,
            optimizer=optimizer,
            scheduler=scheduler,
            checkpoint_manager=checkpoint_manager,
            mixed_precision=trainer_config.get("mixed_precision", False),
            gradient_clip=trainer_config.get("gradient_clip", 1.0),
            gradient_accumulation_steps=trainer_config.get("gradient_accumulation_steps", 1),
            eval_interval=trainer_config.get("eval_interval", 200),
            eval_steps=trainer_config.get("eval_steps", 50),
        )
        trainer.config = trainer_config
    else:
        trainer = Trainer(
            model=model,
            optimizer=optimizer,
            scheduler=scheduler,
            train_loader=train_loader,
            val_loader=val_loader,
            device=device,
            checkpoint_manager=checkpoint_manager,
            config=trainer_config,
            mixed_precision=trainer_config.get("mixed_precision", False),
            gradient_clip=trainer_config.get("gradient_clip", 1.0),
            gradient_accumulation_steps=trainer_config.get("gradient_accumulation_steps", 1),
            eval_interval=trainer_config.get("eval_interval", 200),
            eval_steps=trainer_config.get("eval_steps", 50),
        )
    
    print("Starting training...")
    trainer.train(
        max_epochs=trainer_config.get("max_epochs"),
        max_steps=trainer_config.get("max_steps")
    )
    print("Training finished.")

if __name__ == "__main__":
    main()
