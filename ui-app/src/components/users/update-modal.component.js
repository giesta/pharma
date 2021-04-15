import React from 'react';

import { Modal, Button, Form, Col, InputGroup } from "react-bootstrap";
import ErrorBoundary from "../layout/error.component";
import { connect } from "react-redux";
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().email('A valid email is required').required(),
    password: yup.string().min(6, 'Password is too short - should be 6 chars minimum.'),
    passwordConfirmation: yup.string()
    .test('passwords-match', 'Passwords must match', function(value){
      return this.parent.password === value
    }),
  });


const mapStateToProps = state => {
        return { errors: state.rootReducer.errors };
      };
      
const CreateModal=(props)=> (
        
        <Modal show={props.show} onHide={props.handleClose}>

      <Modal.Header closeButton>
                <Modal.Title>User info</Modal.Title>
            </Modal.Header>

            {console.log(props.errors)}
            {props.errors.length > 0 ?<ErrorBoundary text={props.errors.map(item=>item)}/>:''}
                
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
              <Form.Label>Username</Form.Label>
              <Form.Control plaintext readOnly defaultValue={props.user.name} />              
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
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
              <Form.Label>Password</Form.Label>
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
              <Form.Label>Password Confirmation</Form.Label>
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
                    Close
                </Button>
                {<Button type="submit" variant="primary">
                    Update User
                </Button>}          
            </Modal.Footer>
            </Form>)}
            </Formik>
        </Modal>
   
);
const Creation = connect(mapStateToProps)(CreateModal);
export default Creation;