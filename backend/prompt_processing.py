import config
import deepl


def filter_prompt(prompt):
    if "WALL-E" in prompt:
        prompt = prompt.replace("WALL-E", "BMO")

    return prompt


def online_translate(prompt):
    """Detect language of prompt and translate it to English using DeepL API."""
    translator = deepl.Translator(config.DEEPL_AUTH_KEY)
    res = translator.translate_text(prompt, target_lang="EN-US")
    translated_prompt = res.text
    print(f"Translated prompt '{prompt}' from {res.detected_source_lang} and got '{translated_prompt}'")
    return translated_prompt


def translate_prompt(prompt):
    translated = False
    if config.ONLINE_TRANSLATION:
        try:
            prompt = online_translate(prompt)
            translated = True
        except Exception as e:
            print(f"Online translation failed: {e}")

    if not translated and config.OFFLINE_TRANSLATION:
        # TODO Implement offline translation.
        pass

    return prompt


def preprocess_prompt(raw_prompt):
    translated_prompt = translate_prompt(raw_prompt)
    filtered_prompt = filter_prompt(translated_prompt)
    return filtered_prompt
