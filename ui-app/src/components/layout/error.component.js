import React from 'react';
import { Alert } from "react-bootstrap";
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: true};
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <Alert variant={'danger'} onClose={this.props.handleCose}>{this.props.text}</Alert>;
      }
  
      return this.props.children; 
    }
  }
  export default ErrorBoundary;