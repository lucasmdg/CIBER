"""
Vocabulary management for the tokenizer module.
Handles token-to-id and id-to-token mappings, special tokens, and serialization.
"""
import json
from pathlib import Path
from typing import Dict, List, Optional, Union


class Vocabulary:
    """
    Manages the mapping between tokens and their corresponding integer IDs.
    
    Includes built-in support for special tokens:
    - [PAD] (0): Padding token for batching
    - [UNK] (1): Unknown token for out-of-vocabulary words/characters
    - [BOS] (2): Beginning of sequence token
    - [EOS] (3): End of sequence token
    """
    
    PAD_TOKEN = "[PAD]"
    UNK_TOKEN = "[UNK]"
    BOS_TOKEN = "[BOS]"
    EOS_TOKEN = "[EOS]"

    def __init__(self) -> None:
        """Initialize an empty vocabulary with special tokens."""
        self._token2id: Dict[str, int] = {}
        self._id2token: Dict[int, str] = {}
        
        # Initialize special tokens with fixed IDs to ensure determinism
        self._add_special_tokens()

    def _add_special_tokens(self) -> None:
        """Adds special tokens to the vocabulary with predefined IDs."""
        self.add_token(self.PAD_TOKEN)  # ID 0
        self.add_token(self.UNK_TOKEN)  # ID 1
        self.add_token(self.BOS_TOKEN)  # ID 2
        self.add_token(self.EOS_TOKEN)  # ID 3

    @property
    def pad_id(self) -> int:
        """Returns the ID of the padding token."""
        return self._token2id[self.PAD_TOKEN]

    @property
    def unk_id(self) -> int:
        """Returns the ID of the unknown token."""
        return self._token2id[self.UNK_TOKEN]

    @property
    def bos_id(self) -> int:
        """Returns the ID of the beginning-of-sequence token."""
        return self._token2id[self.BOS_TOKEN]

    @property
    def eos_id(self) -> int:
        """Returns the ID of the end-of-sequence token."""
        return self._token2id[self.EOS_TOKEN]
        
    @property
    def special_tokens(self) -> List[str]:
        """Returns a list of all special tokens."""
        return [self.PAD_TOKEN, self.UNK_TOKEN, self.BOS_TOKEN, self.EOS_TOKEN]
        
    @property
    def special_ids(self) -> List[int]:
        """Returns a list of IDs for all special tokens."""
        return [self.pad_id, self.unk_id, self.bos_id, self.eos_id]

    def add_token(self, token: str) -> int:
        """
        Adds a token to the vocabulary if it doesn't already exist.
        
        Args:
            token: The string token to add.
            
        Returns:
            The integer ID assigned to the token.
        """
        if not isinstance(token, str):
            raise TypeError(f"Token must be a string, got {type(token).__name__}")
            
        if token not in self._token2id:
            token_id = len(self._token2id)
            self._token2id[token] = token_id
            self._id2token[token_id] = token
            
        return self._token2id[token]

    def token_to_id(self, token: str) -> int:
        """
        Retrieves the ID for a given token. Returns UNK ID if token is not found.
        
        Args:
            token: The string token to look up.
            
        Returns:
            The integer ID of the token, or UNK ID if not present.
        """
        if not isinstance(token, str):
            raise TypeError(f"Token must be a string, got {type(token).__name__}")
            
        return self._token2id.get(token, self.unk_id)

    def id_to_token(self, token_id: int) -> str:
        """
        Retrieves the token string for a given integer ID.
        
        Args:
            token_id: The integer ID to look up.
            
        Returns:
            The string token.
            
        Raises:
            KeyError: If the ID is not present in the vocabulary.
        """
        if not isinstance(token_id, int):
            raise TypeError(f"Token ID must be an integer, got {type(token_id).__name__}")
            
        if token_id not in self._id2token:
            raise KeyError(f"Token ID {token_id} not found in vocabulary")
            
        return self._id2token[token_id]

    def __len__(self) -> int:
        """Returns the total number of tokens in the vocabulary."""
        return len(self._token2id)

    def __contains__(self, token: str) -> bool:
        """Checks if a string token is in the vocabulary."""
        if not isinstance(token, str):
            return False
        return token in self._token2id

    def save(self, path: Union[str, Path]) -> None:
        """
        Saves the vocabulary to a JSON file.
        
        Args:
            path: The file path to save the vocabulary to.
        """
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        
        # Ensure deterministic saving by sorting, but keep special tokens first
        regular_tokens = [tok for tok in self._token2id.keys() if tok not in self.special_tokens]
        regular_tokens.sort()
        
        all_tokens = self.special_tokens + regular_tokens
        ordered_token2id = {tok: i for i, tok in enumerate(all_tokens)}
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(ordered_token2id, f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls, path: Union[str, Path]) -> "Vocabulary":
        """
        Loads a vocabulary from a JSON file.
        
        Args:
            path: The file path to load the vocabulary from.
            
        Returns:
            A new Vocabulary instance populated with the loaded tokens.
            
        Raises:
            FileNotFoundError: If the vocabulary file does not exist.
        """
        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Vocabulary file not found at {path}")
            
        vocab = cls()
        
        with open(path, 'r', encoding='utf-8') as f:
            token2id = json.load(f)
            
        # Clear default initialization and load from file
        vocab._token2id.clear()
        vocab._id2token.clear()
        
        for token, token_id in token2id.items():
            vocab._token2id[token] = int(token_id)
            vocab._id2token[int(token_id)] = token
            
        # Validation
        for expected_tok, expected_id in zip(
            [cls.PAD_TOKEN, cls.UNK_TOKEN, cls.BOS_TOKEN, cls.EOS_TOKEN],
            [0, 1, 2, 3]
        ):
            if vocab._token2id.get(expected_tok) != expected_id:
                raise ValueError(f"Invalid vocabulary file: {expected_tok} must have ID {expected_id}")
                
        return vocab
