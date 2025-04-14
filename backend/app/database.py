from google.cloud import firestore
import os
from dotenv import load_dotenv

load_dotenv()
service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not service_account_path:
    raise Exception("Missing requirement")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_path
db = firestore.Client()