"""Interactive chat loop wrapper for inference.

Allows chatting or prompting the language model interactively.
"""

import argparse
import sys
from pathlib import Path
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))

from inference.generate import load_model_from_checkpoint
from model.generation import TextGenerator


def run_chat(checkpoint_path: str, data_dir: str = "data", max_tokens: int = 200, 
             temperature: float = 0.8, top_k: int = 50, top_p: float = 0.9) -> None:
    """Runs a REPL loop for interactive generation."""
    print("Loading model and tokenizer...")
    try:
        model, tokenizer, device = load_model_from_checkpoint(checkpoint_path, data_dir)
    except Exception as e:
        print(f"Error loading checkpoint: {e}")
        return

    generator = TextGenerator(model, tokenizer, device)
    
    # Map disabling values to None
    tk = top_k if top_k > 0 else None
    tp = top_p if top_p > 0.0 else None

    print("\n" + "="*50)
    print("Transformer LM Interactive Chat")
    print("Type 'quit' or 'exit' to end the session.")
    print("Ctrl+C to interrupt generation.")
    print("="*50 + "\n")

    while True:
        try:
            prompt = input("User > ")
            if prompt.strip().lower() in ["quit", "exit"]:
                print("Goodbye!")
                break
                
            if not prompt.strip():
                continue
                
            print("Model > ", end="", flush=True)
            
            # Since generate does not stream, we generate all at once
            out = generator.generate(
                prompt=prompt,
                max_new_tokens=max_tokens,
                temperature=temperature,
                top_k=tk,
                top_p=tp
            )
            # Just print the generated continuation (remove the prompt from output if needed)
            if out.startswith(prompt):
                continuation = out[len(prompt):]
            else:
                continuation = out
            print(continuation)
            print()
            
        except KeyboardInterrupt:
            print("\n[Generation interrupted]\n")
        except EOFError:
            print("\nGoodbye!")
            break


def main() -> None:
    parser = argparse.ArgumentParser(description="Interactive Chat with Transformer LM")
    parser.add_argument("--checkpoint", type=str, required=True, help="Path to checkpoint")
    parser.add_argument("--data-dir", type=str, default="data", help="Data directory")
    parser.add_argument("--max-tokens", type=int, default=150, help="Max tokens to generate")
    parser.add_argument("--temperature", type=float, default=0.8, help="Sampling temperature")
    parser.add_argument("--top-k", type=int, default=50, help="Top-K sampling")
    parser.add_argument("--top-p", type=float, default=0.9, help="Top-P sampling")
    
    args = parser.parse_args()
    run_chat(
        checkpoint_path=args.checkpoint,
        data_dir=args.data_dir,
        max_tokens=args.max_tokens,
        temperature=args.temperature,
        top_k=args.top_k,
        top_p=args.top_p
    )


if __name__ == "__main__":
    main()
