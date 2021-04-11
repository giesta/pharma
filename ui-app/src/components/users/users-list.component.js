import React, { useEffect } from 'react';
import UsersDataService from "../../services/users/users.service";
import UserDelete from "../delete-modal.component";
import UserInfo from "./info-modal.component";
import UserUpdate from "./update-modal.component";
import UsersTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle} from "react-icons/bs";
import { removeError } from "../../js/actions/index";
import store from "../../js/store/index";


export default function UsersList() {

  const initialUserState = {  
    id: null,  
    name: "",
    email: "",
  };

  const [user, setUser] = React.useState(initialUserState);
  const [users, setUsers] = React.useState([]);

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const [searchTitle, setSearchTitle] = React.useState("");
  
  const [validated, setValidated] = React.useState(false);

  const {dispatch} = store;

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const handleSubmit = (form) => {
    console.log(form);
    handleInputChange(form); 
    updateUser(form);       
  };



  const handleInputChange = form => {
    const { name, value } = form;
    setUser({ ...user, [name]: value });
  };

  const handleClose = () =>{
    newUser();
    setShow(false);
    setValidated(false);    
    setError(false);
    dispatch(removeError());
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newUser();
    setInfo(false);
  };

  
  const retrieveUsers = (pageNumber = 1) => {
    UsersDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        const { current_page, per_page, total } = response.data.meta;        
        if(response.data.data.length !== 0){
          console.log(current_page);
          setUsers(response.data.data);
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);
        }       
      })
      .catch(e => {
        console.log(e);
        setError(true);
      });
  };
  useEffect(retrieveUsers, []);
  const findByTitle = () => {
    UsersDataService.findByTitle(1, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
          if(response.data.data.length !== 0){
            setUsers(response.data.data);
            setPageSize(per_page);
            setPage(current_page);     
            setTotal(total);          
          }
      })
      .catch(e => {
        console.log(e);
        setError(true);
      });
  };


  
  const GetActionFormat = (row) =>{
    
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
};

const deleteItemFromState = (id) => {
  const updatedItems = users.data.filter(x=>x.id!==id)
  setUsers({ data: updatedItems })
}

const columns = [{  
    dataField: 'no',  
    text: 'No' },  
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

const updateUser = (form) => {
  var data = {
    id: user.id,
    email: form.email,
  };
  if(form.password!==''){
    data['password'] = form.password;
  }
  UsersDataService.update(data.id, data)
    .then(response => {
      console.log(response.data);
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,        
      });
      let values = [...users];
      values = values.map((item)=>{
        if(item.id === response.data.data.id){
          return response.data.data;
        }else{
          return item;
        }
      });
      setUsers(values);
      handleClose();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const deleteItem = (id) => {
  UsersDataService.remove(id)
    .then(() => {
      if(users.data.length > 1){
        retrieveUsers(page);
      }else if(page > 1){
        retrieveUsers(page - 1);
      }else{
        retrieveUsers();
      }
      //deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const newUser = () => {
  setUser(initialUserState);
};


  return (
    <div>
      {users?(
      users.length===0?(        
        <Spinner></Spinner>
      ):(  
        <div>
          
        <div className="col-md-6 float-right">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>   
      <div className="container">
      <UsersTable columns ={columns} users={users} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></UsersTable>
      { show &&<UserUpdate error={error} show ={show} handleClose={handleClose} user={user} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange}></UserUpdate> }
      { confirm &&<UserDelete id={id} name={"User"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm}></UserDelete> }
      { info && <UserInfo info = {info} user={user} handleCloseInfo={handleCloseInfo}></UserInfo> }
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveUsers(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
  </div>
  </div>  )
    ):(<div>
      <br />
      <p>No Data...</p>
    </div>)
      
    }</div>
    
    
  );
}