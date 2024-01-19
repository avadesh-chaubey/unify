# unify.care.backend
Unify Backend Repo Initial Commit

## publish common package in npm
npm version patch
npm run build
npm publish

How to run on your local machine

Install
Docker for Desktop

Install ingress nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx

Reference:https://kubernetes.github.io/ingress-nginx/deploy/


If you want to remove previous installations:
helm delete MY-RELEASE

install skaffold

<b>Create Secrets:</b>
<li>kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<YOUR_NAME></li>
<li>kubectl create secret generic raz-webhook-secret --from-literal=RAZORPAY_WEBHOOK_SECRET=<YOUR_NAME></li>
<li>kubectl create secret generic raz-api-key --from-literal=RAZORPAY_API_KEY=rzp_test_xMql4J71OEZ0W8</li>
<li>kubectl create secret generic raz-api-secret --from-literal=RAZORPAY_API_SECRET=UfzjagfTIsYbhL4r9NwDLSQB</li>
<li>kubectl create secret generic stripe-api-secret --from-literal=STRIPE_API_SECRET=sk_test_51HZA11HtoitGLCJlyVhEuRg7b7YO2rpmOXEjcTv4qb3ASYEAz9y3knNmcqYQuZjVeBzHpfknl83ccG2ePHvxmxWF00dAIsBxL3</li>



<h3>How to run:</h3>

<li>Checkout project using Github for Desktop</li>
<li>Open Terminal</li>
<li>Go to checkout directory, where skaffold.yaml exists</li>
<li>Now run type: "skaffold dev"</li>

###connect with mongo
kubectl exec -i patient-mongo-depl-68c969d5bb-j9ptz bash


##docker build command
docker build -t ranjeet/employee 


## restart a service
kubectl rollout restart deployment

##docker build  aparticular service
docker build -t ranjeet/file-manager .
docker run -p 3000:3000 ranjeet/patient 
