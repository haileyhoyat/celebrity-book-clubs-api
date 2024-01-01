Hello, this is the API for the BList. This API aggregates books from various book lists. 

The book_lists that are currently being scraped are:
- reese: book club for Reese Witherspoon (https://reesesbookclub.com/article/4eRlfCOXueqPrm6ZnQpzwl)
- goodmorningamerica: Book club for Good Morning America (https://www.goodmorningamerica.com/culture/story/shop-gma-book-club-picks-list--81520726)
- todayshow: Book club for The Today Show (hosted by Jenna Bush Hager) (https://www.today.com/shop/read-jenna-book-club-list-today-s-jenna-bush-hager-t164652)

To run this API locally:
1) clone the repo 'git clone https://github.com/haileyhoyat/celebrity-book-clubs-api.git'.
2) Run the command 'npm install && npm start'.

The API returns books from each book list in a json format. 

Example json() response object: 

{
    "book_list": "todayshow",

    "title": "The Sun Sets in Singapore",

    "author": "Kehinde Fadipe",

    "date": {

      "month": "November",

      "year": "2023"

    }    
}

API endpoint to return books from all book lists: https://celebrity-book-clubs-api-git-main-hails-projects-2a5888c5.vercel.app/books

API endpoint to return books from a specific book list: https://celebrity-book-clubs-api-git-main-hails-projects-2a5888c5.vercel.app/books/{book_list}

