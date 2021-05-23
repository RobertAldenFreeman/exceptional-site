# CSC317WebPage
Our work for CSC317

# CSC317 Backend

FASTAPI based backend for the storefront

## Getting Started


### Prerequisites

Before running the backend, you must have an updated version of python and pip. This can be tricky on OSX which is bundled with a legacy version of python that should not be modified. If unsure, this guide is recommended https://docs.python-guide.org/starting/install3/osx/


### Installing

To get the dependencies for the backend, cd into the backend folder and run

```
pip install -r requirements.txt
```


## Running the server

The server can be run with

```
uvicorn main:app --reload
```

## Accessing the docs

The documents can be accessed by running the server and going to http://localhost:8000/docs

## Working With the Backend

In general, use the documentation as much as possible and communicate ASAP about issues.

To access any privileged content (idk what that is yet, but I'm sure we'll think of something) you must provide an Authorization header containing a valid auth token obtained from the login page.

## Signup

The current signup page accepts JSON data - it may be modified to accept form data depending on what y'all want to do with the frontend. For now, a simple way to interact with it is to use something like

```
curl -X POST -H "Content-Type: application/json" --data '{"email":"foobar@foo.bar","password":"pw"}' http://localhost:8000/signup/
```

(Modify the email and password values as appropriate)
