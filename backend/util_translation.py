import sys
import argostranslate.package, argostranslate.translate
import deepl
import pycld2

from setup import argos_model_names
import config


def online_translate(prompt):
    """Detect language of prompt and translate it to English using DeepL API."""
    translator = deepl.Translator(config.DEEPL_AUTH_KEY)
    res = translator.translate_text(prompt, target_lang="EN-US")
    translated_prompt = res.text
    print(f"---> Translated prompt '{prompt}' from {res.detected_source_lang} and got '{translated_prompt}'", file=sys.stderr)
    return translated_prompt, res.detected_source_lang


def get_argos_translator_model(source_lang_code):
    if source_lang_code not in argos_model_names:
        raise ValueError(f"Offline model for language '{source_lang_code}' not available.")

    installed_languages = argostranslate.translate.get_installed_languages()
    try:
        from_lang = [lang for lang in installed_languages if lang.code == source_lang_code][0]
        to_lang = [lang for lang in installed_languages if lang.code == "en"][0]
    except Exception as e:
        raise ValueError(f"Failed to find installed argos model from '{source_lang_code}' to 'en': {e}")

    translator_model = from_lang.get_translation(to_lang)
    if translator_model is None:
        raise ValueError(f"Failed to find installed argos model from '{source_lang_code}' to 'en': {e}")
    return translator_model


def offline_translate(prompt):
    """Translate prompt without internet connection.

    Works in two steps: 1. Detect language with pycld2.
    2. Translate with a locally run model from detected language to English.
    """
    is_reliable, _, details = pycld2.detect(prompt, bestEffort=True)
    if not is_reliable:
        raise ValueError(f"Failed to detect language of prompt '{prompt}'")

    lang_name = details[0][0]
    lang_code = details[0][1]
    print(f"---> Detected language '{lang_name}' of prompt '{prompt}'", file=sys.stderr)
    if lang_code != 'en':
        translator = get_argos_translator_model(lang_code)
        prompt = translator.translate(prompt)

    return prompt, lang_code.upper()


def translate_prompt(prompt):
    """Returns tuple of (translated_prompt, detected_language)"""
    if config.ONLINE_TRANSLATION:
        try:
            return online_translate(prompt)
        except Exception as e:
            print(f"---> Online translation failed: {e}", file=sys.stderr)

    if config.OFFLINE_TRANSLATION:
        try:
            return offline_translate(prompt)
        except Exception as e:
            print(f"---> Offline translation failed: {e}", file=sys.stderr)

    return prompt, None
