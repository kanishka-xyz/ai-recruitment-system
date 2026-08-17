import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

client = InferenceClient(
    provider="hf-inference",
    api_key=os.environ["HF_TOKEN"],
)

def get_embedding(text):
    return client.feature_extraction(
        text,
        model="sentence-transformers/all-MiniLM-L6-v2",
    )

def create_embedding(text):
    return get_embedding(text)