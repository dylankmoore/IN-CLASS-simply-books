import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { viewAuthorDetails } from '../../api/mergedData';
import BookCard from '../../components/BookCard';

export default function ViewAuthor() {
  const [authorDetails, setAuthorDetails] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

  useEffect(() => viewAuthorDetails(firebaseKey).then(setAuthorDetails), [firebaseKey]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="text-white ms-5 details">
        <h5>
          {authorDetails.first_name} {authorDetails.last_name}
          <p>{authorDetails.email}</p>
          {authorDetails.favorite ? <Button variant="success"> FAVORITE </Button> : ''}
        </h5>
        <Link href={`/author/edit/${authorDetails.firebaseKey}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <div className="mt-5 d-flex flex-wrap">
          { authorDetails.books?.map((book) => <BookCard bookObj={book} onUpdate={viewAuthorDetails} />)}
        </div>
      </div>
    </div>
  );
}
