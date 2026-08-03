from app.ai.gemini_client import gemini_client

prompt = """
Say hello.
Tell me you are connected successfully.
"""

response = gemini_client.generate_content(prompt)

print("\nGemini Response:\n")
print(response)