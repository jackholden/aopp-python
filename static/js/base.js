/**
 * Jack's Base JS
 */
const ENVIRONMENT_API = "http://127.0.0.1:5000/api/";
let defaultPage = 1;

$(document).ready(function() {
    AOS.init({ disable: 'mobile' }); // load animation minus mobile
    $('[data-bs-tooltip]').tooltip(); // initialises bootstrap tooltips
    loadUsers(); //core function requirement
});

// New User Listener
$("#newUserForm").on("submit",(function(e) {
    e.preventDefault();
    newUser();
}));

// Edit User Listener
$("#editUserForm").on("submit",(function(e) {
    e.preventDefault();
    //let userId = document.getElementById("inputUserID").value;
    let test = document.getElementById("testid").value;
    console.log(test);
    editUser(test);
}));

// Back to top JavaScript
$('#toTop').click(function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

/**
 * AOPP Core JS
 */
document.getElementById("nextBtn").addEventListener("click", nextBtn); // when clicked, run nextBtn function
document.getElementById("prevBtn").addEventListener("click", prevBtn); // when clicked, run prevBtn function
document.getElementById("searchInput").addEventListener("keydown", searchData); // on keydown, run searchData function (coming soon)
//document.getElementById("submitForm").addEventListener("click", editUser); // on keydown, run searchData function (coming soon)

//my new user function
function newUser()
{
    // the code below gets the values from the inputs based on id
    let newFName = document.getElementById("inputNewFirstName").value;
    let newLName = document.getElementById("inputNewLastName").value;
    let newEmail = document.getElementById("inputNewEmail").value;
    let newAvatar = document.getElementById("inputNewAvatar").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", ENVIRONMENT_API + "users", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'json';

    let data = JSON.stringify({"first_name": newFName, "last_name": newLName, "email": newEmail, "avatar": newAvatar});

    xhr.onload = function()
    {
        if (this.readyState === 4 && xhr.status === 201) // checks it's completed w/ specific response code
        {
            let data = xhr.response;
            alert("User created successfully!");
            console.log(data);
        } else {
            alert("User could not be created!");
        }
    };
    xhr.send(data);
}

// Delete function with confirmation to delete a user entry
function delUser(userId)
{
    let check = confirm("Are you sure you want ot delete User:" + userId + "?");
    if (check) {
        console.log("User deleted");
        let xhr = new XMLHttpRequest();

        xhr.open("DELETE", ENVIRONMENT_API + "users/" + userId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = 'json';
        xhr.onload = function()
        {
            if (this.readyState === 4 && this.status === 204) // specific response code for deleting the user
            {
                let userData = xhr.response;
                let tableRow = document.getElementById("userRow" + userId);
                alert("User deleted successfully!");
                tableRow.remove();
                console.log(userData);
            } else {
                alert("User couldn't delete!")
            }
        };
        xhr.send();
    }
}

// Get user based on id and return a json string
function getUser(userId)
{
    let xhr = new XMLHttpRequest();

    xhr.open("GET", ENVIRONMENT_API + "users/" + userId);
    xhr.responseType = 'json';

    xhr.onload = function()
    {
        if (this.readyState === 4 && this.status === 201) // specific response code for fetching the user
        {
            let userData = xhr.response;
            console.log(null, xhr.response);

            document.getElementById("userAvatar").src = userData[0]['avatar'];
            document.getElementById("inputUserID").value = userData[0]['id'];
            document.getElementById("testid").value = userData[0]['id']; // user identifier code
            document.getElementById("inputEmail").value = userData[0]['email'];
            document.getElementById("inputFName").value = userData[0]['first_name'];
            document.getElementById("inputLName").value = userData[0]['last_name'];
        } else {
            alert("Couldn't load user data!");
        }
   };
   xhr.send();
}

// Edit function that fetches data based on id
function editUser(userId)
{
    let editFName = document.getElementById("inputFName").value;
    let editLName = document.getElementById("inputLName").value;
    let editEmail = document.getElementById("inputEmail").value;
    let avatar = document.getElementById("userAvatar").src;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", ENVIRONMENT_API + "users/" + userId, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'json';

    let data = JSON.stringify({"first_name": editFName, "last_name": editLName, "email": editEmail, "avatar": avatar});

    xhr.onload = function()
    {
        if (this.readyState === 4 && xhr.status === 200) // check completed with standard response code
        {
            let data = xhr.response;
            alert("User updated successfully!");
            console.log(data);
        } else {
            alert("User could not be updated!");
        }
    };
    xhr.send(data);
}

// Core function used to load all the users and sort by page
function loadUsers(page = 1)
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", ENVIRONMENT_API + "users?page=" + String(page), true);

    xhr.onload = function() {
        if (this.readyState === 4 && this.status === 200)
        {
            let data = JSON.parse(this.responseText); // convert the response to a json object
            appendJSONStructure(data); // pass the json object to the append_json function
        }
    };
    xhr.send();
}

// Within this function we handle all the html dynamic content and populate using the json data
function appendJSONStructure(data)
{
    let table = document.getElementById('dynamicUserJSON');
    document.getElementById("totalPages").innerHTML = data['total_pages'];
    let obj = data["data"];
    let i = "";

    table.innerHTML = "";

    for (i = 0; i < obj.length; i++)
    {
        let tr = document.createElement('tr');
        tr.setAttribute("id", "userRow" + obj[i]["id"]);
        tr.innerHTML = '<td>' + obj[i]["id"] + '</td>' +
            '<td>' + obj[i]["email"] + '</td>' +
            '<td>' + obj[i]["first_name"] + '</td>' +
            '<td>' + obj[i]["last_name"] + '</td>' +
            '<td><img src="' + obj[i]["avatar"] + '" alt="User Avatar"></td>' +
            '<td><div class="btn-group-vertical btn-group-sm" role="group">' +
            '<button onclick="getUser(' + obj[i]["id"] + ')" class="btn btn-primary openBtn" type="button" data-target="#jack-edit" data-toggle="modal">Edit</button>' +
            '<button onclick="delUser(' + obj[i]["id"] + ')" class="btn btn-primary" type="button">Delete</button>' +
            '</div></td>';
        table.appendChild(tr);
    }
}

// Pagination prev button with cap to prevent going less than default 1
function prevBtn()
{
    if (defaultPage === 1) {
        loadUsers(defaultPage);
    } else {
        defaultPage--
        loadUsers(defaultPage);
    }
    console.log("previous page should load");
}

// Pagination next button with cap to prevent blank tables
function nextBtn()
{
    console.log("next btn pressed");
    let totalPages = document.getElementById("totalPages").innerHTML;
    if (defaultPage == totalPages) {
        loadUsers(defaultPage);
        console.log("you have loaded page " + defaultPage + "/" + totalPages);
    } else {
        defaultPage++
        loadUsers(defaultPage);
        console.log("you have loaded page " + defaultPage + "/" + totalPages);
    }
}

// For a future version with search functionality. Currently disabled.
function searchData()
{
    alert("Search functionality is coming soon!");
    document.getElementById("searchInput").disabled = true;
}