const text=document.getElementById("quote");

const getNewQuote = async () =>
{
    //quote db
    var url="./db.json";

    // fetch the data from api
    const response=await fetch(url);
    console.log(typeof response);
    //convert response to json and store it in quotes array
    const allQuotes = await response.json();

    // Generates a random number between 0 and the length of the quotes array
    const indx = Math.floor(Math.random()*allQuotes.length);

    //Store the quote present at the randomly generated index
    const quote=allQuotes[indx].text;

    //function to dynamically display the quote
    text.innerHTML=quote;
}

getNewQuote();