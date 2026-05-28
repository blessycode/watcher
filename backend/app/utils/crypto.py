from base64 import urlsafe_b64decode, urlsafe_b64encode

from app.config import settings


def encrypt_value(value: str) -> str:
    key = settings.SECRET_KEY.encode("utf-8")
    raw = value.encode("utf-8")
    encrypted = bytes(byte ^ key[index % len(key)] for index, byte in enumerate(raw))
    return urlsafe_b64encode(encrypted).decode("utf-8")


def decrypt_value(value: str) -> str:
    key = settings.SECRET_KEY.encode("utf-8")
    raw = urlsafe_b64decode(value.encode("utf-8"))
    decrypted = bytes(byte ^ key[index % len(key)] for index, byte in enumerate(raw))
    return decrypted.decode("utf-8")
