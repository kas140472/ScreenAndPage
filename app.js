// ************ SELECT ITEMS ******************

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const groceryReview = document.getElementById('grocery-review');

const groceryGenre = document.getElementById('genreList');

const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// const ccBtn = document.querySelector('.cc-btn');
// const lcBtn = document.querySelector('.lc-btn');

// EDIT OPTION

let editElement;
let editFlag = false;
let editElementReview;
let editFlagReview = false;
let editElementGenre;
let editFlagGenre = false;
let editID = '';

// *********** EVENT LISTENERS *******************
// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click',clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);




// const ccBtn = document.querySelector('.cc-btn');
// const lcBtn = document.querySelector('.lc-btn');
// const introScreen = document.querySelector('.intro');
const sectionScreen = document.querySelector('.section-center');
// const sectionScreen2 = document.querySelector('.section-center2');
// sectionScreen.classList.add("fadeOut");
// sectionScreen2.classList.add("fadeOut");
// ccBtn.addEventListener('click', ()=> {
//             introScreen.classList.add("fadeOut");
//             sectionScreen.classList.add("fadeIn");
//             sectionScreen2.classList.add("fadeOut");
//         });

// lcBtn.addEventListener('click', ()=> {
//             introScreen.classList.add("fadeOut");
//             sectionScreen2.classList.add("fadeIn");
//             sectionScreen.classList.add("fadeOut");
//         });


// ************ FUNCTIONS ****************
function  addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const valueReview = groceryReview.value;

    var genreList = document.getElementById("genreList");  
    
    const valueGenre = genreList.options[genreList.selectedIndex].text;  
    
    const id = new Date().getTime().toString(); // just to get a unique id
    if(value !== '' && editFlag === false){
        if(valueReview !== ''){
            displayListItem(id, value, valueReview, valueGenre);
            addToLocalStorage(id, value, valueReview, valueGenre);
        }
        else{
            displayListItem(id, value, 'No review.', valueGenre);
            addToLocalStorage(id, value, 'No review.', valueGenre);
        }
        
        // display alert
        displayAlert('Yay! A new flick has been added to your cinematic catalog!', 'success');
        // show container
        container.classList.add("show-container");
        // add to local storage
        //addToLocalStorage(id, value, valueReview);
        // set back to default
        setBackToDefault();
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        editElementReview.innerHTML = valueReview;
        editElementGenre.innerHTML = valueGenre;
        // if(valueReview !== ''){
        //     editElementReview.innerHTML = valueReview;
        // }
        // else{
        //     editElementReview.innerHTML = ' ';
        // }
        
        displayAlert('Your cinematic catalog has been updated!', 'success');
        // edit local storage
        editLocalStorage(editID, value, valueReview, valueGenre);
        //editLocalStorage(editID, value, valueReview);
        //editLocalStorage(editID, value);

        setBackToDefault();
    }
    else{
        displayAlert('Please enter the title of the movie/show.', 'danger');
    }
}
// display alert
function displayAlert(text, action)
{
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 2000)
}
// clear items
function clearItems()
{
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0)
    {
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert('All cleared!', 'success');
    setBackToDefault();
    localStorage.removeItem('list');
}

// edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.firstElementChild;
    editElementReview = e.currentTarget.previousElementSibling;
    editElementGenre = e.currentTarget.previousElementSibling.previousElementSibling;
    //editElementGenre = document.getElementById('genreID').textContent;
    // set form value
    grocery.value = editElement.innerHTML;
    groceryReview.value = editElementReview.innerHTML;
    console.log('editElementGenre =', editElementGenre);
    groceryGenre.value = editElementGenre.innerHTML;
    console.log('groceryGenre.value =', groceryGenre.value);
    
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "If you really want to edit...";
}

// function editReviewItem(e){
//     const elementReview = e.currentTarget.parentElement.parentElement;
//     // set edit item
//     editElementReview = e.currentTarget.previousElementSibling;
//     // set form value
//     groceryReview.value = editElementReview.innerHTML;
//     editReviewFlag = true;
//     editID = elementReview.dataset.id;
//     submitBtn.textContent = "If you really want to edit...";
// }

// delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0)
    {
        container.classList.remove("show-container");
    }
    displayAlert('Flick removed!', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// set back to default
function setBackToDefault(){
    grocery.value = '';
    editFlag = false;
    editFlagReview = false;
    editFlagGenre = false;
    editID = '';
    submitBtn.textContent = 'Add movie/show to catalog';
    groceryReview.value = '';
    groceryGenre.value = 'None';
}

// ************ LOCAL STORAGE *****************
function addToLocalStorage(id, value, valueReview, valueGenre){
    const grocery = {id:id, value:value, valueReview:valueReview, valueGenre:valueGenre};
    let items = getItemsFromLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getItemsFromLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value, valueReview, valueGenre){
    let items = getItemsFromLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
            item.valueReview = valueReview;
            item.valueGenre = valueGenre;
            return item;
        }
        else{
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function getItemsFromLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem('list')):[];
}

// localStorage API
// setItem
// getItem
// removeItem
// save as strings
// localStorage.setItem("orange", JSON.stringify(['item1', 'item2']));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// localStorage.removeItem('orange');

// ************ SETUP ITEMS ***************
function setupItems(){
    let items = getItemsFromLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            displayListItem(item.id, item.value, item.valueReview, item.valueGenre);
        })
        container.classList.add('show-container');
    }
}


function displayListItem(id, value, valueReview, valueGenre){
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<div class="btn-container">
            <p class="title">${value}</p>
            Genre: <p class="genre" id="genreID">${valueGenre}</p>
            <p class="review">${valueReview}</p>
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
                Edit
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>`;

        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        //const editReviewBtn = element.querySelector('.edit-review-btn');

        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        //editReviewBtn.addEventListener('click', editReviewItem);

    // append child
    list.appendChild(element);
}


// <button type="button" class="edit-review-btn">
//                 <i class="fas fa-trash"></i>
//                 Edit review
//             </button>
