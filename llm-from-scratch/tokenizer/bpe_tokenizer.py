"""
Byte-Pair Encoding (BPE) tokenizer implementation.
Learns to merge frequent character pairs into larger tokens.
"""
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union
from collections import defaultdict

from tokenizer.vocab import Vocabulary


class BPETokenizer:
    """
    A Byte-Pair Encoding tokenizer.
    
    The BPE algorithm works by iteratively merging the most frequent pair of 
    adjacent tokens into a new, single token. This allows the tokenizer to 
    efficiently represent common subwords or entire words, while falling back 
    to character-level representation for rare words.
    """

    def __init__(self):
        """Initializes an empty BPE tokenizer."""
        self.vocab = Vocabulary()
        # ordered list of merges: ((t1, t2), merged_token)
        self.merges: List[Tuple[Tuple[str, str], str]] = []

    @property
    def vocab_size(self) -> int:
        """Returns the total number of tokens in the vocabulary."""
        return len(self.vocab)

    def train(self, text: str, vocab_size: int) -> None:
        """
        Trains the BPE tokenizer on a text corpus.
        
        Algorithm step-by-step:
        1. Initialize with character-level tokens from the text.
        2. Count all adjacent pairs of tokens in the current representation.
        3. Find the most frequent pair.
        4. Merge the most frequent pair into a new single token.
        5. Repeat steps 2-4 until the desired vocab_size is reached.
        
        Args:
            text: The training corpus.
            vocab_size: The target vocabulary size, including special tokens.
            
        Raises:
            TypeError: If input types are incorrect.
            ValueError: If target vocab_size is too small.
        """
        if not isinstance(text, str):
            raise TypeError("Text must be a string")
        if not isinstance(vocab_size, int):
            raise TypeError("Vocab size must be an integer")
            
        if not text:
            return
            
        # 1. Start with character-level tokens
        unique_chars = sorted(list(set(text)))
        for char in unique_chars:
            self.vocab.add_token(char)
            
        if vocab_size <= self.vocab_size:
            return
            
        # Convert text to a sequence of initial character tokens
        tokens = list(text)
        
        # BPE training loop
        num_merges = vocab_size - self.vocab_size
        
        for i in range(num_merges):
            if len(tokens) < 2:
                break
                
            # 2. Count adjacent pairs
            pair_counts: Dict[Tuple[str, str], int] = defaultdict(int)
            for j in range(len(tokens) - 1):
                pair = (tokens[j], tokens[j+1])
                pair_counts[pair] += 1
                
            if not pair_counts:
                break
                
            # 3. Find most frequent pair
            # Sort by count descending, then by pair alphabetically for determinism
            sorted_pairs = sorted(pair_counts.items(), key=lambda x: (-x[1], x[0]))
            best_pair = sorted_pairs[0][0]
            
            # 4. Merge most frequent pair
            merged_token = best_pair[0] + best_pair[1]
            self.merges.append((best_pair, merged_token))
            self.vocab.add_token(merged_token)
            
            # Update the token sequence
            new_tokens = []
            j = 0
            while j < len(tokens):
                if j < len(tokens) - 1 and (tokens[j], tokens[j+1]) == best_pair:
                    new_tokens.append(merged_token)
                    j += 2
                else:
                    new_tokens.append(tokens[j])
                    j += 1
            tokens = new_tokens

    def _apply_merges(self, text: str) -> List[str]:
        """Applies learned merges to a piece of text."""
        tokens = list(text)
        
        if not tokens:
            return []
            
        for pair, merged_token in self.merges:
            new_tokens = []
            j = 0
            while j < len(tokens):
                if j < len(tokens) - 1 and (tokens[j], tokens[j+1]) == pair:
                    new_tokens.append(merged_token)
                    j += 2
                else:
                    new_tokens.append(tokens[j])
                    j += 1
            tokens = new_tokens
            
        return tokens

    def encode(self, text: str, add_special_tokens: bool = False) -> List[int]:
        """
        Encodes a string of text into a list of integer token IDs using BPE rules.
        
        Args:
            text: The text to encode.
            add_special_tokens: If True, prepends BOS and appends EOS tokens.
            
        Returns:
            A list of integer token IDs.
        """
        if not isinstance(text, str):
            raise TypeError("Text must be a string")
            
        if not text and not add_special_tokens:
            return []
            
        # Apply merges to split text into tokens
        tokens = self._apply_merges(text)
        
        # Convert tokens to IDs
        ids = [self.vocab.token_to_id(tok) for tok in tokens]
        
        if add_special_tokens:
            ids = [self.vocab.bos_id] + ids + [self.vocab.eos_id]
            
        return ids

    def decode(self, ids: List[int], skip_special_tokens: bool = True) -> str:
        """
        Decodes a list of integer token IDs back into text.
        
        Args:
            ids: The list of token IDs to decode.
            skip_special_tokens: If True, omits special tokens from the output.
            
        Returns:
            The decoded text string.
        """
        if not isinstance(ids, list):
            raise TypeError("IDs must be a list of integers")
            
        chars = []
        for token_id in ids:
            if not isinstance(token_id, int):
                raise TypeError("Token ID must be an integer")
                
            if skip_special_tokens and token_id in self.vocab.special_ids:
                continue
                
            try:
                char = self.vocab.id_to_token(token_id)
                chars.append(char)
            except KeyError:
                if not skip_special_tokens:
                    chars.append(self.vocab.UNK_TOKEN)
                    
        return "".join(chars)

    def encode_batch(self, texts: List[str], add_special_tokens: bool = False) -> List[List[int]]:
        """Encodes a batch of strings."""
        if not isinstance(texts, list):
            raise TypeError("Input must be a list of strings")
        return [self.encode(text, add_special_tokens) for text in texts]

    def decode_batch(self, id_lists: List[List[int]], skip_special_tokens: bool = True) -> List[str]:
        """Decodes a batch of token ID sequences."""
        if not isinstance(id_lists, list):
            raise TypeError("Input must be a list of lists of integers")
        return [self.decode(ids, skip_special_tokens) for ids in id_lists]

    def save(self, directory: Union[str, Path]) -> None:
        """
        Saves the tokenizer's vocabulary and merge rules to a directory.
        
        Args:
            directory: The directory path where files will be saved.
        """
        directory = Path(directory)
        directory.mkdir(parents=True, exist_ok=True)
        
        # Save vocabulary
        self.vocab.save(directory / "vocab.json")
        
        # Save merges
        merges_serializable = [[pair[0], pair[1], merged] for pair, merged in self.merges]
        with open(directory / "merges.json", 'w', encoding='utf-8') as f:
            json.dump(merges_serializable, f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls, directory: Union[str, Path]) -> "BPETokenizer":
        """
        Loads a tokenizer from a directory containing vocab and merges.
        
        Args:
            directory: The directory path containing the saved files.
            
        Returns:
            A new BPETokenizer instance.
            
        Raises:
            FileNotFoundError: If required files do not exist.
        """
        directory = Path(directory)
        vocab_path = directory / "vocab.json"
        merges_path = directory / "merges.json"
        
        if not vocab_path.exists() or not merges_path.exists():
            raise FileNotFoundError(f"Vocabulary or merges file not found in {directory}")
            
        tokenizer = cls()
        tokenizer.vocab = Vocabulary.load(vocab_path)
        
        with open(merges_path, 'r', encoding='utf-8') as f:
            merges_data = json.load(f)
            
        tokenizer.merges = [((m[0], m[1]), m[2]) for m in merges_data]
        
        return tokenizer
