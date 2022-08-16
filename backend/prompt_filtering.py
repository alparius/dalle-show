def filter_prompt(prompt):
    if "WALL-E" in prompt:
        prompt = prompt.replace("WALL-E", "BMO")

    return prompt
