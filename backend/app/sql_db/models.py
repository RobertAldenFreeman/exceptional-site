from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    orders = relationship("Order", back_populates="owner", cascade="all, delete-orphan", passive_deletes=True)
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    # order - active order
    # billing info
    # order history

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    owner = relationship("User", back_populates="orders")
    date = Column(DateTime, index=True)
    processed = Column(Boolean)
    price = Column(Float, default=0.0)
    products = relationship("ProductOrder", back_populates="order", cascade="all, delete-orphan", passive_deletes=True)
    address_id = Column(Integer, ForeignKey("addresses.id"))
    address = relationship("Address", back_populates="orders")

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)


class ProductOrder(Base):
    __tablename__ = "product_orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    quantity = Column(Integer)
    image = Column(String)
    price = Column(Float)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    order = relationship("Order", back_populates="products")

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="address")
    email = Column(String)
    firstname = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zipCode = Column(Integer)
    type = Column(String)
    primary = Column(Boolean)

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)
