// This method makes sure the JavaScript starts after the page is completely loaded
window.addEventListener('load', start);

// Declaring global variables, global variables are the variables that all functions can read and work on it
// So in this case, all the functions below can access these variables
var globalNames = [];
var inputName = null;
var isEditing = false;
var currentIndex = null;

/**
 * This function starts the program, first assign a value to the variable inputName, second call the function preventSubmit()
 * Then call the function activateInput() and render.
 * - The reason to call the function preventFormSubmit() is to make sure the page doesn't reload after pressing Enter Key
 * - The reason to call the function activateInput() is to make the input active when load the page
 * so the user don't need to click on input field to start typing the name.
 * - The reason to call render() is to update the page with all values defined on the JavaScript in this case
 * because the div where display the names is created after registration so its added to the page dynamically
 */
function start() {
  inputName = document.querySelector('#inputName');
  preventFormSubmit();
  activateInput();
  render();
}

// Function to prevent the page to reload after pressing Key enter
function preventFormSubmit() {
  // After submit is triggered the handleFormSubmit makes the event to call the method preventDefault
  // in this case prevent the page from reload
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  // declare var to assign the value of the form you want to prevente submit
  var form = document.querySelector('form');
  // addEventListener to the var form so when submit is triggered call the function handleFormSubmit
  form.addEventListener('submit', handleFormSubmit);
}

// Activate input so the user don't need to click on the input field after the page load, just start typing
function activateInput() {
  // insert the new name typed on the input to the Array globalNames and then update the page with the new value
  function insertName(newName) {
    globalNames.push(newName);
  }

  function updateName(newName) {
    globalNames[currentIndex] = newName;
  }

  // Check if its typed key 'Enter' on input field, if so, call the function insertName passing the text inside the input field
  function handleTyping(event) {
    // Check if the input has text, to avoid blank text to be inserted on the array
    var hasText = !!event.target.value && event.target.value.trim() !== '';
    if (!hasText) {
      // Clear input if its empty or blank spaces
      clearInput();
      return;
    }

    if (event.key === 'Enter') {
      // Check if is to edit a item or to insert an item
      if (isEditing) {
        // if is editing call function updateName with the especified event target value
        updateName(event.target.value);
      } else {
        insertName(event.target.value);
      }
      //After finishing its not editing anymore;
      isEditing = false;
      clearInput();
      render();
    }
  }

  // Makes the inputName active so the user dont need to click to start typing
  inputName.focus();
  // addEventListener so it trigger the event every time is typed on the input field and call the function handleTyping
  inputName.addEventListener('keyup', handleTyping);
}

// Updates the page
function render() {
  // Create Button to Delete name specified on the index
  function createDeleteButton(index) {
    // Delete from the Array a name on the specified index then update the page
    function deleteName() {
      globalNames.splice(index, 1);
      render();
    }

    // create a new button
    var button = document.createElement('button');
    // add a class from css file to the new button
    button.classList.add('deleteButton');
    // asign the textContent of the button with the value 'X'
    button.textContent = 'X';

    // Add eventListerner to the button, on click call the function deleteName
    button.addEventListener('click', deleteName);

    // return the new button;
    return button;
  }

  function createSpan(name, index) {
    // Function to edit the span
    function editItem() {
      inputName.value = name;
      inputName.focus();
      isEditing = true;
      currentIndex = index;
    }

    // create span tag
    var span = document.createElement('span');
    // Add class from css file to make the span clickable
    span.classList.add('clickable');
    // Assign the currentName to the span
    span.textContent = currentName;
    // Add eventListener to span
    span.addEventListener('click', editItem);

    return span;
  }

  // Clear the content on the div with id names
  var divNames = document.querySelector('#names');
  divNames.innerHTML = '';

  // Create ul tag on html file
  var ul = document.createElement('ul');

  // Go through the Array getting all elements
  for (var i = 0; i < globalNames.length; i++) {
    // Create var with the value of the array on specified position i
    var currentName = globalNames[i];
    // Create li tag
    var li = document.createElement('li');

    // Assign to the var button the button returned from the function createDeleteButton()
    var button = createDeleteButton(i);
    var span = createSpan(currentName, i);

    // Add button inside li tag
    li.appendChild(button);
    // Add span inside li tag
    li.appendChild(span);
    // Add li tag inside ul tag
    ul.appendChild(li);
  }

  // Add ul tag inside divNames tag
  divNames.appendChild(ul);
  // Call the function to clear the input
  clearInput();
}

// Clear the input assign the value empty '' and activate inputName field so the user can type a new name
function clearInput() {
  inputName.value = '';
  inputName.focus();
}
