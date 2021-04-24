import React from 'react';

import { Modal, Button, Form, Col, InputGroup } from "react-bootstrap";
import ErrorBoundary from "../layout/error.component";
import { connect } from "react-redux";
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().email('Blogas el. pašto adreso formatas').required('El. pašto adresas yra privalomas'),
    password: yup.string().min(6, 'Slaptažodis per trumpas - mažiausiai turi būti 6 simboliai.'),
    passwordConfirmation: yup.string()
    .test('passwords-match', 'Slaptažodžiai privalo sutapti', function(value){
      return this.parent.password === value
    }),
  });


const mapStateToProps = state => {
        return { errors: state.rootReducer.errors };
      };
      
const CreateModal=(props)=> (
        
        <Modal show={props.show} onHide={props.handleClose}>

      <Modal.Header closeButton>
                <Modal.Title>Naudotojo informacija</Modal.Title>
            </Modal.Header>
            {props.errors.length > 0 ?<ErrorBoundary text={props.errors.map(item=>item)} handleClose={props.handleClose}/>:''}
                
            <Formik
      validationSchema={schema}
      onSubmit={props.handleSubmit}
      initialValues={{
        username: '',
        email:props.user.email,
        password: '',
        passwordConfirmation:'',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
      }) => (<Form noValidate onSubmit={handleSubmit}>
        <Modal.Body> 
        
            <Form.Group controlId="username">
              <Form.Label>Vardas</Form.Label>
              <Form.Control plaintext readOnly defaultValue={props.user.name} />              
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>El. paštas</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />

                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Slaptažodis</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />

              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="passwordConfirmation">
              <Form.Label>Slaptažodžio patvirtinimas</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                name="passwordConfirmation"
                value={values.passwordConfirmation}
                onChange={handleChange}
                isInvalid={!!errors.passwordConfirmation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation}
              </Form.Control.Feedback>
            </Form.Group>          
        </Modal.Body> 
      
    
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Užverti
                </Button>
                {<Button type="submit" variant="primary">
                    Atnaujinti
                </Button>}          
            </Modal.Footer>
            </Form>)}
            </Formik>
        </Modal>
   
);
const Creation = connect(mapStateToProps)(CreateModal);
export default Creation;