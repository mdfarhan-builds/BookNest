document.addEventListener("DOMContentLoaded", function () {
    const books = [
        { id: 1, title: "The Great Gatsby", price: 100, image: "images/book1.jpg", file: "pdfs/great-gatsby.pdf" },
        { id: 2, title: "1984", price: 500, image: "images/book2.jpg" },
        { id: 3, title: "To Kill a Mockingbird", price: 699, image: "images/book3.jpg" },
        { id: 4, title: "Harry Potter", price: 100, image: "images/book4.jpg" },
        { id: 5, title: "The Hobbit", price: 100, image: "images/book5.jpg" },
        { id: 6, title: "Treasure Island", price: 949, image: "images/book6.jpg" },
        { id: 7, title: "The Call of the Wild", price: 569, image: "images/book7.jpg" },
        { id: 8, title: "The Three Musketeers", price: 159, image: "images/book8.jpg" },
        { id: 9, title: "Moby-Dick", price: 749, image: "images/book9.jpg" },
        { id: 10, title: "King Solomon's Mines", price: 589, image: "images/book10.jpg" },
        { id: 11, title: "Jurassic Park", price: 259, image: "images/book11.jpg" },
        { id: 12, title: "The Martian", price: 459, image: "images/book12.jpg" },
        { id: 13, title: "It Ends With Us", price: 829, image: "images/book13.jpg" },
        { id: 14, title: "The Color Purple", price: 725, image: "images/book14.jpg" },
        { id: 15, title: "A Man Called OVE", price: 619, image: "images/book15.jpg" },
        { id: 16, title: "The Beekeeper of Aleppo", price: 899, image: "images/book16.jpg" },
        { id: 17, title: "A Thousand Splendid Suns", price: 549, image: "images/book17.jpg" },
        { id: 18, title: "The Alchemist", price: 329, image: "images/book18.jpg" },
        { id: 19, title: "The Stable Boy of Auschwitz", price: 569, image: "images/book19.jpg" },
        { id: 20, title: "Born Survivors", price: 459, image: "images/book20.jpg" },
        { id: 21, title: "The Ballad of Songbirds and Snakes", price: 819, image: "images/book21.jpg" },
        { id: 22, title: "Hide and Don't Seek", price: 999, image: "images/book22.jpg" },
        { id: 23, title: "Legendary", price: 799, image: "images/book23.jpg" },
        { id: 24, title: "SHIVAJI", price: 1299, image: "images/book24.jpg" },
        { id: 25, title: "The Mahabharata", price: 10, image: "images/book25.jpg" }
    ];

    const bookList = document.getElementById("books");
    const cartCount = document.getElementById("cart-count");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderBooks(booksToRender) {
        if (!bookList) return;
        bookList.innerHTML = "";
        booksToRender.forEach(book => {
            let bookElement = document.createElement("div");
            bookElement.classList.add("book");
            bookElement.innerHTML = `
                <img src="${book.image}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>Price: ₹${book.price}</p>
                <button onclick="addToCart(${book.id})">Add to Cart</button>
            `;
            bookList.appendChild(bookElement);
        });
    }

    window.addToCart = function (bookId) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            cart.push(book);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showPopup(`${book.title} added to cart!`);
        }
    };

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Improved popup using existing .popup class
    function showPopup(message) {
        let popup = document.createElement("div");
        popup.className = "popup";
        popup.textContent = message;
        document.body.appendChild(popup);
        popup.style.display = "block";

        setTimeout(() => {
            popup.style.display = "none";
            document.body.removeChild(popup);
        }, 2200);
    }

    // Search
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(query)
        );
        renderBooks(filteredBooks);
    });

    // Sort
    sortSelect.addEventListener("change", function () {
        let sortedBooks = [...books];
        if (sortSelect.value === "price-low") {
            sortedBooks.sort((a, b) => a.price - b.price);
        } else if (sortSelect.value === "price-high") {
            sortedBooks.sort((a, b) => b.price - a.price);
        }
        renderBooks(sortedBooks);
    });

    renderBooks(books);
    updateCartCount();
});
