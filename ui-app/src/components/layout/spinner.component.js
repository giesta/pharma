import React from 'react';

import { Spinner } from "react-bootstrap";

export default function SpinnerItem() {

    return (
        <div className="text-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
    );
}