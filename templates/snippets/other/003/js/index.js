const {
  Stitch,
  RemoteMongoClient,
  UserPasswordCredential
} = stitch;

const stitchClient = Stitch.initializeDefaultAppClient("calhacksapp-fnvwg");

login("mike@mlynn.org", "Password123").then(() => {
  // Initialize a MongoDB Service Client
  const mongodb = stitchClient.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
  );
  // Get a hook to the employees collection
  const contacts = mongodb.db("calhacks").collection("contacts");
  
  return contacts.find({}, {
    // limit: 3,
    // sort: { "salary": -1 }
  })
    .asArray();
})
  .then(displayContacts)

function login(email, password) {
  const credential = new UserPasswordCredential(email, password);
  return stitchClient.auth.loginWithCredential(credential);
}

// Renders the the employees' information in the table
function displayContacts(contacts) {
  const contactsTableBody = document.getElementById("contacts");
  const numResultsEl = document.getElementById("num-results");
  const tableRows = contacts.map(contact => {
    return `
      <tr>
        <td>${contact.first_name}, ${contact.last_name}</td>
        <td>${contact.email}</td>
        <td>${contact.gender}</td>
        <td>${contact.ip_address}</td>
      </tr>
    `;
  });
  contactsTableBody.innerHTML = tableRows.join("");
  numResultsEl.innerHTML = contacts.length;
}