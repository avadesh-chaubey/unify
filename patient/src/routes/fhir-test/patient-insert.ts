import express, { Request, Response } from 'express';
import { requireCustomerSupportAuth,ApiResponse } from '@unifycaredigital/aem';
const google = require('@googleapis/healthcare');
const healthcare = google.healthcare({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    }),
    headers: {'Content-Type': 'application/fhir+json'},
  });
  

const router = express.Router();

router.post('/api/patient/fhirpatient', async (req: Request, res: Response) => {
    const body = {
        name: [{use: 'official-test', family: 'Unify-test', given: ['Anirudh']}],
        gender:2 ,
        birthDate: '1970-01-01',
        resourceType: 'Patient',
      };

      // TODO(developer): uncomment these lines before running the sample
   const cloudRegion = 'asia-south1';
   const projectId = 'gamma-unify-care';
   const datasetId = 'unifyhealthcare';
   const fhirStoreId = 'unify-patient';
   const resourceType = 'Patient';
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/fhirStores/${fhirStoreId}`;

  const request = {parent, type: resourceType, requestBody: body};
  const resource =
    await healthcare.projects.locations.datasets.fhirStores.fhir.create(
      request
    );
  res.send("Patient inserted succesfully");
});

export { router as fhirPatientsRouter };
