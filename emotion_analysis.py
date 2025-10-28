from flask import Flask, request, jsonify
from transformers import pipeline
import torch
import numpy as np

app = Flask(__name__)

# Initialize emotion classifier
emotion_classifier = pipeline(
    "text-classification",
    model="SamLowe/roberta-base-go_emotions",
    return_all_scores=True
)

def normalize_emotions(emotions):
    """Convert raw emotion scores to probabilities."""
    scores = np.array([e['score'] for e in emotions[0]])
    return dict(zip(
        [e['label'] for e in emotions[0]],
        softmax(scores)
    ))

def softmax(x):
    """Compute softmax values for each set of scores."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

@app.route('/analyze/emotions', methods=['POST'])
def analyze_emotions():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Get emotion predictions
        emotions = emotion_classifier(text)
        
        # Normalize and simplify emotions
        emotion_scores = normalize_emotions(emotions)
        
        # Map complex emotions to simpler categories
        simplified_emotions = {
            'joy': sum([
                emotion_scores.get('admiration', 0),
                emotion_scores.get('joy', 0),
                emotion_scores.get('amusement', 0),
                emotion_scores.get('gratitude', 0)
            ]),
            'sadness': sum([
                emotion_scores.get('sadness', 0),
                emotion_scores.get('disappointment', 0),
                emotion_scores.get('grief', 0)
            ]),
            'anger': sum([
                emotion_scores.get('anger', 0),
                emotion_scores.get('annoyance', 0),
                emotion_scores.get('disapproval', 0)
            ]),
            'fear': sum([
                emotion_scores.get('fear', 0),
                emotion_scores.get('nervousness', 0),
                emotion_scores.get('anxiety', 0)
            ]),
            'neutral': emotion_scores.get('neutral', 0)
        }

        # Normalize simplified emotions
        total = sum(simplified_emotions.values())
        if total > 0:
            simplified_emotions = {k: v/total for k, v in simplified_emotions.items()}

        return jsonify({
            'emotions': simplified_emotions,
            'raw_emotions': emotion_scores
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
