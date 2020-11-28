import React, { useCallback, useEffect } from 'react';
import UsersDataService from "../../services/users/users.service";
import UserDelete from "../delete-modal.component";
import UserInfo from "./info-modal.component";
import UserUpdate from "./update-modal.component";
import UsersTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle} from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";

export default function UsersList() {

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
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const [searchTitle, setSearchTitle] = React.useState("");
  
  const [validated, setValidated] = React.useState(false);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
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
  const retrieveUsers = (pageNumber = 1) => {
    UsersDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        const { current_page, per_page, total } = response.data.meta;        
        if(response.data.data.length !== 0){
          setUsers({...users, data: response.data.data});
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
  const findByTitle = () => {
    UsersDataService.findByTitle(1, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
          if(response.data.data.length !== 0){
            setUsers({...users, data: response.data.data});
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
          }
        console.log(response.data.data);
      })
      .catch(e => {
        console.log(e);
        setError(true);
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
      setError(true);
      console.log(e);
    });
};

const deleteItem = (id) => {
  UsersDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
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
    <div>{error?<ErrorBoundary/>:''}
      {users?(
      users.data.length===0?(        
        <Spinner></Spinner>
      ):(  
        <div>
          
        <div className="col-md-6 float-right">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
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
      { show &&<UserUpdate show ={show} handleClose={handleClose} user={user} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange}></UserUpdate> }
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