import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useRouter } from 'next/router';

function AdminHomePage() {
   const router = useRouter();
   const signout = async () => {
      await axios.post('/api/users/signout')
         .then(() => {
            router.push('/')
         })
         .catch(error => {
            console.log(error);
            alert.show('API error', { type: 'error' })
         });
   }
   return <>
      <div
         style={{
            display: "flex",
            flexDirection: "row",
            background: "#2b2b2b",
         }}
      >
         <Button
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button"
            onClick={signout}
            style={{ margin: "20px 20px 20px 1200px" }}
         >
            Logout
          </Button>
      </div>
      <div>Welecome to the Admin Home page</div>
   </>
}

export default AdminHomePage