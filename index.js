const PORT = 9000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const books = []

//all book clubs to scrape from
const book_clubs = [
    
    
    /*
    {
        name: "Belletrist",
        address: "https://www.belletrist.com/archive"
    }
    
    */
    {
        name: "reesewitherspoon",
        address: "https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl"
    },
    {
        name: "jennabushhager",
        address: "https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652"
    },
    {
        name: "goodmorningamerica",
        address: "https://www.goodmorningamerica.com/culture/story/shop-gma-book-club-picks-list--81520726"
    }
    

]

//retireve books from all items book_clubs[]
book_clubs.forEach(club => {
    if (club.name === "reesewitherspoon"){
        reese()
    }
    else if (club.name === "jennabushhager"){
        jenna()
    }
    else if (club.name === "goodmorningamerica"){
        goodmorningamerica()
    }
    else if (club.name === "belletrist"){
        //
    }
});

//welcome page to api
app.get('/', (req, res) => {
    res.json("Welcome to my celebrity book clubs api")
})

//retireve items in books[] and display as json{}
app.get('/books', (req, res)=>{
    res.json(books)     
})

//retrieve items for a specific bookclub and display as json{}
app.get('/books/:bookclub', (req, res) => {
    //console.log(req.params.bookclub)
    const book_club_host = req.params.bookclub
    var specific_books = []

    //console.log(book_club_host)

    if (book_club_host == "reesewitherspoon"){
        specific_books = books.filter(book => book.book_club == "reesewitherspoon")  
    }
    
    if(book_club_host == "jennabushhager"){
        specific_books = books.filter(book => book.book_club == "jennabushhager")
    }

    if(book_club_host == "goodmorningamerica"){
        specific_books = books.filter(book => book.book_club == "goodmorningamerica")
    }
    
    res.json(specific_books)

})


function reese() {
    axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            //console.log(html)
            //elements of class .span.css-h011xd contains title, author, date, month, year
            $('p span.css-h011xd', html).each(function(){
                if (($(this).text() != "\"")){

                    //replace slanted quotation and line breaks with straight quotations
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

                    //remove YA books
                    /*for (let i = 0; i < books.length; i++){
                        if (date.includes("YA")){
                            books.pop(i)
                        }
                    }*/
                    
                    
                    books.push({
                        //full_string: full_string,
                        book_club: 'reesewitherspoon',
                        title,
                        author,
                        month,
                        year
                    })
                    
                    

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
        current_month = ''
        current_year = ''

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

            
            
            
        })
        
        //remove intro paragrahs (first three children) and contact elements (last two children)
        jenna_staging = jenna_staging.slice(3, jenna_staging.length-2)
        //console.log(jenna_staging)
        
        //remaining elements are months and books/authors
        //if element is a month, element it the current_month
        //else if element is not a month, element is the book/author for the year
        //console.log(jenna_staging[2])
        for (let i = 0; i < jenna_staging.length; i++){
            
            if((jenna_staging[i].full_string.includes('2019')) || 
                (jenna_staging[i].full_string.includes('2020')) ||
                (jenna_staging[i].full_string.includes('2021')) ||
                (jenna_staging[i].full_string.includes('2022')) ||
                (jenna_staging[i].full_string.includes('2023')) ||
                (jenna_staging[i].full_string.includes('2024'))){
                current_month = jenna_staging[i].full_string.split(" ")[0]
                current_year = jenna_staging[i].full_string.split(" ")[1]
            }
            else{
                author = jenna_staging[i].full_string.split(" by ")[1].trim()
                title = (jenna_staging[i].full_string.split(" by ")[0]).replace("“", "").replace("”", "").replace("\"", "").replace(",", "")
                //console.log(title)
                books.push({
                    //full_string: full_string,
                    book_club: 'jennabushhager',
                    title,
                    author,
                    month: current_month,
                    year: current_year
                })
            }
        
        }
        
       
        
    }).catch((err) => console.log(err))
}

function goodmorningamerica() {
    axios.get('https://www.goodmorningamerica.com/culture/story/shop-gma-book-club-picks-list--81520726')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            all_items = []
            dates = []
            book_title_author = []
            //console.log(html)
            //the date is in an h3 tag, the book title and book author is in another h3 tag
            $('h3', html).each(function(){
                full_string = $(this).text()
                all_items.push(full_string)
                
                if ((full_string.includes('2024')) || full_string.includes('2023') || full_string.includes('2022') || full_string.includes('2021') || full_string.includes('2020') || full_string.includes('2019')){
                    dates.push(full_string)
                }
                else{
                    book_title_author.push(full_string)
                }
                
                
            })
            
            //last four items iin book_title_author are ads
            book_title_author.pop()
            book_title_author.pop()
            book_title_author.pop()
            book_title_author.pop()
            
            console.log(dates)
            console.log(dates.length)
            console.log(book_title_author)
            console.log(book_title_author.length)
            
            for (let i = 0; i < dates.length; i++){
                

                title = book_title_author[i].split("by")[0].trim()

                //sometimes the author is missing
                try{
                    author = book_title_author[i].split("by")[1].trim()
                }catch{
                    author = "N/A"
                }

                month = dates[i].split(" ")[0].trim()
                year = dates[i].split(" ")[1].trim()
                books.push({
                    //full_string: full_string,
                    book_club: 'goodmorningamerica',
                    title,
                    author,
                    month,
                    year,
                })
            }

        }).catch((err) => console.log(err))
    
}


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

