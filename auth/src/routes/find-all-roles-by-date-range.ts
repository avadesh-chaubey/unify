import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { UserAdmin } from '../models/user-admin';
import moment from 'moment';

const router = express.Router();
// /api/cms/blog?page=1&szie=4
router.get(
  '/api/users/employeeaccesslist',
  requireAuth,
  async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as any);
    //const PAGE_SIZE = 10;
    const PAGE_SIZE = parseInt(req.query.size as any);
    const startDate = req.query.startDate as any;
    const endDate = req.query.endDate as any;

    var query: any = {};
    query.skip = PAGE_SIZE * (page - 1);
    query.limit = PAGE_SIZE;

    if (page <= 0) {
      throw new NotFoundError();
    }

    if (req.query && req.query.startDate && req.query.endDate) {
      if (!moment(startDate, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      // check endDate formed as required
      if (!moment(endDate, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      //Make sure only endDate must be earlier than startDate
      if (!moment(endDate).isSameOrAfter(moment(startDate))) {
        throw new BadRequestError("startDate must be date before endDate");
      }
      const condition: any = { "roleAssignedDate": { '$gte': new Date(startDate).setHours(0, 0, 0, 0), '$lte': new Date(endDate).setHours(23, 59, 59, 999) } };
      const totalData = await UserAdmin.countDocuments(condition);
      const role = await UserAdmin.find(condition,
        { _id: 1, userFirstName: 1, userLastName: 1, phoneNumber: 1, emailId: 1, role: 1, roleAssignedDate: 1, roleAssignedBy: 1, isRoleActive: 1, userStatus: 1 }, query);
      const data = { "totalData": totalData, "role": role };
      let apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: data
      };
      res.send(apiResponse);
    }
    else {
      const totalData = await UserAdmin.countDocuments({});
      const role = await UserAdmin.find({}, { _id: 1, userFirstName: 1, userLastName: 1, phoneNumber: 1, emailId: 1, role: 1, roleAssignedDate: 1, roleAssignedBy: 1, isRoleActive: 1, userStatus: 1 }, query);
      const data = { "totalData": totalData, "role": role };
      let apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: data
      };
      res.send(apiResponse);
    }

  });

export { router as getAllUserRole };