import React from 'react';
import Navbar from '../../components/layout/navbar.component';
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


const user = { name: 'shiler', email: 'a@a.com', role: "admin",};
const showAdminBoard = true;
const showPharmacistBoard = false;

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
afterEach(cleanup)

it('Navbar rendering', () => {

    // Arrange
  const logOut = jest.fn()

    render(<> <MemoryRouter><Navbar showPharmacistBoard = {showPharmacistBoard} showAdminBoard = {showAdminBoard} currentUser = {user} logOut = {logOut} /></MemoryRouter></>);

    expect(screen.getByText('shiler')).toBeInTheDocument();

    // Act
  fireEvent.click(screen.getByText('Atsijungti'))

  // Assert
  expect(logOut).toHaveBeenCalledTimes(1)
 })