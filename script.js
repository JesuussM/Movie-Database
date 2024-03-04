// Retrieves data when enter key is pressed while typing in the search bar
function checkKey(e) {
    if (e.key === 'Enter') {
        retrieveData();
    }
}

function retrieveData() {
    // Resets the results for each search
    let resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    // Gets input from search bar
    let endpoint = document.getElementById('searchInput').value

    // Fetches data from the API
    fetch('https://search.imdbot.workers.dev/?q=' + endpoint)
    .then(response => response.json())
    .then(data => {
        // Gets the results from the API
        let resultTitle = data.description.map(item => item["#TITLE"]);
        let resultYear = data.description.map(item => item["#YEAR"]);
        let resultPoster = data.description.map(item => item["#IMG_POSTER"]);
        let resultURL = data.description.map(item => item["#IMDB_URL"]);
        let resultID = data.description.map(item => item["#IMDB_ID"]);

        // For every result...
        for (let i=0; i<resultTitle.length; i++) {
            // Create a card
            let resultBox = document.createElement('div');
            resultBox.id = 'resultsBox';
            resultBox.onclick = 'toggleHidden()';
            resultsContainer.appendChild(resultBox);

            // Add the poster to the card
            let posterBox = document.createElement('div');
            posterBox.id = 'posterBox';
            posterBox.innerHTML = '<img id="poster" src="' + resultPoster[i] + '" alt="Poster Not Available">';
            resultBox.appendChild(posterBox);

            // Creates div for the info
            let infoBox = document.createElement('div');
            infoBox.id = 'infoBox';
            resultBox.appendChild(infoBox);

            // Add the title to the card
            let nameBox = document.createElement('div');
            nameBox.id = 'nameBox';
            nameBox.innerHTML = resultTitle[i];
            infoBox.appendChild(nameBox);

            // Creates div for the year and stars
            let yearStarsBox = document.createElement('div');
            yearStarsBox.id = 'yearStarsBox';
            infoBox.appendChild(yearStarsBox);

            // Add the year to the card
            let yearBox = document.createElement('div');
            yearBox.id = 'yearBox';
            if (resultYear[i] == undefined) {
                yearBox.innerHTML = 'N/A';
            } else {
                yearBox.innerHTML = resultYear[i];
            }
            yearStarsBox.appendChild(yearBox);

            // Fetches more data for movie
            fetch('https://search.imdbot.workers.dev/?tt=' + resultID[i])
                .then(response => response.json())
                .then(data => {
                    // Add the stars to the card
                    let resultStars;
                    if (data && data.short && data.short.aggregateRating && data.short.aggregateRating.ratingValue) {
                        resultStars = data.short.aggregateRating.ratingValue;
                    } else {
                        resultStars = 'N/A';
                    }
                    let starsBox = document.createElement('div');
                    starsBox.id = 'starsBox';
                    if (resultStars == undefined) {
                        starsBox.innerHTML = '<i class="fa-solid fa-star" style="color: #FFD43B;"></i> N/A';
                    } else {
                        starsBox.innerHTML = '<i class="fa-solid fa-star" style="color: #FFD43B;"></i> ' + resultStars;
                    }
                    yearStarsBox.appendChild(starsBox);

                    // Add the rating to the card
                    let resultRating = data.short.contentRating;
                    let ratingBox = document.createElement('div');
                    ratingBox.id = 'ratingBox';
                    if (resultRating == undefined) {
                        ratingBox.innerHTML = 'Not Rated';
                    } else {
                        ratingBox.innerHTML = resultRating;
                    }
                    infoBox.appendChild(ratingBox);

                    // Add the genre to the card
                    let resultGenre = data.short.genre;
                    let genreBox = document.createElement('div');
                    genreBox.id = 'genreBox';
                    for (let i=0; i<resultGenre.length; i++) {
                        if (i == resultGenre.length - 1) {
                            genreBox.innerHTML += resultGenre[i];
                            break;
                        } else {
                            genreBox.innerHTML += resultGenre[i] + ', ';
                        }
                    }
                    infoBox.appendChild(genreBox);

                    // Creates the see more text
                    let seeMoreText = document.createElement('div');
                    seeMoreText.id = 'seeMoreBox';
                    seeMoreText.style.display = 'block';
                    seeMoreText.innerHTML = 'Click card to see description <i class="fa-solid fa-caret-down"></i>';
                    infoBox.appendChild(seeMoreText);

                    // Creates the hidden info box
                    let hiddenInfoBox = document.createElement('div');
                    hiddenInfoBox.id = 'hiddenInfo';
                    hiddenInfoBox.style.display = 'none';
                    resultBox.appendChild(hiddenInfoBox);

                    // Add the description to the card
                    let resultDescription;
                    // Checks if there is a description available
                    if (data.storyLine && data.storyLine.outlines && data.storyLine.outlines.edges[0]) {
                        resultDescription = data.storyLine.outlines.edges[0].node.plotText.plaidHtml;
                    } else {
                        resultDescription = 'No description available.';
                    }
                    let descriptionBox = document.createElement('div');
                    descriptionBox.id = 'plotBox';
                    descriptionBox.innerHTML = resultDescription;
                    hiddenInfoBox.appendChild(descriptionBox);


                    // Toggles the hidden info for clicked card
                    resultBox.addEventListener('click', function(event) {
                        let clickedCard = event.currentTarget;
                        toggleHidden(clickedCard);
                    });

                    // Creates hidden footer box
                    let resultFooter = document.createElement('div');
                    resultFooter.id = 'trailerImdbBox';
                    hiddenInfoBox.appendChild(resultFooter);

                    // Add the trailer link to the card
                    let resultTrailer = data.short.trailer.embedUrl;
                    let trailerBox = document.createElement('div');
                    trailerBox.id = 'trailerBox';
                    trailerBox.innerHTML = '<a href="' + resultTrailer + '" target="_blank">Watch Trailer</a>';
                    resultFooter.appendChild(trailerBox);

                    // Add the imdb link to the card
                    let resultImdb = resultURL[i];
                    let imdbBox = document.createElement('div');
                    imdbBox.id = 'imdbBox';
                    imdbBox.innerHTML = 'See more infomation on <a href="' + resultImdb +'" target="_blank">IMDb </a><i class="fa-brands fa-imdb"></i>';
                    resultFooter.appendChild(imdbBox);
            });
        }
    });

    // Makes the cards visible
    let resultsBox = document.querySelector("#resultsBox");
    if (resultsBox) {
        resultsBox.style.display = "block";
    }
}

// Toggles the hidden info for clicked card
function toggleHidden(card) {
    let hiddenInfo = card.querySelector("#hiddenInfo");
    let seeMore = card.querySelector("#seeMoreBox");

    if (hiddenInfo.style.display === "none") {
        hiddenInfo.style.display = "block";
        seeMore.style.display = "none";
    } else {
        hiddenInfo.style.display = "none";
        seeMore.style.display = "block";   
    }
}

// Makes sure the cards are hidden on load
window.onload = function() {
    let resultsBox = document.querySelector("#resultsBox");
    if (resultsBox) {
        resultsBox.style.display = "none";
    }
};

// A joke button that always returns the same movies
// SpiderVerse Movies (My favorite movies)
function notReallyRandom() {
    // Resets the results
    let resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    Promise.all([
        fetch('https://search.imdbot.workers.dev/?tt=tt4633694'),
        fetch('https://search.imdbot.workers.dev/?tt=tt9362722'),
        fetch('https://search.imdbot.workers.dev/?tt=tt16360004')
    ]).then(async ([response1, response2, response3]) => {
        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();

        // Create the cards
        let resultBox1 = document.createElement('div');
        resultBox1.id = 'resultsBox';
        resultBox1.onclick = 'toggleHidden()';
        resultsContainer.appendChild(resultBox1);

        let resultBox2 = document.createElement('div');
        resultBox2.id = 'resultsBox';
        resultBox2.onclick = 'toggleHidden()';
        resultsContainer.appendChild(resultBox2);

        let resultBox3 = document.createElement('div');
        resultBox3.id = 'resultsBox';
        resultBox3.onclick = 'toggleHidden()';
        resultsContainer.appendChild(resultBox3);

        // Add the poster to the card
        let resultPoster1 = data1.short.image;
        let posterBox1 = document.createElement('div');
        posterBox1.id = 'posterBox';
        posterBox1.innerHTML = '<img id="poster" src="' + resultPoster1 + '" alt="Poster Not Available">';
        resultBox1.appendChild(posterBox1);

        let resultPoster2 = data2.short.image;
        let posterBox2 = document.createElement('div');
        posterBox2.id = 'posterBox';
        posterBox2.innerHTML = '<img id="poster" src="' + resultPoster2 + '" alt="Poster Not Available">';
        resultBox2.appendChild(posterBox2);

        let resultPoster3 = data3.short.image;
        let posterBox3 = document.createElement('div');
        posterBox3.id = 'posterBox';
        posterBox3.innerHTML = '<img id="poster" src="' + resultPoster3 + '" alt="Poster Not Available">';
        resultBox3.appendChild(posterBox3);

        // Creates div for the info
        let infoBox1 = document.createElement('div');
        infoBox1.id = 'infoBox';
        resultBox1.appendChild(infoBox1);

        let infoBox2 = document.createElement('div');
        infoBox2.id = 'infoBox';
        resultBox2.appendChild(infoBox2);

        let infoBox3 = document.createElement('div');
        infoBox3.id = 'infoBox';
        resultBox3.appendChild(infoBox3);

        // Add the title to the card
        let resultTitle1 = data1.short.name;
        let nameBox1 = document.createElement('div');
        nameBox1.id = 'nameBox';
        nameBox1.innerHTML = resultTitle1;
        infoBox1.appendChild(nameBox1);

        let resultTitle2 = data2.short.name;
        let nameBox2 = document.createElement('div');
        nameBox2.id = 'nameBox';
        nameBox2.innerHTML = resultTitle2;
        infoBox2.appendChild(nameBox2);

        let resultTitle3 = data3.short.name;
        let nameBox3 = document.createElement('div');
        nameBox3.id = 'nameBox';
        nameBox3.innerHTML = resultTitle3;
        infoBox3.appendChild(nameBox3);

        // Creates div for the year and stars
        let yearStarsBox1 = document.createElement('div');
        yearStarsBox1.id = 'yearStarsBox';
        infoBox1.appendChild(yearStarsBox1);

        let yearStarsBox2 = document.createElement('div');
        yearStarsBox2.id = 'yearStarsBox';
        infoBox2.appendChild(yearStarsBox2);

        let yearStarsBox3 = document.createElement('div');
        yearStarsBox3.id = 'yearStarsBox';
        infoBox3.appendChild(yearStarsBox3);

        // Add the year to the card
        let resultYear1 = data1.top.releaseYear.year;
        let yearBox1 = document.createElement('div');
        yearBox1.id = 'yearBox';
        yearBox1.innerHTML = resultYear1;
        yearStarsBox1.appendChild(yearBox1);

        let resultYear2 = data2.top.releaseYear.year;
        let yearBox2 = document.createElement('div');
        yearBox2.id = 'yearBox';
        yearBox2.innerHTML = resultYear2;
        yearStarsBox2.appendChild(yearBox2);

        let resultYear3;
        if (data3 && data3.top && data3.top.releaseYear) {
            resultYear3 = data3.top.releaseYear.year;
        } else {
            resultYear3 = 'N/A';
        }
        let yearBox3 = document.createElement('div');
        yearBox3.id = 'yearBox';
        yearBox3.innerHTML = resultYear3;
        yearStarsBox3.appendChild(yearBox3);

        // Add the stars to the card
        let resultStars1 = data1.short.aggregateRating.ratingValue;
        let starsBox1 = document.createElement('div');
        starsBox1.id = 'starsBox';
        starsBox1.innerHTML = '<i class="fa-solid fa-star" style="color: #FFD43B;"></i> ' + resultStars1;
        yearStarsBox1.appendChild(starsBox1);

        let resultStars2 = data2.short.aggregateRating.ratingValue;
        let starsBox2 = document.createElement('div');
        starsBox2.id = 'starsBox';
        starsBox2.innerHTML = '<i class="fa-solid fa-star" style="color: #FFD43B;"></i> ' + resultStars2;
        yearStarsBox2.appendChild(starsBox2);

        let resultStars3;
        if (data3 && data3.short && data3.short.aggregateRating && data3.short.aggregateRating.ratingValue) {
            resultStars3 = data3.short.aggregateRating.ratingValue;
        } else {
            resultStars3 = 'N/A';
        }
        let starsBox3 = document.createElement('div');
        starsBox3.id = 'starsBox';
        starsBox3.innerHTML = '<i class="fa-solid fa-star" style="color: #FFD43B;"></i> ' + resultStars3;
        yearStarsBox3.appendChild(starsBox3);

        // Add the rating to the card
        let resultRating1 = data1.short.contentRating;
        let ratingBox1 = document.createElement('div');
        ratingBox1.id = 'ratingBox';
        ratingBox1.innerHTML = resultRating1;
        infoBox1.appendChild(ratingBox1);

        let resultRating2 = data2.short.contentRating;
        let ratingBox2 = document.createElement('div');
        ratingBox2.id = 'ratingBox';
        ratingBox2.innerHTML = resultRating2;
        infoBox2.appendChild(ratingBox2);

        let resultRating3 = data3.short.contentRating;
        if (resultRating3 == undefined) {
            resultRating3 = 'Not Rated';
        }
        let ratingBox3 = document.createElement('div');
        ratingBox3.id = 'ratingBox';
        ratingBox3.innerHTML = resultRating3;
        infoBox3.appendChild(ratingBox3);

        // Add the genre to the card
        let resultGenre1 = data1.short.genre;
        let genreBox1 = document.createElement('div');
        genreBox1.id = 'genreBox';
        for (let i=0; i<resultGenre1.length; i++) {
            if (i == resultGenre1.length - 1) {
                genreBox1.innerHTML += resultGenre1[i];
                break;
            } else {
                genreBox1.innerHTML += resultGenre1[i] + ', ';
            }
        }
        infoBox1.appendChild(genreBox1);

        let resultGenre2 = data2.short.genre;
        let genreBox2 = document.createElement('div');
        genreBox2.id = 'genreBox';
        for (let i=0; i<resultGenre2.length; i++) {
            if (i == resultGenre2.length - 1) {
                genreBox2.innerHTML += resultGenre2[i];
                break;
            } else {
                genreBox2.innerHTML += resultGenre2[i] + ', ';
            }
        }
        infoBox2.appendChild(genreBox2);

        let resultGenre3 = data3.short.genre;
        let genreBox3 = document.createElement('div');
        genreBox3.id = 'genreBox';
        for (let i=0; i<resultGenre3.length; i++) {
            if (i == resultGenre3.length - 1) {
                genreBox3.innerHTML += resultGenre3[i];
                break;
            } else {
                genreBox3.innerHTML += resultGenre3[i] + ', ';
            }
        }
        infoBox3.appendChild(genreBox3);

        // Creates the see more text
        let seeMoreText1 = document.createElement('div');
        seeMoreText1.id = 'seeMoreBox';
        seeMoreText1.style.display = 'block';
        seeMoreText1.innerHTML = 'Click card to see description <i class="fa-solid fa-caret-down"></i>';
        infoBox1.appendChild(seeMoreText1);

        let seeMoreText2 = document.createElement('div');
        seeMoreText2.id = 'seeMoreBox';
        seeMoreText2.style.display = 'block';
        seeMoreText2.innerHTML = 'Click card to see description <i class="fa-solid fa-caret-down"></i>';
        infoBox2.appendChild(seeMoreText2);

        let seeMoreText3 = document.createElement('div');
        seeMoreText3.id = 'seeMoreBox';
        seeMoreText3.style.display = 'block';
        seeMoreText3.innerHTML = 'Click card to see description <i class="fa-solid fa-caret-down"></i>';
        infoBox3.appendChild(seeMoreText3);

        // Creates the hidden info box
        let hiddenInfoBox1 = document.createElement('div');
        hiddenInfoBox1.id = 'hiddenInfo';
        hiddenInfoBox1.style.display = 'none';
        resultBox1.appendChild(hiddenInfoBox1);

        let hiddenInfoBox2 = document.createElement('div');
        hiddenInfoBox2.id = 'hiddenInfo';
        hiddenInfoBox2.style.display = 'none';
        resultBox2.appendChild(hiddenInfoBox2);

        let hiddenInfoBox3 = document.createElement('div');
        hiddenInfoBox3.id = 'hiddenInfo';
        hiddenInfoBox3.style.display = 'none';
        resultBox3.appendChild(hiddenInfoBox3);

        // Add the description to the card
        let resultDescription1 = data1.storyLine.outlines.edges[0].node.plotText.plaidHtml;
        let descriptionBox1 = document.createElement('div');
        descriptionBox1.id = 'plotBox';
        descriptionBox1.innerHTML = resultDescription1;
        hiddenInfoBox1.appendChild(descriptionBox1);

        let resultDescription2 = data2.storyLine.outlines.edges[0].node.plotText.plaidHtml;
        let descriptionBox2 = document.createElement('div');
        descriptionBox2.id = 'plotBox';
        descriptionBox2.innerHTML = resultDescription2;
        hiddenInfoBox2.appendChild(descriptionBox2);

        let resultDescription3 = data3.storyLine.outlines.edges[0].node.plotText.plaidHtml;
        let descriptionBox3 = document.createElement('div');
        descriptionBox3.id = 'plotBox';
        descriptionBox3.innerHTML = resultDescription3;
        hiddenInfoBox3.appendChild(descriptionBox3);

        // Toggles the hidden info for clicked card
        resultBox1.addEventListener('click', function(event) {
            let clickedCard = event.currentTarget;
            toggleHidden(clickedCard);
        });

        resultBox2.addEventListener('click', function(event) {
            let clickedCard = event.currentTarget;
            toggleHidden(clickedCard);
        });

        resultBox3.addEventListener('click', function(event) {
            let clickedCard = event.currentTarget;
            toggleHidden(clickedCard);
        });

        // Creates hidden footer box
        let resultFooter1 = document.createElement('div');
        resultFooter1.id = 'trailerImdbBox';
        hiddenInfoBox1.appendChild(resultFooter1);

        let resultFooter2 = document.createElement('div');
        resultFooter2.id = 'trailerImdbBox';
        hiddenInfoBox2.appendChild(resultFooter2);

        let resultFooter3 = document.createElement('div');
        resultFooter3.id = 'trailerImdbBox';
        hiddenInfoBox3.appendChild(resultFooter3);

        // Add the trailer link to the card
        let resultTrailer1 = data1.short.trailer.embedUrl;
        let trailerBox1 = document.createElement('div');
        trailerBox1.id = 'trailerBox';
        trailerBox1.innerHTML = '<a href="' + resultTrailer1 + '" target="_blank">Watch Trailer</a>';
        resultFooter1.appendChild(trailerBox1);

        let resultTrailer2 = data2.short.trailer.embedUrl;
        let trailerBox2 = document.createElement('div');
        trailerBox2.id = 'trailerBox';
        trailerBox2.innerHTML = '<a href="' + resultTrailer2 + '" target="_blank">Watch Trailer</a>';
        resultFooter2.appendChild(trailerBox2);

        let resultTrailer3 = data3.short.trailer.embedUrl;
        let trailerBox3 = document.createElement('div');
        trailerBox3.id = 'trailerBox';
        trailerBox3.innerHTML = '<a href="' + resultTrailer3 + '" target="_blank">Watch Trailer</a>';
        resultFooter3.appendChild(trailerBox3);

        // Add the imdb link to the card
        let resultImdb1 = data1.short.url;
        let imdbBox1 = document.createElement('div');
        imdbBox1.id = 'imdbBox';
        imdbBox1.innerHTML = 'See more infomation on <a href="' + resultImdb1 +'" target="_blank">IMDb </a><i class="fa-brands fa-imdb"></i>';
        resultFooter1.appendChild(imdbBox1);

        // Add the imdb link to the card
        let resultImdb2 = data2.short.url;
        let imdbBox2 = document.createElement('div');
        imdbBox2.id = 'imdbBox';
        imdbBox2.innerHTML = 'See more infomation on <a href="' + resultImdb2 +'" target="_blank">IMDb </a><i class="fa-brands fa-imdb"></i>';
        resultFooter2.appendChild(imdbBox2);

        // Add the imdb link to the card
        let resultImdb3 = data3.short.url;
        let imdbBox3 = document.createElement('div');
        imdbBox3.id = 'imdbBox';
        imdbBox3.innerHTML = 'See more infomation on <a href="' + resultImdb3 +'" target="_blank">IMDb </a><i class="fa-brands fa-imdb"></i>';
        resultFooter3.appendChild(imdbBox3);
    });
}