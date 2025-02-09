from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str
    role: str  # 'student' or 'instructor'

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
