from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import os

# --- Load the saved model components ---
# These files must be present in the same directory as this script.
try:
    model = joblib.load("resume_classifier_model.joblib")
    label_encoder = joblib.load("label_encoder.joblib")
    tfidf_vectorizer = joblib.load("tfidf_vectorizer.joblib")
except FileNotFoundError as e:
    print(f"Error: Required model file not found. {e}")
    # Exit if files are not found, as the app cannot function without them.
    exit()

# --- Pre-processing function (same as before) ---
def cleanresume(txt):
    """
    Cleans the resume text by removing URLs, mentions, hashtags, and special characters.
    """
    cleantxt = re.sub('http\S+\s', ' ', txt)
    cleantxt = re.sub('@\S+', ' ', cleantxt)
    cleantxt = re.sub('#\S+\s', ' ', cleantxt)
    cleantxt = re.sub('RT|cc', ' ', cleantxt)
    cleantxt = re.sub('[%s]' % re.escape("""!"#$%&''()*+,_./:;<=>?@[\]^-`{!}~"""), ' ', cleantxt)
    cleantxt = re.sub(r'[^\x00-\x7f]', ' ', cleantxt)
    cleantxt = re.sub('\s+', ' ', cleantxt)
    return cleantxt

# --- Flask App Initialization ---
app = Flask(__name__)
# Enable CORS to allow requests from your frontend HTML page
CORS(app)

# --- API Routes ---
@app.route("/")
def home():
    """Simple home route to confirm the API is running."""
    return "Resume Classifier API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    """
    Receives resume text, processes it, and returns the predicted category.
    """
    try:
        # Get JSON data from the request body
        data = request.get_json()
        if not data or "resume_text" not in data:
            return jsonify({"error": "No resume_text provided in the request body."}), 400

        resume_text = data["resume_text"]

        # 1. Clean the input text
        cleaned_text = cleanresume(resume_text)

        # 2. Transform the text using the loaded TF-IDF vectorizer
        vectorized_text = tfidf_vectorizer.transform([cleaned_text])

        # 3. Make a prediction with the loaded model
        prediction_label = model.predict(vectorized_text)[0]

        # 4. Inverse transform the predicted label to get the category name
        predicted_category = label_encoder.inverse_transform([prediction_label])[0]

        # Return the prediction as a JSON response
        return jsonify({
            "status": "success",
            "predicted_category": predicted_category
        })

    except Exception as e:
        # Return a JSON error message for any exceptions
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    # The host='0.0.0.0' makes the server accessible externally (useful for containers or remote access)
    app.run(host="0.0.0.0", port=5000)
