import React from 'react';
import DiagramSidebar from '../../components/diagrams/sidebar';
import {render, cleanup, screen} from '@testing-library/react';

afterEach(cleanup)


it('Diagrams table rendering', () => {

    render(<><DiagramSidebar/></>);

    expect(screen.getByText('Jūs galite nuvilkti viršūnę į sudarymo langą dešinėje.')).toBeInTheDocument();
 })