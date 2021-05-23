from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from . import schemas, models
from passlib.hash import bcrypt


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    db_user = models.User(email=user.email, password_hash=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_order(db: Session, order: schemas.Order, user_id: int):
    db_order = models.Order(**order.dict(), owner_id=user_id, date=datetime.now, processed=False)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def get_cart(db: Session, user_id: int):
    active_order = db.query(models.Order).filter(models.Order.owner_id == user_id,
                                                 models.Order.processed == False).first()
    # print('active order:')
    # print(active_order)
    # print('products:')
    # print(active_order.products)
    if not active_order:
        return []

    return active_order.products


def add_item_to_cart(db: Session, user_id: int, item: schemas.ProductOrder):
    # for debug
    #
    # print(db.query(models.User).get(user_id).orders)
    # print(db.query(models.Order).filter(models.Order.owner_id == user_id, models.Order.processed == False).count())
    # get active order, if one is not present then make one
    #
    # pyCharm may tell you to replace == False with not - that is a LIE and SQLAlchemy will hate you for it
    # silence the warning if it bothers you
    active_order = db.query(models.Order).filter(models.Order.owner_id == user_id,
                                                 models.Order.processed == False).first()
    # print(active_order)
    if not active_order:
        # make order with appropriate price
        active_order = models.Order(owner_id=user_id, date=datetime.now(), processed=False, price=item.price)
        # add product
        new_product = models.ProductOrder(**item.dict())
        active_order.products.append(new_product)
        db.add(active_order)
        db.commit()
        db.refresh(active_order)
        return active_order
    # Check if item is already in cart
    target_item = db.query(models.ProductOrder).filter(models.ProductOrder.order_id == active_order.id,
                                                       models.ProductOrder.title == item.title).first()
    if not target_item:
        # if it's not there, add it
        active_order.products.append(models.ProductOrder(**item.dict()))

    else:
        # otherwise increment the counter
        target_item.quantity = target_item.quantity + 1
    # increment price
    active_order.price = active_order.price + item.price
    # and commit
    db.commit()
    db.refresh(active_order)
    return active_order


def remove_cart_entry(db: Session, user_id: int, item_name: str):
    active_order = db.query(models.Order).filter(models.Order.owner_id == user_id,
                                                 models.Order.processed == False).first()
    # print(active_order)
    item_quantity = 0;
    item_price = 0;
    if not active_order:
        # something is very wrong
        print("Unable to locate item to delete")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid item specified",
        )
    # Check if item is already in cart
    target_item = db.query(models.ProductOrder).filter(models.ProductOrder.order_id == active_order.id,
                                                       models.ProductOrder.title == item_name).first()
    if not target_item:
        # something is very wrong
        print("Unable to locate item to delete")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid item specified",
        )
    else:
        # otherwise delete the item
        item_quantity = target_item.quantity
        item_price = target_item.price
        db.delete(target_item)
    # decrement price
    active_order.price = active_order.price - (item_quantity * item_price)

    # check to see if item should be removed

    # and commit
    db.commit()
    db.refresh(active_order)
    return active_order


def decrement_cart_count(db: Session, user_id: int, item_name: str):
    active_order = db.query(models.Order).filter(models.Order.owner_id == user_id,
                                                 models.Order.processed == False).first()
    # print(active_order)
    if not active_order:
        # something is very wrong
        print("Unable to locate item to decrement")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid item specified",
        )
    # Check if item is already in cart
    target_item = db.query(models.ProductOrder).filter(models.ProductOrder.order_id == active_order.id,
                                                       models.ProductOrder.title == item_name).first()
    if not target_item:
        # something is very wrong
        print("Unable to locate item to decrement")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid item specified",
        )
    else:
        # otherwise decrement the counter
        target_item.quantity = target_item.quantity - 1
    # decrement price
    active_order.price = active_order.price - target_item.price

    # check to see if item should be removed
    if target_item.quantity == 0:
        db.delete(target_item)

    # and commit
    db.commit()
    db.refresh(active_order)
    return active_order


def process_order(db: Session, user_id: int, address: schemas.Address):
    active_order = db.query(models.Order).filter(models.Order.owner_id == user_id,
                                                 models.Order.processed == False).first()
    if not active_order:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid user/order specified"
        )
    create_address(db, address, user_id, active_order)
    active_order.processed = True
    db.commit()
    db.refresh(active_order)
    return active_order


def create_address(db: Session, address: schemas.Address, user_id: int, order: models.Order):
    db_address = models.Address(**address.dict())
    db_address.user_id = user_id
    db.add(db_address)
    order.address = db_address
    db.commit()
    db.refresh(db_address)
    return db_address



# def get_active_cart(db: Session, user_id: int):
#     user = get_user(db, user_id)
#     cart = db.query(user.orders).filter(not models.Order.processed)
#     if cart is None:
#         return []
#     return cart
