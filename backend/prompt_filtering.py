from better_profanity import profanity

def filter_prompt(prompt):
    if profanity.contains_profanity(prompt):
        print("Prompt contains bad language")
    return prompt
