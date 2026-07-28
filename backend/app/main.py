from fastapi import FastAPI

app = FastAPI(
    title="MedAssist AI API",
    description="Multimodal Clinical Decision Support Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to MedAssist AI 🚀"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "MedAssist AI",
        "version": "1.0.0"
    }