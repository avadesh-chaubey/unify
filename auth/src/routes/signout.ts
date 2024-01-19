import express from 'express';
import { ApiResponse } from '@unifycaredigital/aem';
const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: {}
  };

  res.send(apiResponse);
});

export { router as signoutRouter };
