from transformers import pipeline

# Load model once (IMPORTANT)
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

def analyze_description(problem_type: str, description: str) -> str:
    labels = [
        "road damage",
        "water problem",
        "electricity issue",
        "garbage issue",
        "street light issue"
    ]

    result = classifier(description, labels)

    top_label = result["labels"][0]
    score = result["scores"][0]

    if score < 0.4:
        return "⚠️ Description is unclear. Please add more details (location, severity, landmark)."

    return f"✅ Description looks relevant to '{top_label}'. Good to submit."
