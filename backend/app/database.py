from google.cloud import firestore
from google.oauth2 import service_account
import os
import json
from dotenv import load_dotenv

load_dotenv()
raw = os.getenv("FIREBASE_CREDENTIALS")
if not raw:
    raise RuntimeError("Missing FIREBASE_CREDENTIALS var")

info = json.loads(raw)

creds = service_account.Credentials.from_service_account_info(info)

db = firestore.Client(credentials=creds, project=info["project_id"])
