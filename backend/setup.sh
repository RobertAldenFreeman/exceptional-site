sudo apt install python3
sudo apt install python3-pip
sudo pip install virtualenv
virtualenv -p /usr/local/python3 venv
source venv/bin/activate
pip install -r requirements.txt
pip install async-exit-stack async-generator
