from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# --- Load the model ---
MODEL_PATH = "unemployment_model.joblib"
model_pipeline = None

if os.path.exists(MODEL_PATH):
    try:
        model_pipeline = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        exit()
else:
    print(f"❌ Model file not found at {MODEL_PATH}. Please train and save it first.")
    exit()

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests (frontend integration)

# --- API Routes ---
@app.route("/")
def home():
    """Simple home route to confirm API is running"""
    return "Unemployment Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    """
    Receives user profile data as JSON, runs the model, 
    and returns unemployment probability.
    """
    if model_pipeline is None:
        return jsonify({"error": "Model not loaded."}), 500

    try:
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Expected fields
        required_fields = [
            "Age_Group", "Gender", "Education", "Skillset",
            "Sector", "Location", "Experience", "Employment_History"
        ]

        # Validate input
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Convert to DataFrame
        input_df = pd.DataFrame([data])

        # Make prediction
        predicted_probability = model_pipeline.predict_proba(input_df)[:, 1][0]

        return jsonify({
            "status": "success",
            "predicted_probability": float(predicted_probability)
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    # Run API
    app.run(host="0.0.0.0", port=5000)
