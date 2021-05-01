import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import DrugInfo from "../../components/drugs/info-modal.component";

const modalRoot = document.createElement('div')
modalRoot.setAttribute('id', 'modal-root')
document.body.appendChild(modalRoot)

const drug = {
  id: 1,  
  name: "prospan",
  substance: "Gebenes",
  ATC:"121212a",
  strength:"20mg",
  form:"tabletes",
  package:"lapelis",
  package_description:"N10",
  registration:"Registruotas",
};

const DrugI = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <DrugInfo info={props.info} drug={drug} handleCloseInfo={props.handleCloseInfo}/>    
    ,
    el
  )
}

test('modal shows the drug and a close button', () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <DrugI info={true} drug={drug} handleCloseInfo={handleClose}>
    
    </DrugI>
  )
  // Assert
  expect(screen.getByText('Gebenes')).toBeInTheDocument();
  expect(screen.getByText('prospan')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)
})