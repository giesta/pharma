import React from 'react';

import { BsPhone, BsGeoAlt, BsFillEnvelopeFill} from "react-icons/bs";
export default function Footer() {

    return (
        <div className="wrapper">
            
        <footer className='footer bg-dark text-white'>
        <div className="container-fluid">
<div className="row">
<div className="col">
<h5 className="">Find us</h5>
<p><BsGeoAlt></BsGeoAlt> 9878/25 Laisves - 4, Kaunas </p>
<p><BsPhone></BsPhone>  +370-60000001  </p>
<p><BsFillEnvelopeFill></BsFillEnvelopeFill> info@pharma.com  </p>


</div>


<div className="col">
<h5 className="">Useful links</h5>

<ul className="footer_ul_amrc">
<li><a href="http://europa.eu/eu-life/healthcare/index_en.htm">Healthcare in the European Union</a></li>
<li><a href="http://www.who.int/en/">World Health Organisation</a></li>
<li><a href="https://www.vvkt.lt/index.php?1148175238">State Medicines Control Agency of Lithuania</a></li>
</ul>

</div>


<div className="col">
<h5 className="">Quick links</h5>

<ul className="footer_ul_amrc">
<li><a href="/diseases">Diseases</a></li>
<li><a href="/drugs">Drugs</a></li>
<li><a href="/treatments">Treatments</a></li>
</ul>

</div>

</div>
</div>


<div className="container">
<ul className="foote_bottom_ul_amrc">
<li><a href="/">Home</a></li>
<li><a href="http://www.who.int/en/">About</a></li>
<li><a href="http://www.who.int/en/">Services</a></li>
<li><a href="http://www.who.int/en/">Pricing</a></li>
<li><a href="http://www.who.int/en/">Blog</a></li>
<li><a href="http://www.who.int/en/">Contact</a></li>
</ul>
<p className="text-center">Copyright @2020 | Designed With by <a href="http://www.who.int/en/">CodeOfUniverse</a></p>


</div>
      </footer>
      </div>
    );
}