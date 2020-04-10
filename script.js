async function getData() {
    let url = 'https://restcountries.eu/rest/v2/all';
    let data = await fetch(url)
        .then(res => res.json())
        .then(data => data);
    if (data) {
        let copy = data;
        let allCountries = [];
        let euroExlcude = ["Åland Islands", "Faroe Islands", "Gibraltar", "Guernsey", "Isle of Man", "Jersey", "Svalbard and Jan Mayen"]
        // let asiaExlcude = [];
        // let africaExlcude = [];
        // let americasExlcude = [];
        // let oceaniaExlcude = [];

        copy.forEach(element => {
            if (element.region == 'Europe' && euroExlcude.includes(element.name) == false)
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
        let i = 0;
        let count=0;

        function gameStart() {
            let country = allCountries[i].name;
            let capital = allCountries[i].capital;
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
                
                
                if (capital.toLowerCase() === e.target.value) {
                    i++;
                    count++;
                    e.target.value = ''
                    gameStart();
                }

            }
            document.getElementsByClassName('country')[0].textContent = country;
            document.getElementsByClassName('score')[0].textContent='Correct: '+ count + '/' + allCountries.length;
            let hiddenCapital = capital.replace(/[A-Za-z]/g, "_");
            document.getElementsByClassName('capital')[0].textContent = hiddenCapital;
            console.log(capital);

        }
        gameStart()

    }
}

getData();