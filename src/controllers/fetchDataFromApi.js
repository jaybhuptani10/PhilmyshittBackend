

export const fetchDataFromApi = async (req, res) => {
  const { movie } = req.query; // Extract the movie type from query parameters
  const url = `https://api.themoviedb.org/3/movie/${movie}`;
  
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:` ${process.env.Authorization}`
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

export const getMovieInfo = async (req, res) => {
  const { movie } = req.query; // Extract the movie type from query parameters
 
  const url = `https://api.themoviedb.org/3/movie/${movie}`;
  
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:` ${process.env.Authorization}`
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
export const getSeriesInfo = async (req, res) => {
  const { series } = req.query; // Extract the movie type from query parameters
  
  const url = `https://api.themoviedb.org/3/search/${series}`;
  
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:` ${process.env.Authorization}`
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
export const getSearchedMovie = async (req, res) => {
  const { result } = req.query; // Extract the movie type from query parameters

  const url = `https://api.themoviedb.org/3/search/${result}`;
  
  
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:` ${process.env.Authorization}`
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
export const getMovieDetails = async (req, res) => {

   // Extract both id and type from query parameters
    const { id, type } = req.query;
   // Extract the movie type from query parameters

   const url = `https://api.themoviedb.org/3/movie/${id}/${type}`;
   
   
   try {
     const options = {
       method: 'GET',
       headers: {
         accept: 'application/json',
         Authorization:` ${process.env.Authorization}`
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
