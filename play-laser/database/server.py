from pymongo import MongoClient
import bcrypt
import certifi

# connect to MongoDB
client = MongoClient('mongodb+srv://wendytto:CEN3907c@playzercluster.sffrt.mongodb.net/', tlsCAFile=certifi.where())
db = client['login']  # database name
collection = db['user']   # collection name

# user rgistration function
def register_user(username, password):
    # check if username exists
    if collection.find_one({"username": username}):
        print("Username already exists.")
        return False
    
    # hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # new login
    user_data = {
        "username": username,
        "password": hashed_password
    }

    # insert new user into collection
    collection.insert_one(user_data)
    print("User registered successfully.")
    return True

# user authentication function
def authenticate_user(username, password):
    user = collection.find_one({"username": username})
    
    if user:
        # does password match hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            print("Login successful!")
            return True
        else:
            print("Incorrect password.")
            return False
    else:
        print("User not found.")
        return False

# test
if __name__ == "__main__":
    register_user("testuser", "mypassword")
    authenticate_user("testuser", "mypassword")
