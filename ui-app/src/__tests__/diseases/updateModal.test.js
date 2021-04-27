import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen} from '@testing-library/react'
import DiseaseUpdate from "../../components/diseases/create-update-modal.component";
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

  const initialDiseaseState = {  
    id: 1,
    description: "Alergija yra padidejes jautrumas aplinkai",
    diagnosis: "Galima atlikti tolerancijos testa",
    prevention: "Naudoti apsaugini sluoksni",
    disease_id:"1",
    symptoms: [],
    drugs: []
  };

const Disease = (props) => {
  const el = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => modalRoot.removeChild(el)
  })

  return ReactDOM.createPortal(
    <DiseaseUpdate show ={props.show} handleClose={props.handleClose} disease={props.initialDiseaseState} fields={props.fields}></DiseaseUpdate>   
    ,
    el
  )
}
let store;
beforeEach(() => {
    store = createTestStore();
  });

  

test('Disease create modal rendering and a close button', async () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <Provider store={store}>
    <Disease show={true} handleClose={handleClose} initialDiseaseState={initialDiseaseState} fields={[]}>
    
    </Disease>
    </Provider>
  )

  // Assert
  expect(screen.getByDisplayValue('Alergija yra padidejes jautrumas aplinkai')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Galima atlikti tolerancijos testa')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Naudoti apsaugini sluoksni')).toBeInTheDocument();

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)



  
})