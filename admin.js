let users = [];

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const createBtn = document.getElementById("createBtn");
const userTable = document.getElementById("userTable");

createBtn.addEventListener("click", () => {

if(!nameInput.value || !emailInput.value){
alert("Fill all fields");
return;
}

users.push({
name: nameInput.value,
email: emailInput.value
});

render();

nameInput.value = "";
emailInput.value = "";

});

function render(){

userTable.innerHTML = "";

if(users.length === 0){
userTable.innerHTML = `<tr><td colspan="4">No Users Found</td></tr>`;
return;
}

users.forEach(u=>{
userTable.innerHTML += `
<tr>
<td>${u.name}</td>
<td>${u.email}</td>
<td>User</td>
<td>Admin</td>
</tr>`;
});

}