/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Card, Button, CardBody } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getBooksNotInTheOrder, getOrderDetails } from '../../api/mergedData';
import { updateOrderBook, createOrderBook } from '../../api/orderBookData';

export default function ViewBookOrderDetails() {
  const { user } = useAuth();
  const [bookDetails, setBookDetails] = useState([]);
  const [booksNotInOrder, setBooksNotInOrder] = useState([]);

  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getBooksNotInTheOrder(user.uid, firebaseKey).then(setBooksNotInOrder);
    getOrderDetails(firebaseKey).then(setBookDetails);
  }, [bookDetails.orderBooks]);

  const handlingBookOrder = (bookFirebaseKey) => {
    // when the add to cart button is pressed and entry needs to be added in orderBooks table. this entry should include the following: the orderId (firebaseKey), the book fbk, and it should have an fbk of its own.
    const payload = {
      orderId: firebaseKey,
      bookId: bookFirebaseKey,
    };

    createOrderBook(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateOrderBook(patchPayload).then(router.push(`/order/${firebaseKey}`));
    });
  };

  console.warn(bookDetails);

  return (
    <>
      <div>
        <h6 className="text-white mt-5"> BOOKS IN CART </h6>
        <h6 className="text-white mt-5"> Total: {bookDetails.orderBooks?.reduce((acc, curr) => Number(acc) + Number(curr.price), 0).toFixed(2)}</h6>
        <div className="mb-3 text-white mt-5" style={{ display: 'flex' }}>
          {bookDetails.orderBooks?.map((book) => (
            <Card style={{ width: '18rem', margin: '10px' }}>
              <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: '400px' }} />
              <CardBody>
                <Card.Title>{book.title}</Card.Title>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h6 className="text-white mt-5"> ADD BOOKS TO CART </h6>
        <div className="mb-3 text-white mt-5" style={{ display: 'flex' }}>
          {booksNotInOrder.map((book) => (
            <Card style={{ width: '18rem', margin: '10px' }}>
              <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: '400px' }} />
              <CardBody>
                <Card.Title>{book.title}</Card.Title>
                <p className="card-text bold">{book.sale && <span>SALE<br /></span> } ${book.price}</p>
                <Button variant="success" className="m-2" onClick={() => handlingBookOrder(book.firebaseKey)}>ADD TO CART</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
