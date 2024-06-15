import fetch from 'node-fetch';

export const fetchDataFromApi = async (req, res) => {
  const { movie } = req.query; // Extract the movie type from query parameters
  const url = `https://api.themoviedb.org/3/movie/${movie}`;
  
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjBmNTE4Njc1MDllOGY3ZTNmNmJiYTEwNDMxNGJiOCIsInN1YiI6IjY1Yjc0NDZmMGZiMTdmMDE3YjM0NWIzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4AnGH3FzC1JV5ieiqMiJKdbDRtNxSM0RTsDcVpqW5_Y'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // Send the fetched data as the response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};
