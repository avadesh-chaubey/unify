import Header from "../components/consultationServices/Header";
// import UpcomingAppointment from "../components/consultationServices/UpcomingAppointment";
import UpcomingAppointment from "../components/consultationServices/UpcomingAppt/UpcomingAppointment";
const upcomingapt = (props) => {
  const {firebase} = props;
  return (
    <div>
      <Header />
      <div>
        <UpcomingAppointment firebase = {firebase} />
      </div>
    </div>
  );
};
export default upcomingapt;
