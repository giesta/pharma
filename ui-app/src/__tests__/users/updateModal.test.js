import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import UserUpdate from "../../components/users/update-modal.component";
import { Modal, Button, Form } from "react-bootstrap";
import { createStore, applyMiddleware } from "redux";
import reducers from "../../js/reducers";
import randomId from "../../js/middlewares/randomId";
import { Provider } from "react-redux";

const enhancer = applyMiddleware(randomId);
export function createTestStore() {
    const store = createStore(reducers, enhancer);
    return store;
  }

const modalRoot = document.createElement('div')
modalRoot.setAttribute('id', 'modal-root')
document.body.appendChild(modalRoot)

const user = { name: 'shiler', email: 'a@a.com',};

const UserU = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <UserUpdate show ={props.show} handleClose={props.handleClose} user={user} handleSubmit={props.handleSubmit}></UserUpdate>   
    ,
    el
  )
}
let store;
beforeEach(() => {
    store = createTestStore();
  });

  

test('modal shows the children and a close button', async () => {
  // Arrange
  const handleClose = jest.fn()
  const handleSubmit = jest.fn()

  // Act
  const { getByText } = render(
    <Provider store={store}>
    <UserU show={true} user={user} handleClose={handleClose} handleSubmit={handleSubmit}>
    
    </UserU>
    </Provider>
  )
  // Assert
  expect(screen.getByDisplayValue('shiler')).toBeInTheDocument();
  expect(screen.getByDisplayValue('a@a.com')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)

  // Act
  fireEvent.click(getByText(/Atnaujinti/i))
  await waitFor(() =>
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'a@a.com',
    username: '',
    password: "",
    passwordConfirmation: "",
  }, expect.anything())
)


  
})