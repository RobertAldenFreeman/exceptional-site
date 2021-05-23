from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .login import get_current_user
from ..sql_db import models, schemas, crud
from ..sql_db.database import get_db
from ..sql_db.schemas import Order

# functions at this point require authentication

router = APIRouter()


# untested
@router.get('/cart/', response_model=List[schemas.ProductOrder])
async def get_cart(user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    retval = crud.get_cart(db, user.id)
    print(retval)
    return retval


# tested once - needs much more
@router.post('/cart/add/')
async def add_to_cart(item: schemas.ProductOrder, db: Session = Depends(get_db),
                      user: schemas.User = Depends(get_current_user)):
    retval = crud.add_item_to_cart(db, user.id, item)
    print(retval)
    return retval


# untested
@router.post('/cart/remove/')
async def remove_from_cart(item: schemas.ProductOrder, db: Session = Depends(get_db),
                           user: schemas.User = Depends(get_current_user)):
    return crud.remove_cart_entry(db, user.id, item.title)


# untested
@router.post('/cart/decrement/')
async def decrement_item(item: schemas.ProductOrder, db: Session = Depends(get_db), user: schemas.User = Depends(get_current_user)):
    return crud.decrement_cart_count(db, user.id, item.title)


@router.post('/checkout/')
async def process_order(firstname: str = Form(None), email: str = Form(None), address: str = Form(None),
                        city: str = Form(None), state: str = Form(None), zipCode: int = Form(None),
                        user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    address_schema = schemas.Address(firstname=firstname, email=email, address=address, city=city, state=state,
                                     zipCode=zipCode, user_id=user.id, type="Billing", primary=True)
    retval = crud.process_order(db, user.id, address_schema)
    # retval = crud.create_address(db, address_schema)
    return retval


@router.get('/', response_model=schemas.User)
async def get_user(user: schemas.User = Depends(get_current_user)):
    return user




# router.post('/cart/')
# async def set_cart(cart: List[schemas.ProductOrder], db: Session = Depends(get_db),
#                    user: schemas.User = Depends(get_current_user)):
#     for record in user.orders:
#         # try to get an active cart
#         if not record.processed:
#             db.delete(record)
#     price = 0.0
#     for item in cart:
#         price += item.price
#     db_cart = models.Order()
