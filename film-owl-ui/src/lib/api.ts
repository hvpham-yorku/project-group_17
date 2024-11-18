export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) throw new Error('Query cannot be empty.');

  const endpoint = `http://localhost:5000/search/${encodeURIComponent(query)}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data.Search || []; // Return an empty array if no results are found
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};