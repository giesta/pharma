import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent } from '@testing-library/react'
import TreatmentCreate from "../../components/treatments/create-update-modal.component";
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
    id: null,  
    title: "",
    description: "",
    algorithm: "",
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
    <TreatmentCreate show ={props.show} handleClose={props.handleClose} treatment={props.initialTreatmentState} fields={props.fields}></TreatmentCreate>   
    ,
    el
  )
}
let store;
beforeEach(() => {
    store = createTestStore();
  });

  

test('Treatment create modal rendering and a close button', async () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <Provider store={store}>
    <Treatment show={true} handleClose={handleClose} initialTreatmentState={initialTreatmentState} fields={[]}>
    
    </Treatment>
    </Provider>
  )

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)



  
})