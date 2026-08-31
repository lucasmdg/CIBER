"""Text generation script.

Usage:
    python scripts/generate.py --checkpoint checkpoints/checkpoint_best.pt --prompt "To be or not"
    python scripts/generate.py --checkpoint checkpoints/checkpoint_best.pt --prompt "ROMEO:" --temperature 0.8 --top-k 50
    python scripts/generate.py --checkpoint checkpoints/checkpoint_best.pt --interactive
"""
import argparse
import sys
from pathlib import Path
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))

from model.config import ModelConfig
from model.transformer import TransformerLM
from model.generation import TextGenerator
from tokenizer import CharTokenizer

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate text with Transformer LM")
    parser.add_argument("--checkpoint", type=str, required=True, help="Path to checkpoint")
    parser.add_argument("--prompt", type=str, default="\n", help="Initial prompt text")
    parser.add_argument("--interactive", action="store_true", help="Interactive REPL mode")
    parser.add_argument("--data-dir", type=str, default="data", help="Data directory")
    parser.add_argument("--temperature", type=float, default=1.0, help="Sampling temperature")
    parser.add_argument("--top-k", type=int, default=0, help="Top-K sampling")
    parser.add_argument("--top-p", type=float, default=0.0, help="Top-p nucleus sampling")
    parser.add_argument("--max-tokens", type=int, default=100, help="Max tokens to generate")
    parser.add_argument("--seed", type=int, help="Random seed")
    parser.add_argument("--num-samples", type=int, default=1, help="Number of samples to generate")
    
    args = parser.parse_args()
    
    checkpoint_state = torch.load(args.checkpoint, map_location="cpu", weights_only=False)
    processed_dir = Path(args.data_dir) / "processed"
    tokenizer = CharTokenizer.load(processed_dir / "tokenizer.json")
    
    model_config = checkpoint_state.get('model_config')
    if isinstance(model_config, dict):
        model_config = ModelConfig(**model_config)
    elif not model_config:
        model_config = ModelConfig(vocab_size=tokenizer.vocab_size)
        
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = TransformerLM(model_config).to(device)
    model.load_state_dict(checkpoint_state['model_state_dict'])
    
    # Instantiate the TextGenerator
    generator = TextGenerator(model, tokenizer, device)
    
    # Configure top_k and top_p for TextGenerator (None instead of 0/0.0 to disable)
    top_k = args.top_k if args.top_k > 0 else None
    top_p = args.top_p if args.top_p > 0.0 else None
    
    if args.interactive:
        print("Entering interactive mode. Type 'quit' to exit.")
        while True:
            try:
                user_prompt = input(">>> ")
            except (KeyboardInterrupt, EOFError):
                break
            if user_prompt.lower() in ["quit", "exit"]:
                break
            out = generator.generate(
                prompt=user_prompt,
                max_new_tokens=args.max_tokens,
                temperature=args.temperature,
                top_k=top_k,
                top_p=top_p,
                seed=args.seed
            )
            print(out)
    else:
        for i in range(args.num_samples):
            out = generator.generate(
                prompt=args.prompt,
                max_new_tokens=args.max_tokens,
                temperature=args.temperature,
                top_k=top_k,
                top_p=top_p,
                seed=args.seed
            )
            print(f"--- Sample {i+1} ---")
            print(out)
            print()

if __name__ == "__main__":
    main()
