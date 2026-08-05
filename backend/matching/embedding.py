from sentence_transformers import SentenceTransformer

_model = None


def get_model():
    global _model

    # Load model only when embeddings are actually required
    if _model is None:
        print("Loading embedding model...")

        _model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        print("Embedding model loaded successfully.")

    return _model


def create_embedding(text):
    model = get_model()

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding