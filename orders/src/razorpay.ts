import Razorpay from 'razorpay';

export const appointmentRazorpay = new Razorpay({
    key_id: process.env.APPOINTMENT_RAZORPAY_API_KEY!,
    key_secret: process.env.APPOINTMENT_RAZORPAY_API_SECRET!
});

export const pharmacyRazorpay = new Razorpay({
    key_id: process.env.PHARMACY_RAZORPAY_API_KEY!,
    key_secret: process.env.PHARMACY_RAZORPAY_API_SECRET!
});

export const testlabRazorpay = new Razorpay({
    key_id: process.env.TESTLAB_RAZORPAY_API_KEY!,
    key_secret: process.env.TESTLAB_RAZORPAY_API_SECRET!
});