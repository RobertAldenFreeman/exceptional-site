from fastapi import Depends, FastAPI, Header, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from app.routers import signup, login, user
from app.sql_db import database, crud, models, schemas

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.include_router(
    signup.router,
    prefix="/signup",
    tags=["signup"]
)

app.include_router(
    login.router,
    prefix="/login",
    tags=["login"]
)

app.include_router(
    user.router,
    prefix="/user",
    tags=["user"]
)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url='/index.html')


app.mount("/", StaticFiles(directory=".."), name="static")
