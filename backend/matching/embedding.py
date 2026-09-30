from sentence_transformers import SentenceTransformer

# Load the embedding model once when the application starts
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def get_embedding(text):
    return model.encode(text)


def create_embedding(text):
    return get_embedding(text)