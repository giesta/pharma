import React, { useCallback, useEffect } from 'react';
import UsersDataService from "../../services/users/users.service";
import UserDelete from "../delete-modal.component";
import UserInfo from "./info-modal.component";
import UserUpdate from "./create-update-modal.component";
import UsersTable from "./table.component";
import Spinner from "../layout/spinner.component";
import { BsPen, BsTrash, BsInfoCircle} from "react-icons/bs";

export default function UsersTable() {

  const initialUserState = {  
    id: null,  
    name: "",
    email: "",
  };

  const [user, setUser] = React.useState(initialUserState);
  const [users, setUsers] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  
  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
        handleInputChange(event); 
        updateUser();
    }
    setValidated(true);       
  };

  const handleClose = () =>{
    newUser();
    setShow(false);
    setValidated(false);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newUser();
    setInfo(false);
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  useEffect(()=>{
        retrieveUsers();
  }, []);
  const retrieveUsers = () => {
    UsersDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setUsers({...users, data: response.data.data});
        }       
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  const GetActionFormat = useCallback((row) =>{
    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setUser(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setUser(row); setShow(true)}}>
                <BsPen></BsPen>
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm"onClick={
              function(event){ setId(row.id); setConfirm(true)}}>
            <BsTrash></BsTrash>
            </button>
        </td>
    );
});

const deleteItemFromState = (id) => {
  const updatedItems = users.data.filter(x=>x.id!==id)
  setUsers({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'email',  
    text: 'Email',  
    sort: true  },   
    {
        text: 'Actions',
        dataField: 'Actions',
        editable: false 
     } 
];

const updateUser = () => {
  var data = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  UsersDataService.update(data.id, data)
    .then(response => {
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      });
      handleClose();
      const updatedItems = users.data.filter(x=>x.id!==user.id)
      updatedItems.push(response.data.data);
      setUsers({...users, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteUser = (id) => {
  UsersDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newUser = () => {
  setUser(initialUserState);
};


  return (
    <div>
      {users?(
      users.data.length===0?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">        
      <>
      {UsersTable(columns, users, GetActionFormat)}

      { UsersUpdate(show, handleClose, user, validated, handleSubmit, handleInputChange) }

      { UsersDelete(id, "User", deleteUser, handleCloseConfirm, confirm) }

      { UsersInfo(info, user, handleCloseInfo) }     
      
      
</>
  </div>  )
    ):(<div>
      <br />
      <p>Please click on a Tutorial...</p>
    </div>)
      
    }</div>
    
    
  );
}