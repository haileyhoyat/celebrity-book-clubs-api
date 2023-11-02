const PORT = 9000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const books = []

const book_clubs = [
    
    {
        name: "Jenna Bush Hager",
        address: "https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652"
    }


]
/*
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
*/

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


app.get('/', (req, res) => {
    res.json("Welcome to my celebrity book clubs api")
})

app.get('/books', (req, res)=>{
    res.json(books)     
})


function reese() {
    axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            //elements of class .span.css-h011xd contains title, quthor, date, month, year
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
            
        }).catch((err) => console.log(err))
    }

    
    function jenna () {
        axios.get('https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)

            jenna_staging = []

            var current_month = ''
            count_title = 0
            count_date = 0

            //.article-body__content is the class of the element that contains the book list
            //returns an object from which you can extract its children
            // the children are string of various info
            //need to filter out children that are not useful
            $('.article-body__content').children().each(function(){
                //console.log($(this).text())
                full_string = $(this).text()
                
                //put children in a staging array
                jenna_staging.push({
                    full_string
                })

                
                //filter out empty children
                //filter out children that are links to place to buy the book
                for (let i = 0; i < jenna_staging.length; i++){
                    if (
                        
                        (jenna_staging[i].full_string === "") || 
                        (jenna_staging[i].full_string.includes("Amazon")) ||
                        (jenna_staging[i].full_string.includes("Bookshop.org")))
                        {
                               jenna_staging.pop(i) 
                        }
                }

                console.log(jenna_staging)
                //filter out intro paragraphs which are first three children
                //filter out last child which is Stephanie Larratt's contact
                //jenna_staging = jenna_staging.slice(3, jenna_staging.length-2)
                
                //now start putting elements into books[]

                

            })
            
        }).catch((err) => console.log(err))
    }



app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

