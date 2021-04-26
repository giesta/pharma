import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import DownloadModal from "../../components/treatments/download-modal.component";
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
    <DownloadModal buttonText={'Įtraukti'} handleCloseConfirm={props.handleClose} text={'Visa susijusi informacija gali būti perrašyta!'} name={"gydymo algoritmą"} treatment={props.initialTreatmentState} confirm={true}></DownloadModal>
    ,
    el
  )
}
let store;
beforeEach(() => {
    store = createTestStore();
  });

  

test('Treatment download modal rendering and a close button', async () => {
  // Arrange
  const handleClose = jest.fn()

  // Act
  const { getByText } = render(
    <Provider store={store}>
    <Treatment handleClose={handleClose} initialTreatmentState={initialTreatmentState}>
    
    </Treatment>
    </Provider>
  )

  // Assert
  expect(getByText(/Visa susijusi informacija gali būti perrašyta!/i)).toBeInTheDocument();
  

  // Act
  fireEvent.click(getByText(/Užverti/i))

  // Assert
  expect(handleClose).toHaveBeenCalledTimes(1)



  
})