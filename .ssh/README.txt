# ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
# openssl cmd will change .key.pub to need for JWT format
cat jwtRS256.key
cat jwtRS256.key.pub
