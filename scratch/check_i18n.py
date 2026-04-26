import json
import os

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_keys(data, prefix=''):
    keys = set()
    for k, v in data.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys(v, full_key))
        else:
            keys.add(full_key)
    return keys

ru = load_json('app/locales/ru.json')
en = load_json('app/locales/en.json')

ru_keys = get_keys(ru)
en_keys = get_keys(en)

print(f"RU keys: {len(ru_keys)}")
print(f"EN keys: {len(en_keys)}")

only_ru = ru_keys - en_keys
only_en = en_keys - ru_keys

if only_ru:
    print(f"Keys only in RU: {only_ru}")
if only_en:
    print(f"Keys only in EN: {only_en}")

# Check for identical values (untranslated)
def check_untranslated(ru_data, en_data, prefix=''):
    untranslated = []
    for k, v in ru_data.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            if k in en_data and isinstance(en_data[k], dict):
                untranslated.extend(check_untranslated(v, en_data[k], full_key))
        else:
            if k in en_data and v == en_data[k] and v.strip() != "" and not v.isdigit():
                # Some words are same in both languages (e.g. "Shorts", "NewTube")
                if v.lower() not in ["shorts", "newtube", "email", "admin", "login", "logout", "cancel", "status", "action", "actions", "publish", "block", "hide", "role", "promote", "demote", "video", "videos", "shorts"]:
                    untranslated.append(full_key)
    return untranslated

untranslated = check_untranslated(ru, en)
if untranslated:
    print(f"Potentially untranslated keys (same value in RU and EN): {untranslated}")
