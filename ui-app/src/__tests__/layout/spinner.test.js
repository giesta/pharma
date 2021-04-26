import React from 'react';
import Spinner from '../../components/layout/spinner.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const text = "Loading..."

it('Error rendering', () => {

    render(<><Spinner></Spinner></>);

    expect(screen.getByText(text)).toBeInTheDocument();
 })