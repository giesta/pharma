import React from 'react';
import CSV from '../../components/drugs/uploadCSV.component';
import {render, cleanup, screen} from '@testing-library/react';

const buttonTitle = "Issaugoti";

afterEach(cleanup)

it('Users table rendering', () => {

    render(<><CSV buttonTitle ={buttonTitle}/></>);

    expect(screen.getByText(buttonTitle)).toBeInTheDocument();
 })