let inputSearch = null,
  buttonSearch = null,
  panelUsers = null,
  panelStatistics = null,
  users = [],
  divSpinner = null,
  divInteraction = null;

const formatter = Intl.NumberFormat('pt-BR');

window.addEventListener('load', async () => {
  mapElements();
  await fetchUsers();
  addEvents();
});

function mapElements() {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('#buttonSearch');
  panelUsers = document.querySelector('#panelUsers');
  panelStatistics = document.querySelector('#panelStatistics');

  divInteraction = document.querySelector('#divInteraction');
  divSpinner = document.querySelector('#divSpinner');
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );

  const json = await res.json();

  users = json.results
    .map(({ login, name, dob, gender, picture }) => {
      const fullName = `${name.first} ${name.last}`;
      return {
        id: login.uuid,
        name: fullName,
        nameLowerCase: fullName.toLowerCase(),
        age: dob.age,
        gender: gender,
        picture: picture.large,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  showInteraction();
}

function showInteraction() {
  setTimeout(() => {
    divSpinner.classList.add('hidden');
    divInteraction.classList.remove('hidden');
  }, 2000);
}

function addEvents() {
  inputSearch.addEventListener('keyup', handleKeyUp);
  buttonSearch.addEventListener('click', handleButtonSearch);
}

function handleKeyUp(event) {
  const currentKey = event.key;

  if (currentKey !== 'Enter') {
    return;
  }

  const filterText = event.target.value;

  if (filterText.trim() !== '') {
    filterUsers(filterText);
  }
}

function handleButtonSearch(event) {
  const filterText = inputSearch.value;

  if (filterText.trim() !== '') {
    filterUsers(filterText);
  }
}

function filterUsers(filterText) {
  const filterTextLowerCase = filterText.toLowerCase();

  const filteredUsers = users.filter((users) => {
    return users.nameLowerCase.includes(filterTextLowerCase);
  });

  renderUsers(filteredUsers);
  renderStatistics(filteredUsers);
}

function renderUsers(users) {
  panelUsers.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = `${users.length} User(s) found!`;

  const ul = document.createElement('ul');

  users.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('flex-row');
    const img = `<img src="${user.picture}" class="avatar" alt="picture of ${user.name} title="picture of ${user.name}"`;
    const userData = `<span>${user.name}, ${user.age} Years old</span>`;

    li.innerHTML = `${img}${userData}`;
    ul.appendChild(li);
  });

  panelUsers.appendChild(h2);
  panelUsers.appendChild(ul);
}

function renderStatistics(users) {
  const countMale = users.filter((user) => user.gender === 'male').length;
  const countFemale = users.filter((user) => user.gender === 'female').length;

  const sumAges = users.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const averageAges = sumAges / users.length || 0;

  panelStatistics.innerHTML = `
    <h2>Statistics</h2>
    
    <ul>
      <li>Male: <strong>${countMale}</strong></li>
      <li>Female: <strong>${countFemale}</strong></li>
      <li>Total ages: <strong>${formatNumber(sumAges)}</strong></li>
      <li>Average ages: <strong>${formatAverage(averageAges)}</strong></li>
    </ul>
  `;
}

function formatNumber(number) {
  return formatter.format(number);
}

function formatAverage(number) {
  return number.toFixed(2).replace('.', ',');
}
