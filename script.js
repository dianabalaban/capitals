
let i = 0, count = 0, missedCountries = [], skippedCount = 0, distance = 0;
async function getData(continents) {
    let url = 'https://restcountries.eu/rest/v2/all';
    let data = await fetch(url)
        .then(res => res.json())
        .then(data => data);
    if (data) {

        let copy = data;
        let allCountries = [];
        let euroExlcude = ["Åland Islands", "Faroe Islands", "Gibraltar", "Guernsey", "Isle of Man", "Jersey", "Svalbard and Jan Mayen"]
        let asiaExlcude = ["Hong Kong", "Macao", "Timor-Leste"];
        let africaExlcude = ["British Indian Ocean Territory", "French Southern Territories", "Mayotte", "Réunion", "Saint Helena, Ascension and Tristan da Cunha"];
        let americasExlcude = ["Anguilla", "Aruba", "Bermuda", "Bonaire, Sint Eustatius and Saba", "United States Minor Outlying Islands", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Cayman Islands", "Curaçao", "Falkland Islands (Malvinas)", "French Guiana", "Greenland", "Guadeloupe", "Martinique", "Montserrat", "Saint Barthélemy", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Sint Maarten (Dutch part)", "South Georgia and the South Sandwich Islands", "Turks and Caicos Islands"];
        let oceaniaExlcude = ["American Samoa", "Christmas Island", "Cocos (Keeling) Islands", "French Polynesia", "Guam", "Micronesia (Federated States of)", "New Caledonia", "Norfolk Island", "Northern Mariana Islands", "Pitcairn", "Tokelau", "Wallis and Futuna"];
        let excludeAll = [...euroExlcude, ...asiaExlcude, ...africaExlcude, ...americasExlcude, ...oceaniaExlcude]
        copy.forEach(element => {
            if (continents.includes(element.region) && excludeAll.includes(element.name) == false)
                allCountries.push({ name: element.name, capital: element.capital, region: element.region, subregion: element.subregion })

        });

        function random(b) {
            let a, pos;
            for (let i = b.length - 1; i > 0; i--) {
                pos = Math.floor(Math.random() * (i + 1));
                a = b[i];
                b[i] = b[pos];
                b[pos] = a;
            }
            return b;
        }

        random(allCountries);
        let countriesNo = allCountries.lenght;
        function gameStart() {
            if (i === allCountries.length || distance < 0) {

                let removeDuplicates = [...allCountries.slice(i - skippedCount)];
                let set = new Set(removeDuplicates);
                removeDuplicates = Array.from(set);
                removeDuplicates.length !== 0 ?
                    document.getElementsByClassName('capital')[0].innerText = 'You missed or skipped the following: ' : '';

                for (let k = 0; k <= removeDuplicates.length - 1; k++) {
                    document.getElementsByClassName('capital')[0].innerHTML += "<br/>" + removeDuplicates[k].name + ' - ' + removeDuplicates[k].capital;
                }

                document.getElementsByClassName('country')[0].innerText = ''
                document.getElementsByClassName('userInput')[0].innerText = '';
                document.getElementsByClassName('capital')[0].className += ' missedCountries';

                if (count <= (allCountries.length - skippedCount) / 2)
                    document.getElementsByClassName('country')[0].className += ' loser'
                else if (count < (allCountries.length - skippedCount) / 10 * 9)
                    document.getElementsByClassName('country')[0].className += ' notbad'
                else
                    document.getElementsByClassName('country')[0].className += ' iznice'
            } else {
                document.getElementsByClassName('score')[0].textContent = 'Correct: ' + count + '/' + (allCountries.length - skippedCount);
                let country = allCountries[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                let capital = allCountries[i].capital.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                document.getElementsByClassName('country')[0].textContent = country;
                let hiddenCapital = capital.replace(/[A-Za-z]/g, "_");
                let writtenCapital = document.getElementsByClassName('capital')[0];
                writtenCapital.textContent = hiddenCapital;

                let input = document.querySelector('input');
                input.addEventListener("keydown", updateValue);
                input.addEventListener("keyup", updateValue);

                function updateValue(e) {
                    let pattern = new RegExp("^.{" + e.target.value.length + "}", "g");
                    console.log(e.key)
                    let newValue = writtenCapital.textContent.replace(pattern, e.target.value);
                    writtenCapital.textContent = newValue;
                    console.log('keydown', newValue)
                    console.log('written', writtenCapital.textContent);

                    let charactersRemaining = writtenCapital.textContent.length - e.target.value.length;
                    let slicedWord = hiddenCapital.slice(e.target.value.length, capital.length);
                    writtenCapital.textContent = e.target.value + slicedWord;
                    if (capital.toLowerCase() === e.target.value.toLowerCase()) {
                        i++;
                        count++;
                        e.target.value = '';
                        buttonData.removeEventListener("click", skipCountry, true);
                        gameStart();
                    }

                }

                function skipCountry(e) {
                    document.querySelector('input').value = ''
                    allCountries.push(allCountries[i]);
                    skippedCount++;
                    i++;
                    buttonData.removeEventListener("click", skipCountry, true);
                    gameStart();
                }
                let buttonData = document.querySelector('button');
                buttonData.addEventListener("click", skipCountry, true);
            }

        }
        gameStart();
        let timeout = new Date().getTime() + allCountries.length * 5 * 1000;
        let timeLeft = setInterval(function () {

            let now = new Date().getTime();
            distance = timeout - now;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            ;
            document.getElementsByClassName('score')[0].textContent = minutes + "m " + seconds + "s " + 'Correct: ' + count + '/' + (allCountries.length - skippedCount);
            if (distance < 0) {
                gameStart();
                clearInterval(timeLeft);
                document.getElementsByClassName('score')[0].textContent = 'Correct: ' + count + '/' + (allCountries.length - skippedCount);
            }
        }, 1000);
    }
}

function submitData() {
    params = '';
    document.getElementById('europe').checked ? params += "Europe=true&" : ''
    document.getElementById('oceania').checked ? params += "Oceania=true&" : ''
    document.getElementById('america').checked ? params += "Americas=true&" : ''
    document.getElementById('asia').checked ? params += "Asia=true&" : ''
    document.getElementById('africa').checked ? params += "Africa=true&" : ''
    if (!(document.getElementById('europe').checked || document.getElementById('oceania').checked
        || document.getElementById('america').checked || document.getElementById('asia').checked
        || document.getElementById('africa').checked)) window.alert('Select at least one continent')
    else
        document.getElementById('time').checked ? window.location.href = "./withTime.html?" + params : window.location.href = "./easy.html";
}

function getContinents(location) {
    let continents = [];
    const urlParams = new URLSearchParams(location);
    const Europe = urlParams.get('Europe');
    const Oceania = urlParams.get('Oceania');
    const Africa = urlParams.get('Africa');
    const Americas = urlParams.get('Americas');
    const Asia = urlParams.get('Asia');
    Europe ? continents.push('Europe') : '';
    Oceania ? continents.push('Oceania') : '';
    Africa ? continents.push('Africa') : '';
    Americas ? continents.push('Americas') : '';
    Asia ? continents.push('Asia') : '';
    return continents;
}
if (location.pathname.match(/.*withTime.*/)) {
    getData(getContinents(window.location.search));
}