import sys
from pathlib import Path
from flask import Flask, request, jsonify, render_template
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))

from inference.generate import load_model_from_checkpoint, generate

app = Flask(__name__)

# Global variables to hold model state
MODEL_STATE = {
    "model": None,
    "tokenizer": None,
    "device": None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_api():
    if MODEL_STATE["model"] is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    prompt = data.get('prompt', '')
    max_tokens = int(data.get('max_tokens', 100))
    temperature = float(data.get('temperature', 0.8))
    
    from model.generation import TextGenerator
    generator = TextGenerator(MODEL_STATE["model"], MODEL_STATE["tokenizer"], MODEL_STATE["device"])
    
    try:
        result = generator.generate(
            prompt=prompt,
            max_new_tokens=max_tokens,
            temperature=temperature
        )
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="Web Demo for LLM from Scratch")
    parser.add_argument("--checkpoint", type=str, default="checkpoints/checkpoint_best.pt", help="Path to checkpoint")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the app on")
    args = parser.parse_args()

    print(f"Loading model from {args.checkpoint}...")
    try:
        model, tokenizer, device = load_model_from_checkpoint(args.checkpoint)
        MODEL_STATE["model"] = model
        MODEL_STATE["tokenizer"] = tokenizer
        MODEL_STATE["device"] = device
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Warning: Could not load model: {e}")
        print("The app will run but generation will fail until a model is trained.")

    app.run(host='0.0.0.0', port=args.port, debug=False)
