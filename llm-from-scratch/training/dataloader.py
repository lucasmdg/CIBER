"""DataLoader factory for creating deterministic data iterators."""
import torch
from torch.utils.data import DataLoader
from training.dataset import TextDataset

def create_dataloader(
    dataset: TextDataset,
    batch_size: int,
    shuffle: bool = True,
    num_workers: int = 0,
    seed: int = 42,
    drop_last: bool = True,
) -> DataLoader:
    """Create a DataLoader with deterministic behavior.
    
    Uses a seeded generator for reproducible shuffling.
    """
    generator = torch.Generator()
    generator.manual_seed(seed)
    
    pin_memory = torch.cuda.is_available()
    
    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=shuffle,
        num_workers=num_workers,
        drop_last=drop_last,
        pin_memory=pin_memory,
        generator=generator if shuffle else None
    )
