import React, { useState } from "react";
import { RiArrowDropDownLine } from 'react-icons/ri'
import './styles.css'

const Accordion = (props) => {
 const { types, styles, materials } = props
 const [activeItems, setActiveItems] = useState(['styles']);


 const toggleAccordion = (item) => {
  if (activeItems.includes(item)) setActiveItems(activeItems.filter(active => active !== item));
  else setActiveItems([...activeItems, item]);
 };

 return (
  <nav className="accordion navbar">
   <ul className="navbar-nav">
    <li className="nav-item pointer" onClick={() => toggleAccordion('styles')} >
     <div className="d-flex justify-content-between">
      <h4 className={`${activeItems.includes('styles') && 'accordion-active'} nav-item-header`}>
       Estilos
      </h4>
      <RiArrowDropDownLine size={35} className={activeItems.includes('styles') ? 'rotate-in' : 'rotate-out'} />
     </div>
     <ul className={`${activeItems.includes('styles') && 'show'} accordion-content nav-item-submenu`}>
      {styles && styles.map(item => (
       <li key={item.id}><a href="#" onClick={() => props.setStyle(item.id)}>{item.name}</a></li>
      ))}
     </ul>
    </li>
    <li className="nav-item pointer" onClick={() => toggleAccordion('types')}>
     <div className="d-flex justify-content-between">
      <h4 className={`${activeItems.includes('types') && 'accordion-active'} nav-item-header`}>
       Tipos
      </h4>
      <RiArrowDropDownLine size={35} className={activeItems.includes('types') ? 'rotate-in' : 'rotate-out'} />
     </div>
     <ul className={`${activeItems.includes('types') && 'show'} accordion-content nav-item-submenu`}>
      {types && types.map(item => (
       <li key={item.id}><a href="#" onClick={() => props.setType(item.id)}>{item.name}</a></li>
      ))}
     </ul>
    </li>
    {/* <li className="nav-item">
     <h4 className="nav-item-header">Preços</h4>
     <ul className="nav-item-submenu">
      <li><a href="#">Menor que R$ 50</a></li>
      <li><a href="#">R$ 50 - R$ 100</a></li>
      <li><a href="#">Maior que R$ 100</a></li>
     </ul>
    </li> */}
    <li className="nav-item pointer" onClick={() => toggleAccordion('materials')}>
     <div className="d-flex justify-content-between">
      <h4 className={`${activeItems.includes('materials') && 'accordion-active'} nav-item-header`}>
       Materiais
      </h4>
      <RiArrowDropDownLine size={35} className={activeItems.includes('materials') ? 'rotate-in' : 'rotate-out'} />
     </div>
     <ul className={`${activeItems.includes('materials') && 'show'} accordion-content nav-item-submenu`}>
      {materials && materials.map(item => (
       <li key={item.id}><a href="#" onClick={() => props.setMaterial(item.id)}>{item.name}</a></li>
      ))}
     </ul>
    </li>
   </ul>
  </nav>
 );
};

export default Accordion;