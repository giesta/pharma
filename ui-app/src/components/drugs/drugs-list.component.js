import React, { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import DrugsDataService from "../../services/drugs/list.service";

export default function MaterialTableDemo() {
  const [drug, setDrug] = React.useState({
    columns: [{  
    dataField: 'id',  
    text: 'Id' },  
{  
 dataField: 'name',  
  text: 'Name',  
  sort:true}, {  
  dataField: 'substance',  
  text: 'Substance',  
  sort: true  },  
{  dataField: 'indication',  
text: 'Indication',  
sort: true  },  
{  dataField: 'contraindication',  
text: 'Contraindication',  
sort: true  
 },  
{  
dataField: 'reaction',  
 text: 'Reaction',  
sort: true  
 },   {  
 dataField: 'use',  
text: 'Use',  
 sort: true }
  ]  ,
    data: [],
  });
  useEffect(()=>{
        retrieveDrugs();
  }, []);
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
          setDrug({...drug, data: response.data.data});
        
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>{drug?(
      <div className="container">  

        <div className="row" className="hdr">    

          <div className="col-sm-12 btn btn-info">    

            React Bootstrap Table with Searching and Custom Pagination   
            {console.log(drug)}

              </div>    

             </div>    

              <div  style={{ marginTop: 20 }}>  

            <BootstrapTable   

            striped  

            hover  

            keyField='id'   

           data={ drug.data }   

          columns={ drug.columns } ></BootstrapTable>  

        </div>  

 </div>  
    ):(<div>
      <br />
      <p>Please click on a Tutorial...</p>
    </div>)
      
    }</div>
    
    
  );
}