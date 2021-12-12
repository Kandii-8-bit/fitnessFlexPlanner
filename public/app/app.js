var _db;

//This function puts a listener on the window for whenever a user logs in or out. I only have to call this function one time and I do
//That in the document.ready
function authStateListener() {
  firebase.auth().onAuthStateChanged((user) => {
    //I am checking to see if a user exists in the browsers storage.
    if (user) {
      console.log("user");
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      MODEL.loadpage("caloriecount", loadCalorieCount);
      //This HAS to be fired before anything else upon logging in. Because this connects the firestore database to our var _db
      _db = firebase.firestore();
      //Then we load all albums to page when we log on.
      // loadAlbums();
    } else {
      // User is signed out
      // ...
      console.log("Logged Out.");
      //This clears all the albums with you sign out!
      MODEL.loadpage("createLogin");
      _db = "";
    }
  });
}

function addMeal() {
  // Add meal to database
  let meal = $("#am").val();
  let cal = $("#tc").val();
  let mealObj = {
    meal: meal,
    calories: cal,
  };

  _db
    .collection("Meals")
    .add(mealObj)
    .then(function (doc) {
      meal = $("#am").val("");
      cal = $("#tc").val("");
      console.log("added " + doc.id);
      loadCalorieCount();
    });
}

function updateMeal(mealId) {
  console.log(mealId);
  let newMeal = $("#meal").val();
  let cal = $("#calories").val();

  let mealObj = {
    meal: newMeal,
    calories: cal,
  };
  _db
    .collection("Meals")
    .doc(mealId)
    .update(mealObj)
    .then(() => {
      console.log("Document successfully deleted!");
      loadCalorieCount();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function deleteMeal(mealId) {
  console.log(mealId);
  _db
    .collection("Meals")
    .doc(mealId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      loadCalorieCount();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function loadCalorieCount() {
  console.log("Load Cal");
  $("table").empty();
  // This is where I get my data and display it on the page
  _db
    .collection("Meals")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let meal = doc.data().meal;
        let cal = doc.data().calories;

        $("table").append(
          //This appends the data to the page!
          `<tr>
            <td><input id="meal" value="${meal}"> Calories: <input id="calories" value="${cal}">
                <div class="edit-b-delete-b">
                    <img onclick="updateMeal('${doc.id}')" src="assets/pencil.png" alt="">
                    <img onclick="deleteMeal('${doc.id}')" src="assets/delete.png" alt="">
                </div>
            </td>
        </tr>`
        );
      });
    });
}

//This creates an account!
function createAccount(e) {
  e.preventDefault();
  let email = $("#email").val();
  let password = $("#pw").val();
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      console.log("create");
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

//This logs an account in.
function login() {
  let email = $("#liemail").val();
  let password = $("#lipw").val();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

function navLoadPage(pagename) {
  MODEL.loadpage(pagename);
}

//This fires as soon as the browser is opened and it listens for everything.
$(document).ready(function () {
  try {
    let app = firebase.app();
    MODEL.loadpage("createLogin");
    authStateListener();
  } catch (e) {
    console.error(e);
  }
});
