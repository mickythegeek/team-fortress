---
module: interswitch
feature: authentication
source: https://docs.interswitchgroup.com/docs/authentication
audience: developer
title: Authentication - OAuth 2.0 and InterswitchAuth
---

# Authentication - OAuth 2.0 and InterswitchAuth

Primarily, we use two types of authentication which we call Oauth 2.0 and InterswitchAuth.
OAuth 2.0: Here, you will call our system to get an access token which must be attached to the header of your request. This will authenticate that you are permitted to use the service.
Interswitch Auth: This is for our existing legacy application users where you need to generate certain parameters such as nonce, signature, timestamp, and signature method. All these parameters are to be attached to the header of every request.
Generally, you are provided with Public and secret keys. Public keys are by design used for front-end when integrating using Interswitch's inline or in our mobile 
SDK
s Only, however, public keys cannot change any part of your account besides initiating transactions with you.
The Secret keys are to be kept secret, this key can be reset at any time on your dashboard if you believe it has been compromised.
ALL API REQUESTS MUST BE MADE OVER HTTPS.
API requests without authentication will fail with  
Status
 code 401, which means unauthorized.
OAuth 2.0
An access token is generated in this process
How to generate my Access Token
To generate an access token, you need to convert your client ID and secret key into a Base64 encoded string. This process typically involves concatenating the client ID and secret key with a colon (:) and then encoding the resulting string using Base64.
Concatenate the client ID and secret key with a colon (:) separator :
Client ID: Your Client ID
Secret Key: Your Secret Key
Concatenated String: Your Client ID: Your Secret Key
NOTE
Your CLIENT_ID and SECRET_KEY can be gotten from your 
Quickteller Business Dashboard
. You can also get them on your developer console profile, or it would be shared to you by your integration partner.
Encode the concatenated string to Base64.
Here are code snippets in different programming languages to convert your client ID and secret key to Base64.
Java
Javascript
Python
//In Java, you can use the Base64 class available in java.util package.
import java.util.Base64;
public class Main {
    public static void main(String[] args) {
        // Define your client ID and secret key
        String clientId = "your client ID";
        String secretKey = "Your secret key";
        // Concatenate with a colon
        String concatenatedString = clientId + ":" + secretKey;
        // Encode to Base64
        String encodedString = Base64.getEncoder().encodeToString(concatenatedString.getBytes());
        // Output the Base64 encoded string
        System.out.println("Base64 Encoded String: " + encodedString);
//In JavaScript, you can use the btoa function for Base64 encoding.
// Define your client ID and secret key
const clientId = "Your client ID";
const secretKey = "Your secret key";
// Concatenate with a colon
const concatenatedString = `${clientId}:${secretKey}`;
// Encode to Base64
const encodedString = btoa(concatenatedString);
// Output the Base64 encoded string
console.log("Base64 Encoded String:", encodedString);
//In Python, you can use the base64 module to encode your client ID and secret key.
import base64
# Define your client ID and secret key
client_id = "Your client ID"
secret_key = "Your Secret Key"
# Concatenate with a colon
concatenated_string = f"{client_id}:{secret_key}"
# Encode to Base64
encoded_bytes = base64.b64encode(concatenated_string.encode("utf-8"))
encoded_string = encoded_bytes.decode("utf-8")
# Output the Base64 encoded string
print("Base64 Encoded String:", encoded_string)
//In C#, you can use the Convert class to encode your client ID and secret key.
using System;
class Program
    static void Main()
        // Define your client ID and secret key
        string clientId = "Your client ID";
        string secretKey = "Your secret Key";
        // Concatenate with a colon
        string concatenatedString = $"{clientId}:{secretKey}";
        // Encode to Base64
        byte[] bytesToEncode = System.Text.Encoding.UTF8.GetBytes(concatenatedString);
        string encodedString = Convert.ToBase64String(bytesToEncode);
        // Output the Base64 encoded string
        Console.WriteLine("Base64 Encoded String: " + encodedString);
The encoded string generated should be like the
JSON
Base64 Encoded String: SUtJQTYxQzA1NjAzREFBQTUssEUyRjREMzE2RkZGQTk1NzFDM0YzsjsjsMzY6OWJlUm5BTk53OXFqQTVm
Use the Base64 encoded string as required for authentication or generating an access token to make a call to the 
generate access token 
endpoint
cURL
curl -X POST 'https://qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials' \
-H "Authorization: Basic SUtJQTYxQzA1NjAzREFBQTU1REUyRjREMzE2RkZGQTk1NzFDM0YzMTgxMzY6OWJlUm5BTk53OXFqQTVm" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d 'grant_type=client_credentials'
Your response should appear in the format below:
JSON
    "access_token": "eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiY2Flc2FyIiwiY2FyZGxlc3Mtc2VydmljZSIsImNyZWRpdC1zY29yZS1zZXJ2aWNlIiwiZGlyZWN0LXRvLWFjY291bnQiLCJpbmNvZ25pdG8iLCJpc3ctY29sbGVjdGlvbnMiLCJpc3ctY29yZSIsImlzdy1sZW5kaW5nLXNlcnZpY2UiLCJpc3ctcGF5bWVudGdhdGV3YXkiLCJwYXNzcG9ydCIsInBheW1lbnQtc2VydmljZSIsInBheW1lbnRzZXJ2aWNlIiwicHJvamVjdC14LWNvbnN1bWVyIiwicHJvamVjdC14LW1lcmNoYW50IiwicHdtIiwidmF1bHQiLCJ2b3VjaGVyLWFwaSIsIndhbGxldCJdLCJtZXJjaGFudF9jb2RlIjoiTVgxODciLCJwcm9kdWN0aW9uX3BheW1lbnRfY29kZSI6IjAwMTY0NjM5ODU0IiwicmVxdWVzdG9yX2lkIjoiMDAxMTc2MTQ5OTIiLCJzY29wZSI6WyJwcm9maWxlIl0sImV4cCI6MTYyNzYzOTU4NywianRpIjoiYTUzNTI0NjUtMzc1Yy00YmRiLWIwZmYtMDI1NDE1NjM5YmVjIiwicGF5YWJsZV9pZCI6IjIzMjQiLCJjbGllbnRfaWQiOiJJS0lBOTYxNEI4MjA2NEQ2MzJFOUI2NDE4REYzNThBNkE0QUVBODRENzIxOCIsInBheW1lbnRfY29kZSI6IjA0MjU5NDEzMDI0NiJ9.AqYq_5BMyVN49QWEqmoc6ZN7YXAdxK3WP4cijKLlTPcEmvzeDYUhZOu2J3-eMxEr1-46OGiMbCGQ2ezyz0oAfjeURpQ42-6P6eNXdXJrhYPGoALGsoz1Gwa66s6i8Lwq81n9PEkdQN8b6B0Gm-vQqWNl7OEWM2rZ8EotjlwbQn2vbMVlQPKvIXw--38IF-fdhq0VUbP6MKm9YVWxvcyEqhU6nAZnoEtG73U1aZSSA0bfjmAs0xmUCScURg9ufGCVn47J82UEkErUBJJTJg1SQ4bZkkWKJIDrd7S0-bUA_42cWb7y7PtwJYM4FJv94Ew_0ky9kv5dpv19ecgEfHvKCQ",
    "token_type": "bearer",
    "expires_in": 86400,
    "scope": "profile",
    "merchant_code": "MX18227",
    "production_payment_code": "00164639854",
    "requestor_id": "0055614992",
    "payable_id": "2324",
    "jti": "a5352465-375c-4bdb-b0ff-025415639bec"
The Access token expires in the time returned by the expires_in value in the response. This value is in seconds. You can reuse the same access token for your calls till it expires.
STEP 2: Make an API call to any of our endpoints.
Say you want to make a call to the 
Card Payment API
, you can use the generated access token as shown below:
cURL
curl https://api.interswitchng.com/api/v3/purchases\
-H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.ey.my47J82UEkErUBJJTJg1SQ4bZkkWKJIDrd7S0-bUA_42cWb7y7PtwJYM4FJv94Ew_0ky9kv5dpv19ecgEfHvKCQ" \
-H "Content-Type: application/json" \
-d '{
    "customerId": "1407002510",
    "amount": "20000",
    "transactionRef": "12n345mmm0km655",
    "currency": "NGN",
    "authData": "abcde=="
-X POST
Interswitch Auth (Legacy Systems)
Authentication
To use the endpoints for this service, you need to send the following HTTP header parameters with every request.
S/N
Header Parameter
Description
Timestamp
Request timestamp in unix. It must be in seconds
Nonce
A uniquely generated value for each request. It must not be repeated and the length must NOT be more than 64 characters
Authorization
The describes the realm and identity of the user requesting access to the resource.
Signature
This must be represented in base 64. The signature is calculated from a combination of defined data elements separated by '&'.
SignatureMethod
This refers to the cryptographic hash function used to calculate the signature e.g SHA1
Content-Type
This is the MIME type of the body of the request e.g application/json.
Authorization Computation
All messages must be authorized using the standard 'Basic' authorization model of the web. The HTTP header authorization should be set to the base 64 encoded value of your client ID which can be gotten from your 
dashboard
PHP
'InterswitchAuth ' . base64_encode(CLIENT_ID);
Signature Computation
The signature method should be SHA1 calculated against the data elements in the table above arranged in the order shown below:
PHP
$signature = 'GET' . '&' . urlencode($endpoint) . '&' . time()
    					. '&' . $nonce . '&' . <CLIENT_ID> . '&' . <SECRET_KEY>;
$hashedSignature = base64_encode(sha1($signature, true));
NOTE: CLIENT_ID and SECRET_KEY can be gotten from your 
dashboard
Remember nonce is a uniquely generated value for each request which must have been generated earlier.
Sample Authentication Headers
Below is a sample authentication header
JSON
  "Authorization": "InterswitchAuth SUtJQUVFMzhDMjRBMzYzRTRGQzAxREVCRkJGRTlGOERDMUY0QkNCMkJDNDg=",
  "Content-Type": "application/json",
  "Nonce": "091f90dbbf9748f0b2854a038dbdac44",
  "SignatureMethod": "SHA1",
  "Signature": "mf73jzzhaVN8U0oZ7iiKcVgEzBY=",
  "Timestamp": "1440071245" 
Updated
about 1 month ago
Ask AI
