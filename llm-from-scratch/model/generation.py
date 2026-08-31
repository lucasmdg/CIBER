import torch
import torch.nn.functional as F
from typing import Any, Optional

class TextGenerator:
    """
    Utility class for generating text from a trained TransformerLM.
    """
    def __init__(self, model: torch.nn.Module, tokenizer: Any, device: torch.device):
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        self.model.eval()
        
    @torch.no_grad()
    def generate(self, prompt: str, max_new_tokens: int, temperature: float = 1.0, 
                 top_k: Optional[int] = None, top_p: Optional[float] = None, 
                 seed: Optional[int] = None) -> str:
        """
        Generate text continuing from the prompt.
        
        Args:
            prompt: Initial text.
            max_new_tokens: Number of tokens to generate.
            temperature: Softmax temperature.
            top_k: Top-k sampling threshold.
            top_p: Nucleus sampling threshold.
            seed: Random seed for reproducibility.
            
        Returns:
            Generated text string.
        """
        if seed is not None:
            torch.manual_seed(seed)
            
        # Encode prompt
        idx = torch.tensor(self.tokenizer.encode(prompt), dtype=torch.long, device=self.device).unsqueeze(0) # [1, T]
        
        for _ in range(max_new_tokens):
            # Crop context if it exceeds max_seq_len
            context_length = self.model.config.context_length
            idx_cond = idx if idx.size(1) <= context_length else idx[:, -context_length:]
            
            # Forward pass
            logits, _ = self.model(idx_cond)
            # Take logits for the last token [1, vocab_size]
            logits = logits[:, -1, :]
            
            if temperature > 0.0:
                logits = logits / temperature
            else:
                # Greedy decoding
                next_token = torch.argmax(logits, dim=-1, keepdim=True)
                idx = torch.cat((idx, next_token), dim=1)
                continue
                
            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = float('-inf')
                
            if top_p is not None:
                sorted_logits, sorted_indices = torch.sort(logits, descending=True)
                cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)
                
                # Remove tokens with cumulative probability above the threshold
                sorted_indices_to_remove = cumulative_probs > top_p
                # Shift the indices to the right to keep also the first token above the threshold
                sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
                sorted_indices_to_remove[..., 0] = 0
                
                # Scatter back to the original ordering
                indices_to_remove = sorted_indices_to_remove.scatter(1, sorted_indices, sorted_indices_to_remove)
                logits[indices_to_remove] = float('-inf')
                
            probs = F.softmax(logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)
            
            idx = torch.cat((idx, next_token), dim=1)
            
        return self.tokenizer.decode(idx[0].tolist())
