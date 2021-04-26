import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import UserInfo from "../../components/users/info-modal.component";

const modalRoot = document.createElement('div')
modalRoot.setAttribute('id', 'modal-root')
document.body.appendChild(modalRoot)

const user = { name: 'shiler', email: 'a@a.com',};

const UserI = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <UserInfo info={props.info} user={user} handleCloseInfo={props.handleCloseInfo}/>    
    ,
    el
  )
}

test('modal shows the user and a close button', () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <UserI info={true} user={user} handleCloseInfo={handleClose}>
    
    </UserI>
  )
  // Assert
  expect(screen.getByDisplayValue('shiler')).toBeInTheDocument();
  expect(screen.getByDisplayValue('a@a.com')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)
})