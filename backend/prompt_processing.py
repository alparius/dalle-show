import argostranslate.package, argostranslate.translate
import deepl
import pycld2
from pathlib import Path

import config


argos_models_dir = Path("argos_models")

# Models for other languages can be found here: https://www.argosopentech.com/argospm/index/
argos_model_names = {
    "de": "translate-de_en-1_0.argosmodel",
    "hu": "translate-hu_en-1_5.argosmodel",
    "ru": "translate-ru_en-1_0.argosmodel",
}


def install_offline_translation_models():
    if not config.OFFLINE_TRANSLATION:
        print("Offline translation is turned off")
        return

    print(f"Installing models for translating languages: {list(argos_model_names.keys())}")
    for lang, model_name in argos_model_names.items():
        model_path = argos_models_dir / model_name
        if not model_path.exists():
            raise ValueError(f"Model for language '{lang}' is missing. Run setup.py or turn offline translation off.")
        argostranslate.package.install_from_path(str(model_path))


def get_argos_translator_model(source_lang_code):
    if source_lang_code not in argos_model_names:
        raise ValueError(f"Offline model for language '{source_lang_code}' not available.")

    installed_languages = argostranslate.translate.get_installed_languages()
    try:
        from_lang = [
            lang for lang in installed_languages if lang.code == source_lang_code
        ][0]
        to_lang = [
            lang for lang in installed_languages if lang.code == "en"
        ][0]
    except Exception as e:
        raise ValueError(f"Failed to find installed argos model from '{source_lang_code}' to 'en': {e}")

    translator_model = from_lang.get_translation(to_lang)
    if translator_model is None:
        raise ValueError(f"Failed to find installed argos model from '{source_lang_code}' to 'en': {e}")
    return translator_model


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


def offline_translate(prompt):
    """Translate prompt without internet connection.

    Works in two steps: 1. Detect language with pycld2.
    2. Translate with a locally run model from detected language to English.
    """
    is_reliable, bytes_found, details = pycld2.detect(prompt, bestEffort=True)
    if not is_reliable:
        raise ValueError(f"Failed to detect language of prompt '{prompt}'")

    lang_name = details[0][0]
    lang_code = details[0][1]
    print(f"Detected language '{lang_name}' of prompt '{prompt}'")
    translator = get_argos_translator_model(lang_code)
    translated_prompt = translator.translate(prompt)

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
        try:
            prompt = offline_translate(prompt)
        except Exception as e:
            print(f"Offline translation failed: {e}")

    return prompt


def preprocess_prompt(raw_prompt):
    translated_prompt = translate_prompt(raw_prompt)
    filtered_prompt = filter_prompt(translated_prompt)
    return filtered_prompt
