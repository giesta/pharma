import React from 'react';
import AuthService from "../../services/auth.service";
import { BsPhone, BsGeoAlt, BsFillEnvelopeFill} from "react-icons/bs";
export default function Footer() {

    const [user, setUser] = React.useState(AuthService.getCurrentUser());

    return (
        <div className="wrapper">
            
        <footer className='footer bg-dark text-white'>
        <div className="container-fluid">
<div className="row">
<div className="col">
<h5 className="">Mus rasite </h5>
<p><BsGeoAlt></BsGeoAlt> 9878/25 Laisves - 4, Kaunas </p>
<p><BsPhone></BsPhone>  +370-60000001  </p>
<p><BsFillEnvelopeFill></BsFillEnvelopeFill> info@pharma.com  </p>


</div>


<div className="col">
<h5 className="">Naudingos nuorodos</h5>

<ul className="footer_ul_amrc">
<li><a href="https://www.ema.europa.eu/">Europos vaistų asociacija</a></li>
<li><a href="https://www.who.int/en/">Pasaulio sveikatos organizacija</a></li>
<li><a href="https://www.vvkt.lt/index.php?1148175238">Valstybinė vaistų kontrolės tarnyba</a></li>
</ul>

</div>


<div className="col">
<h5 className="">Sveikatos politika</h5>
<ul className="footer_ul_amrc">    
    <li><a href="https://sam.lrv.lt/">Lietuvos Respublikos sveikatos apsaugos ministerija</a></li>
    <li><a href="https://ligoniukasa.lrv.lt/lt/">Valstybinė ligonių kasa prie Sveikatos apsaugos ministerijos</a></li>
</ul>

</div>

</div>
</div>


<div className="container">
<ul className="foote_bottom_ul_amrc">
<li><a href="https://vvkt.lt/index.php?3206255524">Pranešti apie nepageidaujamas reakcijas</a></li>
<li><a href="https://vapris.vvkt.lt/vvkt-web/public/medications">Vaistų paieška vvkt</a></li>
<li><a href="https://ec.europa.eu/health/documents/community-register/html/reg_hum_act.htm?sort=a">Bendrijos vaistinių preparatų registras</a></li>
</ul>
<p className="text-center">Gydymo algoritmai @2021 | Sukurta <a href="http://www.angis.tech/">Giedrius Stankevičius</a></p>


</div>
      </footer>
      </div>
    );
}