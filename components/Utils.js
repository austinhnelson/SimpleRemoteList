/** Importing neccessary modules */

/** Function to load a list from a remote URL */
async function loadList (aurl, alist, asetlist) {
  console.log("Preparing to load..");

  /** Establishing connection */
  const response = await fetch(aurl); // connecting can take a while, so use await
  console.log(response);
  /** Parse JSON */
  const names = await response.json();

  console.log(names);

  /** Store each name into the list */
  names.forEach((item) => {
    alist.push(item);
  })

  const newList = alist.map((item) => { return item})
  /** Test the list */
  asetlist(newList);
}

/** Function save a list to a URL */
async function saveList (aurl, list) {

  /** Establish fetch options */
  const reqOptions = {
    method: 'POST', //we are writing
    headers: { 'Content-Type': 'application/json' }, //using JSON
    body: JSON.stringify(list) //converting data to JSON to be used
  }

  const response = await fetch(aurl, reqOptions) // connecting can take a while, so use await
  console.log(response);
  console.log("save worked");

}

/** Export functions for use */
export {saveList}
export {loadList}