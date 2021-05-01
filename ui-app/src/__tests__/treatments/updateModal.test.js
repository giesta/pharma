import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import TreatmentUpdate from "../../components/treatments/create-update-modal.component";
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

const initialTreatmentState = {  
    id: 2,  
    title: "Alergijos gydymas",
    description: "padidejus reakcija i aplinka",
    algorithm: "/algorithm.png",
    diagram:null,
    public: 0,
    drugs:[],
    disease: null
  };

const Treatment = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <TreatmentUpdate show ={props.show} handleClose={props.handleClose} treatment={props.initialTreatmentState} fields={props.fields}></TreatmentUpdate>   
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

  // Act
  const { getByText } = render(
    <Provider store={store}>
    <Treatment show={true} handleClose={handleClose} initialTreatmentState={initialTreatmentState} fields={[]}>
    
    </Treatment>
    </Provider>
  )

  // Assert
  expect(screen.getByDisplayValue('Alergijos gydymas')).toBeInTheDocument();
  expect(screen.getByDisplayValue('padidejus reakcija i aplinka')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)



  
})