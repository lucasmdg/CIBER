"""
Character-level tokenizer for the LLM from scratch project.
Converts text into sequences of character IDs and vice-versa.
"""
from pathlib import Path
from typing import List, Optional, Union

from tokenizer.vocab import Vocabulary


class CharTokenizer:
    """
    A simple character-level tokenizer that maps individual characters to integers.
    Useful for basic language modeling tasks and debugging.
    """

    def __init__(self, text: Optional[str] = None):
        """
        Initializes the character tokenizer.
        
        Args:
            text: Optional text corpus to build the vocabulary from initially.
        """
        self.vocab = Vocabulary()
        if text is not None:
            self.build_vocab(text)

    def build_vocab(self, text: str) -> None:
        """
        Builds the vocabulary from a text corpus by extracting all unique characters.
        The characters are sorted deterministically before being added.
        
        Args:
            text: The text corpus to extract characters from.
            
        Raises:
            TypeError: If the input text is not a string.
        """
        if not isinstance(text, str):
            raise TypeError(f"Text must be a string, got {type(text).__name__}")
            
        if not text:
            return
            
        # Get unique characters and sort them deterministically
        unique_chars = sorted(list(set(text)))
        
        for char in unique_chars:
            self.vocab.add_token(char)

    @property
    def vocab_size(self) -> int:
        """Returns the total number of tokens in the vocabulary."""
        return len(self.vocab)

    def encode(self, text: str, add_special_tokens: bool = False) -> List[int]:
        """
        Encodes a string of text into a list of integer token IDs.
        Unknown characters are mapped to the UNK token ID.
        
        Args:
            text: The text to encode.
            add_special_tokens: If True, prepends BOS and appends EOS tokens.
            
        Returns:
            A list of integer token IDs.
            
        Raises:
            TypeError: If the input text is not a string.
        """
        if not isinstance(text, str):
            raise TypeError(f"Text must be a string, got {type(text).__name__}")
            
        if not text and not add_special_tokens:
            return []
            
        ids = [self.vocab.token_to_id(char) for char in text]
        
        if add_special_tokens:
            ids = [self.vocab.bos_id] + ids + [self.vocab.eos_id]
            
        return ids

    def decode(self, ids: List[int], skip_special_tokens: bool = True) -> str:
        """
        Decodes a list of integer token IDs back into a string of text.
        
        Args:
            ids: The list of token IDs to decode.
            skip_special_tokens: If True, omits PAD, UNK, BOS, and EOS tokens from the output.
            
        Returns:
            The decoded text string.
            
        Raises:
            TypeError: If the input is not a list of integers.
        """
        if not isinstance(ids, list):
            raise TypeError(f"IDs must be a list, got {type(ids).__name__}")
            
        chars = []
        for token_id in ids:
            if not isinstance(token_id, int):
                raise TypeError(f"Token ID must be an integer, got {type(token_id).__name__}")
                
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
        """
        Encodes a batch of strings into a list of lists of token IDs.
        
        Args:
            texts: List of strings to encode.
            add_special_tokens: Whether to add BOS and EOS tokens to each sequence.
            
        Returns:
            A list of encoded sequences.
        """
        if not isinstance(texts, list):
            raise TypeError("Input must be a list of strings")
            
        return [self.encode(text, add_special_tokens) for text in texts]

    def decode_batch(self, id_lists: List[List[int]], skip_special_tokens: bool = True) -> List[str]:
        """
        Decodes a batch of sequences of token IDs back into strings.
        
        Args:
            id_lists: List of lists of token IDs.
            skip_special_tokens: Whether to omit special tokens.
            
        Returns:
            A list of decoded strings.
        """
        if not isinstance(id_lists, list):
            raise TypeError("Input must be a list of lists of integers")
            
        return [self.decode(ids, skip_special_tokens) for ids in id_lists]

    def save(self, directory: Union[str, Path]) -> None:
        """
        Saves the tokenizer's vocabulary to a directory.
        
        Args:
            directory: The directory path where the vocabulary will be saved.
        """
        directory = Path(directory)
        directory.mkdir(parents=True, exist_ok=True)
        vocab_path = directory / "vocab.json"
        self.vocab.save(vocab_path)

    @classmethod
    def load(cls, directory: Union[str, Path]) -> "CharTokenizer":
        """
        Loads a tokenizer from a directory containing a saved vocabulary.
        
        Args:
            directory: The directory path containing the vocab.json file.
            
        Returns:
            A new CharTokenizer instance initialized with the loaded vocabulary.
            
        Raises:
            FileNotFoundError: If the vocabulary file does not exist.
        """
        directory = Path(directory)
        vocab_path = directory / "vocab.json"
        
        if not vocab_path.exists():
            raise FileNotFoundError(f"Vocabulary file not found at {vocab_path}")
            
        tokenizer = cls()
        tokenizer.vocab = Vocabulary.load(vocab_path)
        return tokenizer
