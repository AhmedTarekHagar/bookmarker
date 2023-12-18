var bookmarkNameInput = document.getElementById('bookmarkName');
var siteURLInput = document.getElementById('url');

var searchInput = document.getElementById('searchInput');

var globalIndex;

var sitesList = [];

viewSites();

if (localStorage.getItem('sites') != null) {
    sitesList = JSON.parse(localStorage.getItem('sites'));
    viewSites();
}

function addToLocalStorage() {
    localStorage.setItem('sites', JSON.stringify(sitesList));
}

// #region add and confirm update function

function addSite() {
    var site = {
        siteName: bookmarkNameInput.value,
        siteURL: siteURLInput.value
    }

    if (!validateURL(site.siteURL)) {
        document.getElementById('validationError').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('validationError').classList.add('d-none');
        }, 1000);
        return;
    }

    if (document.getElementById('submitSite').innerHTML == 'Submit') {
        sitesList.push(site);
    } else if (document.getElementById('submitSite').innerHTML == 'Confirm Changes') {
        sitesList.splice(globalIndex, 1, site);

        document.getElementById('submitSite').innerHTML = 'Submit';
        document.getElementById('submitSite').classList.add('btn-danger');
        document.getElementById('submitSite').classList.remove('btn-outline-primary');
    }

    addToLocalStorage();
    clearForm();
    viewSites();
}

// linking button and action with click eventlistener

var submitButton = document.getElementById('submitSite');

submitButton.addEventListener('click', addSite);

// #endregion

// #region delete function

function deleteSite(siteIndex) {
    sitesList.splice(siteIndex, 1);
    addToLocalStorage();
    viewSites();
}

// #endregion

// #region update function

function updateSite(siteIndex) {
    bookmarkNameInput.value = sitesList[siteIndex].siteName;
    siteURLInput.value = sitesList[siteIndex].siteURL;

    globalIndex = siteIndex;

    document.getElementById('submitSite').innerHTML = 'Confirm Changes';
    document.getElementById('submitSite').classList.remove('btn-danger');
    document.getElementById('submitSite').classList.add('btn-outline-primary');

}
// #endregion

// #region clear form function

function clearForm() {
    bookmarkNameInput.value = ``;
    siteURLInput.value = ``;
}

// #endregion

// #region clear all

function clearAll() {
    localStorage.removeItem('sites');
    sitesList = [];
    viewSites();
}

// link clear all function to its button
document.getElementById('clearAllSites').addEventListener('click', clearAll);


// #endregion

// #region view sites list and linking delete and update buttons to their functions

function viewSites() {
    var content = ``;

    for (var i = 0; i < sitesList.length; i++) {
        content += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${sitesList[i].siteName}</td>
                        <td>
                            <a href="https://${sitesList[i].siteURL}" target="_blank" class="btn btn-success"><i
                                    class="fa-solid fa-eye pe-2"></i>Visit</a>
                        </td>
                        <td>
                            <button type="button" data-update-index = "${i}" class="btn btn-warning update"><i
                                    class="fa-solid fa-pen-to-square pe-2"></i>Update</button>
                        </td>
                        <td>
                            <button class="btn btn-outline-danger delete" data-delete-index = "${i}" type="button" class="btn btn-danger"><i
                                    class="fa-solid fa-trash-can pe-2"></i>Delete</button>
                        </td>
                    </tr>
        `;
    }

    if (content == ``) {
        content = `
                    <tr>
                        <td colspan="5" class="fw-semibold text-danger">No Saved Sites</td>
                    </tr>
        `;
    }

    document.getElementById('tableContent').innerHTML = content;

    addFunctionsToDeleteAndUpdateButtons();
}

// #endregion

// #region search function and event listener

function search() {
    var searchValue = searchInput.value.toLowerCase();
    var content = ``;

    for (var i = 0; i < sitesList.length; i++) {
        if (sitesList[i].siteName.toLowerCase().includes(searchValue)) {
            content += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${sitesList[i].siteName.toLowerCase().replace(searchValue, `<span class="bg-dark text-light">${searchValue}</span>`)}</td>
                        <td>
                            <a href="https://${sitesList[i].siteURL}" target="_blank" class="btn btn-success"><i
                                    class="fa-solid fa-eye pe-2"></i>Visit</a>
                        </td>
                        <td>
                            <button data-update-index = "${i}" type="button" class="btn btn-warning update"><i
                                    class="fa-solid fa-pen-to-square pe-2"></i>Update</button>
                        </td>
                        <td>
                            <button data-delete-index = "${i}" class="btn btn-outline-danger delete" type="button" class="btn btn-danger"><i
                                    class="fa-solid fa-trash-can pe-2"></i>Delete</button>
                        </td>
                    </tr>
        `;
        }
    }

    if (content == ``) {
        content = `
                    <tr>
                        <td colspan="5" class="fw-semibold text-danger">No matches</td>
                    </tr>
        `;
    }

    document.getElementById('tableContent').innerHTML = content;

    addFunctionsToDeleteAndUpdateButtons();
}

document.getElementById('searchInput').addEventListener('keyup', search);

// #endregion

function addFunctionsToDeleteAndUpdateButtons() {
    // add delete event listeners to buttons
    var deleteButtons = document.querySelectorAll('.delete');

    for (var j = 0; j < deleteButtons.length; j++) {
        (function (index) {
            deleteButtons[index].addEventListener('click', function () {
                deleteSite(deleteButtons[index].getAttribute(`data-delete-index`));
            });
        })(j);
    }

    // add update event listeners to buttons
    var updateButtons = document.querySelectorAll('.update');

    for (var k = 0; k < updateButtons.length; k++) {
        (function (index) {
            updateButtons[index].addEventListener('click', function () {
                updateSite(updateButtons[index].getAttribute(`data-update-index`));
            });
        })(k);
    }
}

function validateURL(url) {
    if (/^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/.test(url)) {
        return true;
    } else {
        return false;
    }
}