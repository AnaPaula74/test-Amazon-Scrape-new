const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path'); 

const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/api/scrape', async (req, res) => {
  try {

    const amazonURL = 'https://www.amazon.com.br/s?k=' + req.query.keyword;
    const response = await axios.get(amazonURL);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const productDetails = [];

      $('.s-result-item').each((index, element) => {
        const productTitle = $(element).find('.s-title-instructions-span').text();
        const rating = $(element).find('.a-popover-trigger').text();
        const numReviews = $(element).find('.s-rating-dot-span').text();
        const imageURL = $(element).find('.s-image').attr('src');

        const product = {
          title: productTitle,
          rating,
          reviews: numReviews,
          imageURL,
        };

        productDetails.push(product);
      });

      res.json(productDetails);
    } else {
      res.status(500).send('Falha ao buscar a página da Amazon.');
    }
  } catch (error) {
    console.error('Erro de scraping:', error);
    res.status(500).send('Ocorreu um erro durante o scraping.');
  }
});

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});