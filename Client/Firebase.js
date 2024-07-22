import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyDO6Y6PldA2SqYKKav-NNE5SA4AG3evKtg",
	authDomain: "cosmic-13139.firebaseapp.com",
	projectId: "cosmic-13139",
	storageBucket: "cosmic-13139.appspot.com",
	messagingSenderId: "817111836740",
	appId: "1:817111836740:web:748105bd9de5f9fcaef411",
	measurementId: "G-214B5GF3DS"
  };
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
