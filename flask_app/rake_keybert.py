from keybert import KeyBERT
from rake_nltk import Rake
from sentence_transformers import SentenceTransformer
import json
import nltk

# --- Download NLTK Resources (If Missing) ---
try:
    from nltk.corpus import stopwords
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')

nltk.download('punkt')

# --- RAKE: Multi-word Keyword Extraction ---
def extract_rake_keywords(text):
    rake = Rake()
    rake.extract_keywords_from_text(text)
    return rake.get_ranked_phrases()

# --- KeyBERT: Contextual Keyword Extraction ---
def extract_keybert_keywords(text, model_name='all-mpnet-base-v2', top_n=10):
    model = SentenceTransformer(model_name)
    kw_model = KeyBERT(model)

    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),   # Extract 1-2 word phrases
        stop_words='english',
        top_n=top_n
    )
    return [kw[0].lower() for kw in keywords]

# --- Combine RAKE + KeyBERT ---
def combine_keywords(text):
    rake_keywords = extract_rake_keywords(text)
    bert_keywords = extract_keybert_keywords(text)
    combined_keywords = list(set(rake_keywords + bert_keywords))
    return combined_keywords

# --- Filter by Valid Keywords ---
def filter_keywords(keywords, valid_keywords):
    return [kw for kw in keywords if kw in valid_keywords]

# --- Load Valid Keywords from JSON ---
def load_valid_keywords(file_path='valid_keywords.json'):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return set(data['keywords'])
