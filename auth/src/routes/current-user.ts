import express from 'express';
import { currentUser, ApiResponse } from '@unifycaredigital/aem';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {

  console.log('process.env.JWT_KEY :', process.env.JWT_KEY);
  
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: { currentUser: req.currentUser || null }
  };

  res.send(apiResponse);
});

export { router as currentUserRouter };
