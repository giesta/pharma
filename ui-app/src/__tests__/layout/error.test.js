import React from 'react';
import Error from '../../components/layout/error.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

const text = "Failed"

it('Error rendering', () => {

    render(<><Error text={text}></Error></>);

    expect(screen.getByText(text)).toBeInTheDocument();
 })