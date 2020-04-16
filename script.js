
let i = 0, count = 0, missedCountries = [];
console.log('HERE')
async function getData(continents) {
    let url = 'https://restcountries.eu/rest/v2/all';
    console.log(continents, 'din data fyunct');
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
        function gameStart() {
            if (i == allCountries.length) {
                console.log(missedCountries)
                document.getElementsByClassName('capital')[0].innerText = 'You missed the following: ';
                missedCountries.forEach(element => {
                    document.getElementsByClassName('capital')[0].innerHTML += "<br/>" + element.country + ' - ' + element.capital;
                })
                document.getElementsByClassName('country')[0].innerText = ''
                document.getElementsByClassName('userInput')[0].innerText = '';
                document.getElementsByClassName('capital')[0].className += ' missedCountries';
                if (count <= allCountries.length / 2)
                    document.getElementsByClassName('country')[0].className += ' loser'
                else if (count < allCountries.length / 10 * 9) document.getElementsByClassName('country')[0].className += ' notbad'
                else document.getElementsByClassName('country')[0].className += ' iznice'
            } else {
                let country = allCountries[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                let capital = allCountries[i].capital.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                let writtenCapital = document.getElementsByClassName('capital')[0];
                let input = document.querySelector('input');
                input.addEventListener("keyup", updateValue);

                function updateValue(e) {

                    let pattern = new RegExp("^.{" + e.target.value.length + "}", "g");
                    let newValue = writtenCapital.textContent.replace(pattern, e.target.value);
                    writtenCapital.textContent = newValue;
                    let charactersRemaining;

                    if (e.target.value.length < writtenCapital.textContent.length) {
                        charactersRemaining = writtenCapital.textContent.length - e.target.value.length;
                        writtenCapital.textContent = e.target.value + '_'.repeat(charactersRemaining)
                    }

                    if (capital.toLowerCase() === e.target.value.toLowerCase()) {
                        i++;
                        console.log('SUNT EGALE')
                        count++;
                        e.target.value = '';
                        buttonData.removeEventListener("click", skipCountry, true);
                        gameStart();
                    }

                }

                document.getElementsByClassName('country')[0].textContent = country;

                document.getElementsByClassName('score')[0].textContent = 'Correct: ' + count + '/' + allCountries.length;
                let hiddenCapital = capital.replace(/[A-Za-z]/g, "_");
                document.getElementsByClassName('capital')[0].textContent = hiddenCapital;
                //console.log(capital);
                function skipCountry() {
                    console.log(country)
                    missedCountries.push({ country: country, capital: capital })
                    i++;
                    buttonData.removeEventListener("click", skipCountry, true);
                    gameStart();

                }
                let buttonData = document.querySelector('button');
                buttonData.addEventListener("click", skipCountry, true);
            }

        }
        gameStart()
        console.log(allCountries.length);
        let timeout = new Date().getTime() + allCountries.length * 5 * 1000; //add 5 seconds/country
        let timeLeft = setInterval(function () {

            let now = new Date().getTime();
            distance = timeout - now;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementsByClassName('score')[0].textContent = minutes + "m " + seconds + "s " + 'Correct: ' + count + '/' + allCountries.length;
            if (distance < 0) {
                i = allCountries.length;
                gameStart();
                clearInterval(timeLeft);
                document.getElementsByClassName('score')[0].textContent = 'Correct: ' + count + '/' + allCountries.length;
                console.log('time up')
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
    console.log('aaaaaaaaaaa')
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
    
    console.log('ddddddddd',window.location.search)
    getData(getContinents(window.location.search));
   
}