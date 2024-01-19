import express, { Request, Response } from 'express';
import { requireRosterManagerAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { AssistantTimeTable } from '../models/assistant-time-table';

const router = express.Router();

router.get(
  '/api/appointment/assistanttimetable/:assistantId',
  requireRosterManagerAuth,
  async (req: Request, res: Response) => {

    let existingAssistantTimeTable = await AssistantTimeTable.findOne({
      assistantId: req.params.assistantId,
    });
    if (!existingAssistantTimeTable) {
      throw new NotFoundError();
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: existingAssistantTimeTable
    };

    res.status(200).send(apiResponse);
  }
);

export { router as viewAssistantTimeTableRouter };
