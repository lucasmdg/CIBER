import pytest
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from training.dataset import TextDataset
from training.dataloader import create_dataloader
from training.optimizer import create_optimizer
from training.scheduler import create_scheduler
from training.checkpointing import CheckpointManager
from model.config import ModelConfig

def test_text_dataset():
    data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    dataset = TextDataset(data, seq_len=4)
    assert len(dataset) == 10 - 4
    x, y = dataset[0]
    assert x.tolist() == [1, 2, 3, 4]
    assert y.tolist() == [2, 3, 4, 5]

def test_create_dataloader():
    data = list(range(100))
    loader = create_dataloader(data, seq_len=10, batch_size=4, shuffle=True)
    batch_x, batch_y = next(iter(loader))
    assert batch_x.shape == (4, 10)
    assert batch_y.shape == (4, 10)

def test_create_optimizer():
    model = nn.Sequential(
        nn.Linear(10, 10),
        nn.LayerNorm(10)
    )
    opt = create_optimizer(model, learning_rate=0.1, weight_decay=0.1)
    
    decay_group = next(g for g in opt.param_groups if g['weight_decay'] > 0.0)
    no_decay_group = next(g for g in opt.param_groups if g['weight_decay'] == 0.0)
    
    assert len(decay_group['params']) == 1 # Only Linear weight
    assert len(no_decay_group['params']) == 3 # Linear bias, LN weight, LN bias

def test_create_scheduler():
    model = nn.Linear(10, 10)
    opt = create_optimizer(model, learning_rate=1.0, weight_decay=0.0)
    sched = create_scheduler(opt, warmup_steps=10, max_steps=100, min_lr_ratio=0.1)
    
    sched.step()
    lr = opt.param_groups[0]['lr']
    assert lr < 1.0
    
def test_checkpoint_manager(tmp_path):
    model = nn.Linear(10, 10)
    opt = torch.optim.AdamW(model.parameters())
    config = ModelConfig()
    
    manager = CheckpointManager(tmp_path)
    manager.save_checkpoint(
        step=10,
        model=model,
        optimizer=opt,
        model_config=config,
        val_loss=0.5,
        is_best=True
    )
    
    state, best_val = manager.load_checkpoint(tmp_path / "best_model.pt")
    assert state['step'] == 10
    assert state['val_loss'] == 0.5
