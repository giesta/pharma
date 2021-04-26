import React from 'react';
import Footer from '../../components/layout/footer.component';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)

it('Error rendering', () => {

    render(<><Footer></Footer></>);

    expect(screen.getByText('Sveikatos politika')).toBeInTheDocument();
 })