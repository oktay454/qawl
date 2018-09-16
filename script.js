var rightPageNumber = localStorage.getItem("rightPageNumberStored") || 3;
var leftPageNumber = parseInt(rightPageNumber) + 1;
var rightPageElement = document.getElementById("rightPage");
var leftPageElement = document.getElementById("leftPage");

var userPageInput = document.getElementById("pageNumberInput").value;
userPageInput = localStorage.getItem("rightPageNumberStored") || 2;
var userPageInputInt = parseInt(userPageInput);

var darkCss = document.getElementById("darkCss");
var lightCss = document.getElementById("lightCss");

const Analytics = require("electron-ga").Analytics;
const analytics = new Analytics('UA-120295167-1');

function applyPage() {
	console.log("page set: r="+ rightPageNumber + " l="+ leftPageNumber);
	leftPage.src = "assets/mushaf-green/"+leftPageNumber+".png";
	rightPage.src = "assets/mushaf-green/"+rightPageNumber+".png";

	localStorage.setItem("rightPageNumberStored", rightPageNumber);
	document.getElementById("pageNumberInput").value = JSON.stringify(userPageInputInt);
}
function checkPage() { // generic function called by specific user actions, gateway to applyPage
	if (userPageInputInt < 605 && userPageInputInt > -1) { // ensures possible page
		if (userPageInputInt % 2 === 0) {
			leftPageNumber = userPageInputInt;
			rightPageNumber = leftPageNumber - 1;
		} else {
			rightPageNumber = userPageInputInt;
			leftPageNumber = parseInt(rightPageNumber) + 1;
		}
	}
}
function quickSwitch() {
	var lastLastPage = userPageInputInt
	userPageInputInt = parseInt(localStorage.getItem("lastPage"));
	checkPage();
	applyPage();
	updateDropdown();
	localStorage.setItem("lastPage", lastLastPage);
}
function numberOfPage() {
	localStorage.setItem("lastPage", userPageInputInt);
	userPageInput = document.getElementById("pageNumberInput").value;
	userPageInputInt = parseInt(userPageInput)
	checkPage();
	applyPage();
	updateDropdown();
}
function turnPage(increment) {
	localStorage.setItem("lastPage", userPageInputInt);
	if (userPageInputInt + increment > 0 && userPageInputInt + increment < 605) {
		userPageInputInt += parseInt(increment);
		checkPage();
		applyPage();
		updateDropdown();
	} // TODO: else {error tooltip}
}
function surahDropdown() {
	localStorage.setItem("lastPage", userPageInputInt);
	var selectedSurah = parseInt(document.getElementById("surahSelect").value);
	userPageInputInt = selectedSurah;
	checkPage();
	applyPage();
}
function updateDropdown() {
	for (let i = surahs.length - 1; i >= 0; i--) {
		if (userPageInputInt < surahs[i]['pageGreen']) {
			var surahSelect = document.getElementById("surahSelect");
			surahSelect.value = surahs[i-1]['pageGreen']
		}
	}
}
function changeZoom(increment) {
	var currentZoom = parseInt(localStorage.getItem("currentZoomStored")) || 100;
	currentZoom += increment;
	console.log("zoom="+currentZoom);
	if (currentZoom <= 100) { // zoomout and in work better respectively with a different
		document.body.style.width = 100 + "%"; // ^parent element being styled each time
		document.getElementById("wrapper").style["max-width"] = currentZoom + "%";
	} else if (currentZoom > 100 && currentZoom < 151) {
		document.body.style.width = currentZoom + "%";
		document.getElementById("wrapper").style["max-width"] = 100 + "%";
	}
	localStorage.setItem("currentZoomStored", currentZoom);
}
function openOnQuranCom() {
	for (let i = surahs.length - 1; i >= 0; i--) {
		if (userPageInputInt >= surahs[i]['pageGreen']) {
			console.log('https://www.quran.com/' + parseInt(i+1), '_blank');
			window.open('https://www.quran.com/' + parseInt(i+1), '_blank');
			return
		}
	}
}
function toggleTheme() {
	if (localStorage.getItem("testTheme") == null) {
		localStorage.setItem("testTheme", "light") //for first use
	}
	if (localStorage.getItem("lastTheme") == "light") {
		darkCss.media = '';
		lightCss.media = 'none';
		localStorage.setItem("lastTheme", "dark")
		} else {
		darkCss.media = 'none';
		lightCss.media = '';
		localStorage.setItem("lastTheme", "light")
	}
}
function lastTheme() {
	if (localStorage.getItem("lastTheme") == "dark") {
		darkCss.media = '';
		lightCss.media = 'none';
		localStorage.setItem("lastTheme", "dark")
	} else {
		darkCss.media = 'none';
		lightCss.media = '';
		localStorage.setItem("lastTheme", "light")
	}
}

//initialization:
applyPage();
lastTheme();
changeZoom(0);
(function() {
    var ele = document.getElementById("surahSelect");
    for (let i = 0; i < surahs.length; i++) {
        ele.innerHTML = ele.innerHTML +
            '<option value="' + surahs[i]['pageGreen'] + '">' +
            parseInt(i+1) + '. ' + surahs[i]['name'] + '</option>';
    }
})();
document.getElementById("pageNumberInput").value = JSON.stringify(userPageInputInt)
updateDropdown();
(async function() {
	await analytics.send('screenview', { cd: 'Reader' });
	await analytics.send('event', { ec: 'Scroll', ea: 'scrollto', el: 'row', ev: 123 });
})();




document.onkeydown = function(e) {
  if (e.which == 37) {
    turnPage(+2);
  } else if (e.which == 39) {
    turnPage(-2);
  } else if (e.which >= 48 && e.which <= 57) {
    document.getElementById("pageNumberInput").focus();
  } else if (e.which == 189) {
    changeZoom(-5);
  } else if (e.which == 187) {
    changeZoom(+5);
  }
}