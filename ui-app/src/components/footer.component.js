import React from 'react';


export default function Footer() {

    return (
        <div className="wrapper">
            
        <footer className='footer d-flex flex-column mt-auto py-3 bg-dark text-white navbar navbar-inverse'>
        <div class="">
<div class="row">
<div class=" col-sm-4 col-md col-sm-4  col-12 col">
<h5 class="headin5_amrc col_white_amrc pt2">Find us</h5>

<p className="mb10"></p>
<p><i className="fa fa-location-arrow"></i> 9878/25 Laisves - 4, Kaunas </p>
<p><i className="fa fa-phone"></i>  +370-60000001  </p>
<p><i className="fa fa fa-envelope"></i> info@pharma.com  </p>


</div>


<div class=" col-sm-4 col-md  col-12 col">
<h5 class="headin5_amrc col_white_amrc pt2">Useful links</h5>

<ul class="footer_ul_amrc">
<li><a href="http://europa.eu/eu-life/healthcare/index_en.htm">Healthcare in the European Union</a></li>
<li><a href="http://www.who.int/en/">World Health Organisation</a></li>
<li><a href="https://www.vvkt.lt/index.php?1148175238">State Medicines Control Agency of Lithuania</a></li>
</ul>

</div>


<div class=" col-sm-4 col-md  col-8 col">
<h5 class="headin5_amrc col_white_amrc pt2">Quick links</h5>

<ul class="footer_ul_amrc">
<li><a href="/diseases">Diseases</a></li>
<li><a href="/drugs">Drugs</a></li>
<li><a href="/treatments">Treatments</a></li>
</ul>

</div>

</div>
</div>


<div class="container">
<ul class="foote_bottom_ul_amrc">
<li><a href="/">Home</a></li>
<li><a href="#">About</a></li>
<li><a href="#">Services</a></li>
<li><a href="#">Pricing</a></li>
<li><a href="#">Blog</a></li>
<li><a href="#">Contact</a></li>
</ul>
<p class="text-center">Copyright @2020 | Designed With by <a href="#">CodeOfUniverse</a></p>


</div>
      </footer>
      </div>
    );
}