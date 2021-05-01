import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import DiseaseInfo from "../../components/diseases/info-modal.component";

const modalRoot = document.createElement('div')
modalRoot.setAttribute('id', 'modal-root')
document.body.appendChild(modalRoot)

const disease = { name: 'Alergija', description: 'padidejes jautrumas', symptoms: [],};

const DiseaseI = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <DiseaseInfo info={props.info} disease={disease} handleCloseInfo={props.handleCloseInfo}/>    
    ,
    el
  )
}

test('modal shows the disease and a close button', () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <DiseaseI info={true} disease={disease} handleCloseInfo={handleClose}>
    
    </DiseaseI>
  )
  // Assert
  expect(screen.getByDisplayValue('Alergija')).toBeInTheDocument();
  expect(screen.getByDisplayValue('padidejes jautrumas')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)
})