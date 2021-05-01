import React from 'react';

import Tabs from "./layout/tabs.component";

export default function HomePage() {
  
    return (
      <div className="container">
        <header>
          <h3>
              Gydymų algoritmai
          </h3>
        </header>
        
        <Tabs ></Tabs>
        
      </div>
    );
}