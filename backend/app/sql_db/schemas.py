from datetime import datetime
from typing import List

from pydantic import BaseModel


class UserBase(BaseModel):
    email: str

    # order - active order
    # billing info
    # order history


class UserCreate(UserBase):
    password: str


class ProductOrder(BaseModel):
    id: int = None
    title: str = None
    quantity: int = None
    image: str = None
    price: float = None
    order_id: int = None

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)

    class Config:
        orm_mode = True


class Order(BaseModel):
    id: int = None
    owner_id: int = None
    date: datetime = None
    processed: bool = None
    price: float = None
    products: List[ProductOrder] = []
    address_id: int = None

    class Config:
        orm_mode = True


class Address(BaseModel):
    id: int = None
    user_id: int = None
    orders: List[Order] = []
    email: str = None
    firstname: str = None
    address: str = None
    city: str = None
    state: str = None
    zipCode: int = None
    type: str = None
    primary: bool = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    password_hash: str
    orders: List[Order] = []
    addresses: List[Address] = []

    class Config:
        orm_mode = True



