import requests
import json
import base64

def test():
    client_id = "IKIAB23A4E2756605C1ABC33CE3C287E27267F660D61"
    secret = "secret"
    auth_str = f"{client_id}:{secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()
    
    token_url = "https://qa.interswitchng.com/passport/oauth/token"
    token_headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    print("STEP 1: Generating Token...")
    try:
        t_res = requests.post(token_url, data={"grant_type": "client_credentials"}, headers=token_headers)
        print("Token HTTP Status:", t_res.status_code)
        if t_res.status_code != 200:
            print("Token Error Response:", t_res.text)
            return
            
        token = t_res.json().get("access_token")
        print("Successfully generated Access Token ending in:", token[-10:])
        
        print("\nSTEP 2: Executing Sandbox Payment (WITH Token)...")
        url = "https://qa.interswitchng.com/collections/api/v1/pay-bill"
        payload = {
            "merchantCode": "MX6072",
            "payableCode": "9405967",
            "amount": "10000",
            "redirectUrl": "https://localhost:8780/payment-success",
            "customerId": "v@example.com",
            "currencyCode": "566",
            "customerEmail": "v@example.com"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        p_res = requests.post(url, json=payload, headers=headers)
        print("Pay-bill HTTP Status:", p_res.status_code)
        print("Pay-bill Response Headers:", p_res.headers)
        print("Pay-bill Response Text:", p_res.text[:500])
        
    except Exception as e:
        print("Exception occurred:", e)

if __name__ == "__main__":
    test()
