const PORT = 9000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const books = []

const book_clubs = [
    {
        name: "Reese Witherspoon",
        address: "https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl"
    },
    {
        name: "Jenna Bush Hager",
        address: "https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652"
    },
    {
        name: "Belletrist",
        address: "https://www.belletrist.com/archive"
    }


]

/*
book_clubs.forEach(club => {
    if (club.name === "Reese Witherspoon"){
        reese()
    }
    else if (club.name === "Jenna Bush Hager"){
        jenna()
    }
    else if (club.name === "Belletrist"){
        bellatrist()
    }
});
*/

app.get('/', (req, res) => {
    res.json("Welcome to my celebrity book clubs api")
})

app.get('/books', (req, res)=>{

    axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            $('span.css-h011xd', html).each(function(){
                if (($(this).text() != "\"")){

                    full_string = $(this).text().replace("\n", "").replace("“", "\"").replace("”", "\"").replace("’", "\'")                    

                    //console.log(full_string)
                    author = full_string.split("by")[1].trim()
                    title = full_string.split("\"")[1].trim()

                    //full date
                    date = full_string.split("\"")[0].trim()
                    //month
                    month = date.split(" ")[0]
                    //year
                    year = "20" + date.split("\'")[1]
                    
                    books.push({
                        full_string,
                        author,
                        title,
                        date,
                        month,
                        year
                    })
                    
                    //remove YA books
                    for (let i = 0; i < books.length; i++){
                        if (books[i].date.includes("YA")){
                            books.pop(i)
                        }
                    }

                }
            })
            res.json(books)
        }).catch((err) => console.log(err))
        
        
})

/*
function reese() {
    axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            $('span.css-h011xd', html).each(function(){
                if (($(this).text() != "\"")){

                    full_string = $(this).text().replace("\n", "").replace("“", "\"").replace("”", "\"").replace("’", "\'")                    

                    //console.log(full_string)
                    author = full_string.split("by")[1].trim()
                    title = full_string.split("\"")[1].trim()

                    //full date
                    date = full_string.split("\"")[0].trim()
                    //month
                    month = date.split(" ")[0]
                    //year
                    year = "20" + date.split("\'")[1]
                    
                    books.push({
                        full_string,
                        author,
                        title,
                        date,
                        month,
                        year
                    })
                    
                    //remove YA books
                    for (let i = 0; i < books.length; i++){
                        if (books[i].date.includes("YA")){
                            books.pop(i)
                        }
                    }

                }
            })
            res.json(books)
        }).catch((err) => console.log(err))
    }

    
    function jenna () {
        axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            $('span.css-h011xd', html).each(function(){
                if (($(this).text() != "\"")){

                    full_string = $(this).text().replace("\n", "").replace("“", "\"").replace("”", "\"").replace("’", "\'")                    

                    //console.log(full_string)
                    author = "Hello"
                    title = "Hello"

                    //full date
                    date = "Hello"
                    //month
                    month = "Hello"
                    //year
                    year = "Hello"
                    
                    books.push({
                        full_string,
                        author,
                        title,
                        date,
                        month,
                        year
                    })
                    
                    //remove YA books
                    for (let i = 0; i < books.length; i++){
                        if (books[i].date.includes("YA")){
                            books.pop(i)
                        }
                    }

                }
            })
            res.json(books)
        }).catch((err) => console.log(err))
    }

    function bellatrist() {
        axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            $('span.css-h011xd', html).each(function(){
                if (($(this).text() != "\"")){

                    full_string = $(this).text().replace("\n", "").replace("“", "\"").replace("”", "\"").replace("’", "\'")                    

                    //console.log(full_string)
                    author = "World"
                    title = "World"

                    //full date
                    date = "World"
                    //month
                    month = "World"
                    //year
                    year = "World"
                    
                    books.push({
                        full_string,
                        author,
                        title,
                        date,
                        month,
                        year
                    })
                    
                    //remove YA books
                    for (let i = 0; i < books.length; i++){
                        if (books[i].date.includes("YA")){
                            books.pop(i)
                        }
                    }

                }
            })
            res.json(books)
        }).catch((err) => console.log(err))
        res.json(books)
    }

*/

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

