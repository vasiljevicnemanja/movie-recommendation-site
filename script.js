const apiKey = '8d0fe07b8f1ef569d4230b3a0d09f352'; // Tvoj TMDb API ključ
const baseUrl = 'https://api.themoviedb.org/3';
const button = document.getElementById('get-movie');
const movieInfoDiv = document.getElementById('movie-info');

// Niz podržanih jezika
const languages = ['en', 'es', 'it', 'fr', 'da', 'sv', 'ru', 'sr'];

// Funkcija za dohvat filma
async function getRandomMovie() {
  // Prikaz loading animacije dok se podaci učitavaju
  movieInfoDiv.innerHTML = '<div class="loading">Loading...</div>';

  try {
    // Nasumično odaberi jezik iz liste
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];

    // API zahtev za filmove sa nasumičnim jezikom
    const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&vote_average.gte=7.4&with_original_language=${randomLanguage}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Nasumično odaberi film iz rezultata
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const movie = data.results[randomIndex];

      // API zahtev za detalje o filmu (uključujući glavnu glumačku postavu)
      const movieDetailsResponse = await fetch(`${baseUrl}/movie/${movie.id}?api_key=${apiKey}&language=en-US&append_to_response=credits`);
      const movieDetails = await movieDetailsResponse.json();

      // Prikaz podataka o filmu
      movieInfoDiv.innerHTML = `
  <div style="text-align: center;">
    <h2>${movie.title}</h2>
    <p><strong>Rating:</strong> ${movie.vote_average}</p>
    <p><strong>Genres:</strong> ${movieDetails.genres.map(genre => genre.name).join(', ')}</p>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" style="width: 200px; border-radius: 10px; margin: 10px auto; display: block;">
    <p>${movie.overview}</p>
    <p><strong>Main Cast:</strong> ${movieDetails.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" style="color: #ff4757; text-decoration: none;">More Info</a>
  </div>
`;

    } else {
      // Ako nema rezultata za odabrani jezik
      movieInfoDiv.innerHTML = `<p>No movies found for the selected language (${randomLanguage}). Please try again.</p>`;
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    movieInfoDiv.innerHTML = `<p>Something went wrong: ${error.message}</p>`;
  }
}

// Dodavanje događaja za dugme
button.addEventListener('click', getRandomMovie);
