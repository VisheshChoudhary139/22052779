import requests

BASE_URL = "http://20.244.56.144/evaluation-service"

registration_data = {
    "email": "newemail@abc.edu",  
    "name": "Ram Krishna",
    "mobileNo": "9876543210",  
    "githubUsername": "github1",
    "rollNo": "aalbb",
    "collegeName": "ABC University",
    "accessCode": "nwpwrZ"
}

def register():
    url = f"{BASE_URL}/register"
    response = requests.post(url, json=registration_data)

    if response.status_code == 200:
        data = response.json()
        print("Registration Successful! Save your credentials.")
        print(data)
    else:
        print("Registration Failed:", response.text)

if __name__ == "__main__":
    register()
