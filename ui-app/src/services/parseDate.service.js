

  const getParsedDate = (strDate)=>{
      console.log(strDate);
    var strSplitDate = String(strDate).split(' ');
    var date = new Date(strSplitDate[0]);
    
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    var hh = date.getHours();
    var min = date.getMinutes();

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hh < 10) {
      hh = '0' + hh;
    }
    if (min < 10) {
      min = '0' + min;
    }
    date =  yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
    return date.toString();
}

const services = {
    getParsedDate
  };
  
  export default services;