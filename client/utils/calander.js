import Calendar from 'react-calendar';

function Calander(){
    return(
        <>
            <Calendar
                onChange={onDateChange}
                value={date}
            />
        </>
    )
}
export default Calander