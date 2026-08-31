import os
import pytest
import tempfile
from tokenizer.tokenizer import CharTokenizer
from tokenizer.bpe_tokenizer import BPETokenizer

def test_char_tokenizer_encode_decode():
    text = "hello world!"
    tokenizer = CharTokenizer(text)
    
    encoded = tokenizer.encode(text)
    decoded = tokenizer.decode(encoded, skip_special_tokens=True)
    assert decoded == text

def test_char_tokenizer_special_tokens():
    text = "hello"
    tokenizer = CharTokenizer(text)
    
    encoded = tokenizer.encode(text, add_special_tokens=True)
    assert encoded[0] == tokenizer.vocab.bos_id
    assert encoded[-1] == tokenizer.vocab.eos_id
    
    decoded_with_special = tokenizer.decode(encoded, skip_special_tokens=False)
    assert decoded_with_special.startswith(tokenizer.vocab.BOS_TOKEN)
    assert decoded_with_special.endswith(tokenizer.vocab.EOS_TOKEN)

def test_char_tokenizer_unknown_chars():
    tokenizer = CharTokenizer("abc")
    encoded = tokenizer.encode("abcd") # 'd' is unknown
    assert encoded[-1] == tokenizer.vocab.unk_id

def test_char_tokenizer_edge_cases():
    tokenizer = CharTokenizer("abc")
    
    assert tokenizer.encode("") == []
    assert tokenizer.decode([]) == ""
    
    tokenizer.build_vocab(" \t\n")
    ws_encoded = tokenizer.encode(" \t\n")
    assert tokenizer.decode(ws_encoded) == " \t\n"
    
    long_text = "a" * 10000
    encoded = tokenizer.encode(long_text)
    assert len(encoded) == 10000
    assert tokenizer.decode(encoded) == long_text

def test_bpe_tokenizer_basic():
    text = "aaabdaaabac"
    tokenizer = BPETokenizer()
    tokenizer.train(text, vocab_size=len(set(text)) + 4 + 2) # a few merges
    encoded = tokenizer.encode(text)
    decoded = tokenizer.decode(encoded)
    assert decoded == text

def test_tokenizer_save_load():
    with tempfile.TemporaryDirectory() as tmpdir:
        text = "save and load me"
        tokenizer = CharTokenizer(text)
        tokenizer.save(tmpdir)
        
        loaded = CharTokenizer.load(tmpdir)
        assert loaded.vocab_size == tokenizer.vocab_size
        assert loaded.encode(text) == tokenizer.encode(text)
