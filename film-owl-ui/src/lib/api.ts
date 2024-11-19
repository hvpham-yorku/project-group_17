export interface Movie {
  image_url: string;
  genre: string;
  id: string;
  release_date: string;
  title: string;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) throw new Error('Query cannot be empty.');

  const endpoint = `http://localhost:5002/search/${encodeURIComponent(query)}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data.Search; 
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};