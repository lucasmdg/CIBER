"""Evaluation module for the LLM from scratch project."""
from evaluation.perplexity import compute_perplexity
from evaluation.evaluation import Evaluator

__all__ = ["compute_perplexity", "Evaluator"]
