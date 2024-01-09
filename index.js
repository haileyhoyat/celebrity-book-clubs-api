/*MOST RECENT SCRAPE FOR ALL LISTS: 01-08-2024*/


const PORT = process.env.PORT || 9000
const express = require('express')
const axios = require('axios') //scraping package
const cheerio = require('cheerio') //jQuery for node.js
const app = express() //web framework for node.js

//git commands single line: git add . && git commit -m "fix" && git push

//list of books from all book lists
const books = []

//list of book lists to scrape from
const book_lists = [
    
    
    /*
    
    
    */
    {
        name: "reesewitherspoon",
        address: "https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl"
    },
    {
        name: "goodmorningamerica",
        address: "https://www.goodmorningamerica.com/culture/story/shop-gma-book-club-picks-list--81520726"
    },
    
    {
        name: "todayshow",
        address: "https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652"
    },
    
    

]

async function getbooks(){
    // await reese()
    // await todayshow()
    // await goodmorningamerica()
    // await nytcombinedprintandebookfiction()
    // await nytcombinedprintandebooknonfiction()
    // await nationalbookawardsfiction()
    // await nationalbookawardsnonfiction()
    // await nationalbookawardspoetry()
    // await nationalbookawardsyoungpeoplesliterature()
    await oprahwinfrey()
}

getbooks()

// book_lists.forEach(list => {
//     if (list.name === "reesewitherspoon"){
//         reese()
//     }
//     else if (list.name === "todayshow"){
//         todayshow()
//     }
//     else if (list.name === "goodmorningamerica"){
//         goodmorningamerica()
//     }
    
// });

//welcome page to api
app.get('/', (req, res) => {
    
    welcome_message = 
    "Welcome to the BList. This is an API that aggregates well-known book lists. " +
    "Checkout the codebase and API details here: https://github.com/haileyhoyat/celebrity-book-clubs-api."
    res.json(welcome_message)
    //res.on('finish',get_all_books());
})

//retireve items in books[] and display as json{}
app.get('/books', (req, res)=>{
    
    res.json(books)     


})

//retrieve items for a specific booklist and display as json{}
app.get('/books/:booklist', (req, res) => {
    //console.log(req.params.bookclub)
    const book_club_host = req.params.booklist
    var specific_books = []


    if (book_club_host == "reesewitherspoon"){
        specific_books = books.filter(book => book.book_list == "reesewitherspoon")  
    } else if(book_club_host == "todayshow"){
        specific_books = books.filter(book => book.book_list == "todayshow")
    } else if(book_club_host == "goodmorningamerica"){
        specific_books = books.filter(book => book.book_list == "goodmorningamerica")
    } else if(book_club_host == "nyt-combined-print-and-e-book-fiction"){
        specific_books = books.filter(book => book.book_list == "nyt-combined-print-and-e-book-fiction")
    } else if(book_club_host == "nyt-combined-print-and-e-book-nonfiction"){
        specific_books = books.filter(book => book.book_list == "nyt-combined-print-and-e-book-nonfiction")
    }
    else {
        specific_books = "Book list is not valid."
    }

    res.json(specific_books)

})


function reese() {
    axios.get('https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            // elements = []
            // $('p.css-9n72cn', html).each(function(){
            //     elements.push($(this).text())
            // })
            
            // //remove intro paragrah and last two paragraghs
            // elements = elements.slice(1);
            // elements.pop()
            // elements.pop()

            // console.log(elements)


            $('p.css-9n72cn span.css-h011xd', html).each(function(){
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
                        book_list: 'reesewitherspoon',
                        source: 'https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl',
                        title,
                        author,
                        date: {
                            month,
                            year,
                            day: ""
                        },
                        description: ""
                        
                    })
                    
                    

                }
            })
            
        }).catch((err) => console.log(err))
}

    
function todayshow () {
    axios.get('https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652')
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        jenna_staging = []
        month = ''
        year = ''

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
                month = jenna_staging[i].full_string.split(" ")[0]
                year = jenna_staging[i].full_string.split(" ")[1]
            }
            else{
                author = jenna_staging[i].full_string.split(" by ")[1].trim()
                title = (jenna_staging[i].full_string.split(" by ")[0]).replace("“", "").replace("”", "").replace("\"", "").replace(",", "")
                //console.log(title)
                books.push({
                    //full_string: full_string,
                    book_list: 'todayshow',
                    source: 'https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652',
                    title,
                    author,
                    date: {
                        month,
                        year,
                        day: ""
                    },
                    description: ""
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
            
            //console.log(dates)
            //console.log(dates.length)
            //console.log(book_title_author)
            //console.log(book_title_author.length)
            
            for (let i = 0; i < dates.length; i++){
                

                title = book_title_author[i].split("by")[0].trim()

                //sometimes the author is missing
                try{
                    author = book_title_author[i].split("by")[1].trim()
                }catch{
                    author = ""
                }

                month = dates[i].split(" ")[0].trim()
                year = dates[i].split(" ")[1].trim()
                books.push({
                    //full_string: full_string,
                    book_list: 'goodmorningamerica',
                    source: 'https://www.goodmorningamerica.com/culture/story/shop-gma-book-club-picks-list--81520726',
                    title,
                    author,
                    date: {
                        month,
                        year,
                        day: ""
                    },
                    desription: ""
                    
                })
            }

        }).catch((err) => console.log(err))
    
}

//name of all nyt book lists : https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=BiSm5AsbV8v8j6MZqSP8dCBWbtGuUj8z
//all nyt book list ratings of current week :  https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=BiSm5AsbV8v8j6MZqSP8dCBWbtGuUj8z

//scrape goes back to week of 2022-10-16
function nytcombinedprintandebookfiction(){

    NYT_API_KEY = process.env.WEATHER_API_KEY

    function get_specific_week(date){
        var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

        axios.get(`https://api.nytimes.com/svc/books/v3/lists/${date}/combined-print-and-e-book-fiction.json?api-key=${NYT_API_KEY}`)
            .then((response) => {
                console.log(date)
                //the week's month
                month = response.data.results.published_date.split("-")[1]
                //the weeks' year
                year = response.data.results.published_date.split("-")[0]
                //the day
                day = response.data.results.published_date.split("-")[2]

                //get a book on this list from a a specific week
                book = response.data.results.books

                for (let i = 0; i < book.length; i++) {
                    //console.log(book[i])
                    title = book[i].title
                    author = book[i].author
                    description = book[i].description
                    books.push({
                        //full_string: full_string,
                        book_list: 'nyt-combined-print-and-e-book-fiction',
                        source: 'https://www.nytimes.com/books/best-sellers/',
                        title,
                        author,
                        date: {
                            month: months[month-1],
                            year: year,
                            day: day
                        },
                        description
                        
                    })
                }

                //only scrape weeks from most current week back to December 2023
                if (response.data.results.previous_published_date != '2023-11-26'){
                    //api has request limit. nyt suggests 12s between each request to avoid reaching limit, otherwise will get 429 error. 
                    //https://developer.nytimes.com/faq#a11
                    setTimeout(() => {
                        get_specific_week(response.data.results.previous_published_date)
                    }, "12000");
                }
            
        }).catch((err) => console.log(err))
    }

    //start at current week's list, and then work backwards
    get_specific_week('current')

}

//scrape goes back to week of 2022-10-16
function nytcombinedprintandebooknonfiction(){

    NYT_API_KEY = process.env.WEATHER_API_KEY

    function get_specific_week(date){
        var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

        axios.get(`https://api.nytimes.com/svc/books/v3/lists/${date}/combined-print-and-e-book-nonfiction.json?api-key=${NYT_API_KEY}`)
            .then((response) => {
                console.log(date)
                //the week's month
                month = response.data.results.published_date.split("-")[1]
                //the weeks' year
                year = response.data.results.published_date.split("-")[0]
                //the day
                day = response.data.results.published_date.split("-")[2]

                //get a book on this list from a a specific week
                book = response.data.results.books

                for (let i = 0; i < book.length; i++) {
                    //console.log(book[i])
                    title = book[i].title
                    author = book[i].author
                    description = book[i].description
                    books.push({
                        //full_string: full_string,
                        book_list: 'nyt-combined-print-and-e-book-nonfiction',
                        source: 'https://www.nytimes.com/books/best-sellers/',
                        title,
                        author,
                        date: {
                            month: months[month-1],
                            year: year,
                            day: day
                        },
                        description
                        
                    })
                }

                //only scrape weeks from most current week back to December 2023
                if (response.data.results.previous_published_date != '2023-11-26'){
                    //api has request limit. nyt suggests 12s between each request to avoid reaching limit, otherwise will get 429 error. 
                    //https://developer.nytimes.com/faq#a11
                    setTimeout(() => {
                        get_specific_week(response.data.results.previous_published_date)
                    }, "12000");
                }
            
        }).catch((err) => console.log(err))
    }

    //start at current week's list, and then work backwards
    get_specific_week('current')

}

function nationalbookawardsfiction(){
    axios.get('https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award')
        .then((response) => {
            const html = response.data
            //console.log(html)
            const $ = cheerio.load(html)
            all_elements = []
            //caption:contains('National Book Award for Fiction winners, 1984 to present')
            $(".wikitable caption:contains('National Book Award for Fiction winners, 1984 to present') + tbody tr", html).each(function(){
                
                //console.log($(this).text())

                all_elements.push($(this).text())

            })
            all_elements.shift()
            //console.log(all_elements)
            for (let i = 0 ; i < all_elements.length; i ++){
                //all_elements[i].split('\n')
                books.push({
                    //full_string: full_string,
                    book_list: 'nationalbookawardsfiction',
                    source: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award',
                    title: all_elements[i].split('\n')[5],
                    author: all_elements[i].split('\n')[3],
                    date: {
                        month:"",
                        year: all_elements[i].split('\n')[1],
                        day: ""
                    },
                    description: ""
                    
                })
            }

        })
}

function nationalbookawardsnonfiction(){
    axios.get('https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award')
        .then((response) => {
            const html = response.data
            //console.log(html)
            const $ = cheerio.load(html)
            all_elements = []
            //caption:contains('National Book Award for Fiction winners, 1984 to present')
            $(".wikitable caption:contains('National Book Award for Nonfiction winners, 1984 to present') + tbody tr", html).each(function(){
                
                //console.log($(this).text())

                all_elements.push($(this).text())

            })
            all_elements.shift()
            //console.log(all_elements)
            for (let i = 0 ; i < all_elements.length; i ++){
                //all_elements[i].split('\n')
                books.push({
                    //full_string: full_string,
                    book_list: 'nationalbookawardsnonfiction',
                    source: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award',
                    title: all_elements[i].split('\n')[5],
                    author: all_elements[i].split('\n')[3],
                    date: {
                        month:"",
                        year: all_elements[i].split('\n')[1],
                        day: ""
                    },
                    description: ""
                    
                })
            }

        })
}

function nationalbookawardspoetry(){
    axios.get('https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award')
        .then((response) => {
            const html = response.data
            //console.log(html)
            const $ = cheerio.load(html)
            all_elements = []
            //caption:contains('National Book Award for Fiction winners, 1984 to present')
            $(".wikitable caption:contains('National Book Award for Poetry winners, 1991 to present') + tbody tr", html).each(function(){
                
                //console.log($(this).text())

                all_elements.push($(this).text())

            })
            all_elements.shift()
            //console.log(all_elements)
            for (let i = 0 ; i < all_elements.length; i ++){
                //all_elements[i].split('\n')
                books.push({
                    //full_string: full_string,
                    book_list: 'nationalbookawardspoetry',
                    source: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award',
                    title: all_elements[i].split('\n')[5],
                    author: all_elements[i].split('\n')[3],
                    date: {
                        month:"",
                        year: all_elements[i].split('\n')[1],
                        day: ""
                    },
                    description: ""
                    
                })
            }

        })
}

function nationalbookawardsyoungpeoplesliterature(){
    axios.get('https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award')
        .then((response) => {
            const html = response.data
            //console.log(html)
            const $ = cheerio.load(html)
            all_elements = []
            //caption:contains('National Book Award for Fiction winners, 1984 to present')
            $(".wikitable caption:contains('National Book Award for Young People's Literature winners, 1996 to present') + tbody tr", html).each(function(){
                
                //console.log($(this).text())

                all_elements.push($(this).text())

            })
            all_elements.shift()
            //console.log(all_elements)
            for (let i = 0 ; i < all_elements.length; i ++){
                //all_elements[i].split('\n')
                books.push({
                    //full_string: full_string,
                    book_list: 'nationalbookawardsyoungpeoplesliterature',
                    source: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_National_Book_Award',
                    title: all_elements[i].split('\n')[5],
                    author: all_elements[i].split('\n')[3],
                    date: {
                        month:"",
                        year: all_elements[i].split('\n')[1],
                        day: ""
                    },
                    description: ""
                    
                })
            }

        })
}

function oprahwinfrey(){
    //last book https://www.oprah.com/book/before-40-great-expectations?editors_pick_id=26790
    getnexturl('https://www.oprah.com/book/oprahs-book-club-let-us-descend-by-jesmyn-ward?editors_pick_id=26790')
    //const response = await fetch('https://www.oprah.com/book/oprahs-book-club-let-us-descend-by-jesmyn-ward?editors_pick_id=26790')
    function getnexturl(url){
        axios.get(url)
            .then((response) => {
                const html = response.data
                //console.log(html)
                const $ = cheerio.load(html)
                var title = ''
                var author = ''
                $('.slideshow-body-book__slide-title', html).each(function(){
                    //console.log($(this).text())
                    title = $(this).text()

                })
                $('.byline', html).each(function(){
                    //console.log($(this).text())
                    author = ($(this).text()).split('By')[1].trim()
                })
                books.push({
                    //full_string: full_string,
                    book_list: 'oprahwinfrey',
                    source: 'https://www.oprah.com/app/books.html',
                    title,
                    author,
                    date: {
                        month:"",
                        year: "",
                        day: ""
                    },
                    description: ""
                    
                })
                url = $("a.articleslide-arrow-large-right").attr("href")
                if(url === ""){
                    exit
                }
                //console.log(url)
                getnexturl(url)
                
            }).catch((err) => {return})
    }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// Export the Express API
module.exports = app;

