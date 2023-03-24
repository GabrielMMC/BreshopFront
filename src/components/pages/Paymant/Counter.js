import React from 'react'

//Props coming from the ChargeModal
const Counter = ({ handleClose }) => {
 // -------------------------------------------------------------------
 //********************************************************************
 // -------------------------States------------------------------------
 const [totalTime, setTotalTime] = React.useState(5 * 60)

 React.useEffect(() => {
  //While the value is greater than zero, the function that decrements one second every one second is activated
  if (totalTime !== 0) setTimeout(() => setTotalTime(totalTime - 1), 1000)
  //If the value is equal to zero, the payment method closes
  else handleClose(false)
 }, [totalTime])

 //Calculating minutes and seconds
 const minutes = Math.floor(totalTime / 60)
 const seconds = totalTime % 60

 return (
  <div className='d-flex justify-content-center display-6'>
   {/* Formating minutes */}
   <span>{minutes.toString().padStart(2, "0")}</span>
   <span>:</span>
   {/* Formating seconds */}
   <span>{seconds.toString().padStart(2, "0")}</span>
  </div>
 )
}

export default Counter