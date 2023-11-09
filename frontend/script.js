document.addEventListener("DOMContentLoaded", () => {
    const scrapeButton = document.getElementById("scrape-button");
  
    scrapeButton.addEventListener("click", () => {
      const keyword = document.getElementById("keyword").value;
  
      fetch(`/api/scrape?keyword=${keyword}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro na solicitação.");
          }
          return response.json();
        })
        .then((data) => {
          const resultsContainer = document.getElementById("results");
          resultsContainer.innerHTML = "";
  
          if (data.length === 0) {
            resultsContainer.innerHTML = "Nenhum resultado encontrado.";
          } else {
            data.forEach((product) => {
              const productDiv = document.createElement("div");
              productDiv.className = "product";
              productDiv.innerHTML = `
                <img src="${product.imageURL}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Avaliação: ${product.rating}</p>
                <p>Número de avaliações: ${product.reviews}</p>
              `;
              resultsContainer.appendChild(productDiv);
            });
          }
        })
        .catch((error) => {
          console.error("Erro na solicitação:", error);
          const resultsContainer = document.getElementById("results");
          resultsContainer.innerHTML = "Ocorreu um erro durante a solicitação.";
        });
    });
  });
  